import { CustomerRepository } from '../repositories/CustomerRepository';
import { ProductRepository } from '../repositories/ProductRepository';
import { OrderRepository } from '../repositories/OrderRepository';

export interface InvoiceDocumentSnapshot {
  customer: {
    id: string;
    name: string;
    gstNumber?: string | null;
    billingAddress: any;
    shippingAddress: any;
  };
  order: {
    id: string;
    orderNumber: string;
    orderDate: Date;
    totalAmount: number;
    currency: string;
  };
  items: Array<{
    productId: string;
    product: {
      code: string;
      name: string;
      unit: string;
    };
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    currency: string;
    pricing: {
      version: number;
      effectiveDate: Date;
      source: string;
    };
  }>;
  totals: {
    totalAmount: number;
    currency: string;
    taxAmount: number;
    discountAmount: number;
  };
  metadata: {
    generatedAt: string;
    generatedFrom: string;
    orderId: string;
    orderNumber: string;
  };
}

export class InvoiceSnapshotBuilder {
  constructor(
    private customerRepository: CustomerRepository,
    private productRepository: ProductRepository,
    private orderRepository: OrderRepository
  ) {}

  async buildFromOrder(orderId: string): Promise<InvoiceDocumentSnapshot> {
    // Fetch order with items
    const order = await this.orderRepository.findByIdWithItems(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Fetch order items
    const orderItems = await this.orderRepository.findOrderItemsByOrderId(orderId);
    if (orderItems.length === 0) {
      throw new Error('Cannot generate invoice snapshot for order without items');
    }

    // Fetch customer data
    const customer = await this.customerRepository.findById(order.customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    // Build documentSnapshot
    const documentSnapshot: InvoiceDocumentSnapshot = {
      customer: {
        id: customer.id,
        name: customer.displayName,
        gstNumber: customer.gstNumber,
        billingAddress: null, // TODO: Fetch from customer address when available
        shippingAddress: null, // TODO: Fetch from customer address when available
      },
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        orderDate: order.orderDate,
        totalAmount: Number(order.totalAmount),
        currency: order.currency,
      },
      items: await Promise.all(orderItems.map(async (item) => {
        const product = await this.productRepository.findById(item.productId);
        return {
          productId: item.productId,
          product: {
            code: product?.sku || '',
            name: product?.displayName || '',
            unit: product?.unit || '',
          },
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice),
          lineTotal: Number(item.lineTotal),
          currency: item.currency,
          pricing: {
            version: item.pricingSnapshotVersion,
            effectiveDate: item.pricingSnapshotEffectiveDate,
            source: item.pricingSnapshotSource,
          },
        };
      })),
      totals: {
        totalAmount: Number(order.totalAmount),
        currency: order.currency,
        taxAmount: 0, // TODO: Calculate when tax logic is implemented
        discountAmount: 0, // TODO: Calculate when discount logic is implemented
      },
      metadata: {
        generatedAt: new Date().toISOString(),
        generatedFrom: 'order',
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
    };

    return documentSnapshot;
  }
}
