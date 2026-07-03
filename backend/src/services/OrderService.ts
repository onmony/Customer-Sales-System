import { OrderRepository } from '../repositories/OrderRepository';
import { OrderValidator } from '../validation/OrderValidator';
import { CustomerRepository } from '../repositories/CustomerRepository';
import { ProductRepository } from '../repositories/ProductRepository';
import { PricingRepository } from '../repositories/PricingRepository';
import { OrderDocumentBuilder } from '../builders/OrderDocumentBuilder';

export interface CreateOrderInput {
  tenantId: string;
  customerId: string;
  orderNumber: string;
  statusId: string;
  notes?: string;
  createdBy?: string;
}

export interface UpdateOrderInput {
  notes?: string;
  updatedBy?: string;
}

export interface AddOrderItemInput {
  productId: string;
  quantity: number;
  createdBy?: string;
}

export interface UpdateOrderItemInput {
  quantity?: number;
  unitPrice?: number;
  lineTotal?: number;
  currency?: string;
  notes?: string;
  updatedBy?: string;
}

export class OrderService {
  constructor(
    private orderRepository: OrderRepository,
    private customerRepository: CustomerRepository,
    private productRepository: ProductRepository,
    private pricingRepository: PricingRepository,
    private orderDocumentBuilder = new OrderDocumentBuilder(orderRepository)
  ) {}

  async createOrder(input: CreateOrderInput) {
    // Validate input
    const tenantIdValidation = OrderValidator.validateTenantId(input.tenantId);
    if (!tenantIdValidation.isValid) {
      throw new Error(tenantIdValidation.errors.join(', '));
    }

    const customerIdValidation = OrderValidator.validateCustomerId(input.customerId);
    if (!customerIdValidation.isValid) {
      throw new Error(customerIdValidation.errors.join(', '));
    }

    const orderNumberValidation = OrderValidator.validateOrderNumber(input.orderNumber);
    if (!orderNumberValidation.isValid) {
      throw new Error(orderNumberValidation.errors.join(', '));
    }

    const statusIdValidation = OrderValidator.validateStatusId(input.statusId);
    if (!statusIdValidation.isValid) {
      throw new Error(statusIdValidation.errors.join(', '));
    }

    // Verify customer exists and belongs to tenant
    const customer = await this.customerRepository.findById(input.customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }
    if (customer.tenantId !== input.tenantId) {
      throw new Error('Customer does not belong to the specified tenant');
    }

    // Verify status is valid for Module 6 (draft, confirmed, cancelled)
    const status = await this.pricingRepository.findStatusById?.(input.statusId);
    if (status) {
      const validStatuses = ['draft', 'confirmed', 'cancelled'];
      if (!validStatuses.includes(status.code.toLowerCase())) {
        throw new Error(`Status ${status.code} is not valid for Module 6`);
      }
    }

    // Check for duplicate order number in tenant
    const existingOrder = await this.orderRepository.findByOrderNumber(input.tenantId, input.orderNumber);
    if (existingOrder) {
      throw new Error('Order number already exists in this tenant');
    }

    // Fetch customer snapshot data
    const customerSnapshot = {
      name: customer.displayName,
      gstNumber: customer.gstNumber,
      billingAddress: null, // TODO: Fetch from customer address when available
      shippingAddress: null, // TODO: Fetch from customer address when available
    };

    // Create order with customer snapshot
    const order = await this.orderRepository.create({
      tenant: { connect: { id: input.tenantId } },
      customer: { connect: { id: input.customerId } },
      status: { connect: { id: input.statusId } },
      orderNumber: input.orderNumber,
      totalAmount: 0,
      currency: 'INR',
      notes: input.notes,
      customerSnapshotName: customerSnapshot.name,
      customerSnapshotGstNumber: customerSnapshot.gstNumber,
      customerSnapshotBillingAddress: customerSnapshot.billingAddress,
      customerSnapshotShippingAddress: customerSnapshot.shippingAddress,
      createdBy: input.createdBy,
    } as any);

    await this.refreshOrderDocumentPayload(order.id, input.createdBy);

    return this.orderRepository.findById(order.id);
  }

  async getOrder(id: string) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }

  async getOrderWithItems(id: string) {
    const order = await this.orderRepository.findByIdWithItems(id);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }

  async listOrders(tenantId: string, params?: { skip?: number; take?: number }) {
    const { skip, take } = params || {};

    const tenantIdValidation = OrderValidator.validateTenantId(tenantId);
    if (!tenantIdValidation.isValid) {
      throw new Error(tenantIdValidation.errors.join(', '));
    }

    const paginationValidation = OrderValidator.validatePagination(skip, take);
    if (!paginationValidation.isValid) {
      throw new Error(paginationValidation.errors.join(', '));
    }

    return this.orderRepository.findByTenantId(tenantId, { skip, take });
  }

  async listCustomerOrders(tenantId: string, customerId: string, params?: { skip?: number; take?: number }) {
    const { skip, take } = params || {};

    const tenantIdValidation = OrderValidator.validateTenantId(tenantId);
    if (!tenantIdValidation.isValid) {
      throw new Error(tenantIdValidation.errors.join(', '));
    }

    const customerIdValidation = OrderValidator.validateCustomerId(customerId);
    if (!customerIdValidation.isValid) {
      throw new Error(customerIdValidation.errors.join(', '));
    }

    const paginationValidation = OrderValidator.validatePagination(skip, take);
    if (!paginationValidation.isValid) {
      throw new Error(paginationValidation.errors.join(', '));
    }

    return this.orderRepository.findByCustomerId(tenantId, customerId, { skip, take });
  }

  async updateOrder(id: string, input: UpdateOrderInput) {
    // Check if order exists
    const existing = await this.orderRepository.findById(id);
    if (!existing) {
      throw new Error('Order not found');
    }

    // Validate that order can be edited (only Draft orders in Module 6)
    const statusValidation = OrderValidator.validateOrderStatusForEdit(existing.status.code);
    if (!statusValidation.isValid) {
      throw new Error(statusValidation.errors.join(', '));
    }

    // Update order
    await this.orderRepository.update(id, {
      notes: input.notes,
      updatedBy: input.updatedBy,
    });

    return this.refreshOrderDocumentPayload(id, input.updatedBy);
  }

  async confirmOrder(id: string, updatedBy?: string) {
    // Check if order exists
    const existing = await this.orderRepository.findById(id);
    if (!existing) {
      throw new Error('Order not found');
    }

    // Validate that order can be confirmed (only Draft orders in Module 6)
    const statusValidation = OrderValidator.validateOrderStatusForConfirm(existing.status.code);
    if (!statusValidation.isValid) {
      throw new Error(statusValidation.errors.join(', '));
    }

    // Verify order has at least one item
    const orderItems = await this.orderRepository.findOrderItemsByOrderId(id);
    if (orderItems.length === 0) {
      throw new Error('Cannot confirm order without items');
    }

    // Find confirmed status
    const confirmedStatus = await this.pricingRepository.findStatusByCode?.('confirmed');
    if (!confirmedStatus) {
      throw new Error('Confirmed status not found');
    }

    const orderDocumentPayload = await this.orderDocumentBuilder.build(id);

    // Update order status and freeze document payload for rendering.
    return this.orderRepository.updateStatusAndDocumentPayload(id, confirmedStatus.id, orderDocumentPayload as any, updatedBy);
  }

  async cancelOrder(id: string, updatedBy?: string) {
    // Check if order exists
    const existing = await this.orderRepository.findById(id);
    if (!existing) {
      throw new Error('Order not found');
    }

    // Validate that order can be cancelled (only Draft orders in Module 6)
    const statusValidation = OrderValidator.validateOrderStatusForCancel(existing.status.code);
    if (!statusValidation.isValid) {
      throw new Error(statusValidation.errors.join(', '));
    }

    // Find cancelled status
    const cancelledStatus = await this.pricingRepository.findStatusByCode?.('cancelled');
    if (!cancelledStatus) {
      throw new Error('Cancelled status not found');
    }

    // Update order status to cancelled
    return this.orderRepository.updateStatus(id, cancelledStatus.id, updatedBy);
  }

  async addOrderItem(orderId: string, input: AddOrderItemInput) {
    // Check if order exists
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Validate that order can be edited (only Draft orders in Module 6)
    const statusValidation = OrderValidator.validateOrderStatusForEdit(order.status.code);
    if (!statusValidation.isValid) {
      throw new Error(statusValidation.errors.join(', '));
    }

    // Verify product exists and belongs to tenant
    const product = await this.productRepository.findById(input.productId);
    if (!product) {
      throw new Error('Product not found');
    }
    if (product.tenantId !== order.tenantId) {
      throw new Error('Product does not belong to the order tenant');
    }

    // Resolve pricing internally using Pricing module
    const pricing = await this.pricingRepository.findActivePricing(
      order.tenantId,
      order.customerId,
      input.productId,
      new Date()
    );

    if (!pricing) {
      throw new Error('No active pricing found for this customer-product pair');
    }

    // Calculate line total
    const lineTotal = input.quantity * Number(pricing.price);

    // Create order item with automatically resolved snapshots
    const orderItem = await this.orderRepository.createOrderItem({
      id: crypto.randomUUID(),
      orderId,
      productId: input.productId,
      quantity: input.quantity,
      unitPrice: pricing.price,
      lineTotal,
      currency: pricing.currency,
      notes: null,
      productSnapshotCode: product.sku,
      productSnapshotName: product.displayName,
      productSnapshotUnit: product.unit,
      pricingSnapshotVersion: pricing.version,
      pricingSnapshotEffectiveDate: pricing.effectiveDate,
      pricingSnapshotCurrency: pricing.currency,
      pricingSnapshotSource: 'CUSTOMER_PRICE', // Resolved from customer-specific pricing
      createdBy: input.createdBy,
    } as any);

    // Update order total
    const currentItems = await this.orderRepository.findOrderItemsByOrderId(orderId);
    const newTotal = currentItems.reduce((sum, item) => sum + Number(item.lineTotal), 0);
    await this.orderRepository.update(orderId, { totalAmount: newTotal } as any);
    await this.refreshOrderDocumentPayload(orderId, input.createdBy);

    return orderItem;
  }

  async updateOrderItem(orderItemId: string, input: UpdateOrderItemInput) {
    // Check if order item exists
    const orderItem = await this.orderRepository.findOrderItemById(orderItemId);
    if (!orderItem) {
      throw new Error('Order item not found');
    }

    // Check if order exists and can be edited
    const order = await this.orderRepository.findById(orderItem.orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const statusValidation = OrderValidator.validateOrderStatusForEdit(order.status.code);
    if (!statusValidation.isValid) {
      throw new Error(statusValidation.errors.join(', '));
    }

    // Update order item
    const updatedItem = await this.orderRepository.updateOrderItem(orderItemId, input);

    // Recalculate line total if quantity or unit price changed
    if (input.quantity !== undefined || input.unitPrice !== undefined) {
      const newQuantity = input.quantity !== undefined ? input.quantity : Number(orderItem.quantity);
      const newUnitPrice = input.unitPrice !== undefined ? input.unitPrice : Number(orderItem.unitPrice);
      const newLineTotal = newQuantity * newUnitPrice;
      
      await this.orderRepository.updateOrderItem(orderItemId, { lineTotal: newLineTotal } as any);
      
      // Update order total
      const currentItems = await this.orderRepository.findOrderItemsByOrderId(order.id);
      const newTotal = currentItems.reduce((sum, item) => sum + Number(item.lineTotal), 0);
      await this.orderRepository.update(order.id, { totalAmount: newTotal } as any);
    }

    await this.refreshOrderDocumentPayload(order.id, input.updatedBy);

    return updatedItem;
  }

  async removeOrderItem(orderItemId: string) {
    // Check if order item exists
    const orderItem = await this.orderRepository.findOrderItemById(orderItemId);
    if (!orderItem) {
      throw new Error('Order item not found');
    }

    // Check if order exists and can be edited
    const order = await this.orderRepository.findById(orderItem.orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const statusValidation = OrderValidator.validateOrderStatusForEdit(order.status.code);
    if (!statusValidation.isValid) {
      throw new Error(statusValidation.errors.join(', '));
    }

    // Soft delete order item
    await this.orderRepository.softDeleteOrderItem(orderItemId);

    // Update order total
    const currentItems = await this.orderRepository.findOrderItemsByOrderId(order.id);
    const newTotal = currentItems.reduce((sum, item) => sum + Number(item.lineTotal), 0);
    await this.orderRepository.update(order.id, { totalAmount: newTotal } as any);
    await this.refreshOrderDocumentPayload(order.id);

    return orderItem;
  }

  async getOrderHistory(orderId: string) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // For Module 6, history is simply the current order with items
    // Future modules may add version history
    return this.orderRepository.findByIdWithItems(orderId);
  }

  private async refreshOrderDocumentPayload(orderId: string, updatedBy?: string) {
    const orderDocumentPayload = await this.orderDocumentBuilder.build(orderId);
    return this.orderRepository.updateDocumentPayload(orderId, orderDocumentPayload as any, updatedBy);
  }
}
