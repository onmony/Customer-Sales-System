import { InvoiceRepository } from '../repositories/InvoiceRepository';
import { InvoiceValidator } from '../validation/InvoiceValidator';
import { OrderRepository } from '../repositories/OrderRepository';
import { CustomerRepository } from '../repositories/CustomerRepository';
import { ProductRepository } from '../repositories/ProductRepository';
import { PricingRepository } from '../repositories/PricingRepository';
import { InvoiceSnapshotBuilder } from '../builders/InvoiceSnapshotBuilder';

export interface GenerateInvoiceInput {
  tenantId: string;
  orderId: string;
  createdBy?: string;
}

export interface IssueInvoiceInput {
  issuedBy?: string;
}

export interface CancelInvoiceInput {
  cancelledBy?: string;
}

export class InvoiceService {
  constructor(
    private invoiceRepository: InvoiceRepository,
    private orderRepository: OrderRepository,
    private customerRepository: CustomerRepository,
    private productRepository: ProductRepository,
    private pricingRepository: PricingRepository,
    private invoiceSnapshotBuilder: InvoiceSnapshotBuilder
  ) {}

  async generateInvoice(input: GenerateInvoiceInput) {
    // Validate input
    const tenantIdValidation = InvoiceValidator.validateTenantId(input.tenantId);
    if (!tenantIdValidation.isValid) {
      throw new Error(tenantIdValidation.errors.join(', '));
    }

    const orderIdValidation = InvoiceValidator.validateOrderId(input.orderId);
    if (!orderIdValidation.isValid) {
      throw new Error(orderIdValidation.errors.join(', '));
    }

    // Fetch order with items
    const order = await this.orderRepository.findByIdWithItems(input.orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Verify order belongs to tenant
    if (order.tenantId !== input.tenantId) {
      throw new Error('Order does not belong to the specified tenant');
    }

    // Validate order status - only Confirmed orders can generate invoices
    const orderStatusValidation = InvoiceValidator.validateOrderForInvoiceGeneration(order.status.code);
    if (!orderStatusValidation.isValid) {
      throw new Error(orderStatusValidation.errors.join(', '));
    }

    // Check if invoice already exists for this order
    const existingInvoices = await this.invoiceRepository.findByOrderId(input.tenantId, input.orderId);
    if (existingInvoices.length > 0) {
      throw new Error('Invoice already exists for this order');
    }

    // Generate invoice number (sequential tenant-scoped)
    const nextInvoiceNumber = await this.invoiceRepository.getNextInvoiceNumber(input.tenantId);

    // Find draft status
    const draftStatus = await this.pricingRepository.findStatusByCode?.('draft');
    if (!draftStatus) {
      throw new Error('Draft status not found');
    }

    // Build documentSnapshot using InvoiceSnapshotBuilder
    const documentSnapshot = await this.invoiceSnapshotBuilder.buildFromOrder(input.orderId);

    // Create invoice with documentSnapshot
    const invoice = await this.invoiceRepository.create({
      tenant: { connect: { id: input.tenantId } },
      order: { connect: { id: input.orderId } },
      customer: { connect: { id: order.customerId } },
      status: { connect: { id: draftStatus.id } },
      invoiceNumber: nextInvoiceNumber.toString(),
      totalAmount: order.totalAmount,
      currency: order.currency,
      documentSnapshot: documentSnapshot as any,
      snapshotSchemaVersion: 1,
      createdBy: input.createdBy,
    } as any);

    // Create invoice items with snapshots
    for (const orderItem of orderItems) {
      const product = await this.productRepository.findById(orderItem.productId);
      if (!product) {
        throw new Error(`Product not found: ${orderItem.productId}`);
      }

      await this.invoiceRepository.createInvoiceItem({
        invoice: { connect: { id: invoice.id } },
        product: { connect: { id: orderItem.productId } },
        quantity: orderItem.quantity,
        unitPrice: orderItem.unitPrice,
        lineTotal: orderItem.lineTotal,
        currency: orderItem.currency,
        productSnapshotCode: product.sku,
        productSnapshotName: product.displayName,
        productSnapshotUnit: product.unit,
        pricingSnapshotVersion: orderItem.pricingSnapshotVersion,
        pricingSnapshotEffectiveDate: orderItem.pricingSnapshotEffectiveDate,
        pricingSnapshotCurrency: orderItem.pricingSnapshotCurrency,
        pricingSnapshotSource: orderItem.pricingSnapshotSource,
        correlationId: orderItem.correlationId,
      } as any);
    }

    return this.invoiceRepository.findByIdWithItems(invoice.id);
  }

  async getInvoice(id: string) {
    const invoice = await this.invoiceRepository.findByIdWithItems(id);
    if (!invoice) {
      throw new Error('Invoice not found');
    }
    return invoice;
  }

  async listInvoices(tenantId: string, params?: { skip?: number; take?: number }) {
    const { skip, take } = params || {};

    const tenantIdValidation = InvoiceValidator.validateTenantId(tenantId);
    if (!tenantIdValidation.isValid) {
      throw new Error(tenantIdValidation.errors.join(', '));
    }

    const paginationValidation = InvoiceValidator.validatePagination(skip, take);
    if (!paginationValidation.isValid) {
      throw new Error(paginationValidation.errors.join(', '));
    }

    return this.invoiceRepository.findByTenantId(tenantId, { skip, take });
  }

  async listCustomerInvoices(tenantId: string, customerId: string, params?: { skip?: number; take?: number }) {
    const { skip, take } = params || {};

    const tenantIdValidation = InvoiceValidator.validateTenantId(tenantId);
    if (!tenantIdValidation.isValid) {
      throw new Error(tenantIdValidation.errors.join(', '));
    }

    const customerIdValidation = InvoiceValidator.validateCustomerId(customerId);
    if (!customerIdValidation.isValid) {
      throw new Error(customerIdValidation.errors.join(', '));
    }

    const paginationValidation = InvoiceValidator.validatePagination(skip, take);
    if (!paginationValidation.isValid) {
      throw new Error(paginationValidation.errors.join(', '));
    }

    return this.invoiceRepository.findByCustomerId(tenantId, customerId, { skip, take });
  }

  async getInvoiceByOrder(tenantId: string, orderId: string) {
    const tenantIdValidation = InvoiceValidator.validateTenantId(tenantId);
    if (!tenantIdValidation.isValid) {
      throw new Error(tenantIdValidation.errors.join(', '));
    }

    const orderIdValidation = InvoiceValidator.validateOrderId(orderId);
    if (!orderIdValidation.isValid) {
      throw new Error(orderIdValidation.errors.join(', '));
    }

    const invoices = await this.invoiceRepository.findByOrderId(tenantId, orderId);
    if (invoices.length === 0) {
      throw new Error('Invoice not found for this order');
    }

    // Return the most recent invoice
    return invoices[0];
  }

  async issueInvoice(invoiceId: string, input: IssueInvoiceInput) {
    // Check if invoice exists
    const existing = await this.invoiceRepository.findById(invoiceId);
    if (!existing) {
      throw new Error('Invoice not found');
    }

    // Fetch status separately to get the status code
    const status = await this.pricingRepository.findStatusById?.(existing.statusId);
    if (!status) {
      throw new Error('Invoice status not found');
    }

    // Validate that invoice can be issued (only Draft invoices in Module 7)
    const statusValidation = InvoiceValidator.validateInvoiceStatusForIssue(status.code);
    if (!statusValidation.isValid) {
      throw new Error(statusValidation.errors.join(', '));
    }

    // Verify invoice has items
    const invoiceItems = await this.invoiceRepository.findInvoiceItemsByInvoiceId(invoiceId);
    if (invoiceItems.length === 0) {
      throw new Error('Cannot issue invoice without items');
    }

    // Find issued status
    const issuedStatus = await this.pricingRepository.findStatusByCode?.('issued');
    if (!issuedStatus) {
      throw new Error('Issued status not found');
    }

    // Update invoice status to issued and set issuedAt
    return this.invoiceRepository.update(invoiceId, {
      status: { connect: { id: issuedStatus.id } },
      issuedAt: new Date(),
      updatedBy: input.issuedBy,
    } as any);
  }

  async cancelInvoice(invoiceId: string, input: CancelInvoiceInput) {
    // Check if invoice exists
    const existing = await this.invoiceRepository.findById(invoiceId);
    if (!existing) {
      throw new Error('Invoice not found');
    }

    // Fetch status separately to get the status code
    const status = await this.pricingRepository.findStatusById?.(existing.statusId);
    if (!status) {
      throw new Error('Invoice status not found');
    }

    // Validate that invoice can be cancelled (only Draft invoices in Module 7)
    const statusValidation = InvoiceValidator.validateInvoiceStatusForCancel(status.code);
    if (!statusValidation.isValid) {
      throw new Error(statusValidation.errors.join(', '));
    }

    // Find cancelled status
    const cancelledStatus = await this.pricingRepository.findStatusByCode?.('cancelled');
    if (!cancelledStatus) {
      throw new Error('Cancelled status not found');
    }

    // Update invoice status to cancelled
    return this.invoiceRepository.update(invoiceId, {
      status: { connect: { id: cancelledStatus.id } },
      updatedBy: input.cancelledBy,
    } as any);
  }

  async getInvoiceHistory(invoiceId: string) {
    const invoice = await this.invoiceRepository.findByIdWithItems(invoiceId);
    if (!invoice) {
      throw new Error('Invoice not found');
    }

    // For Module 7, history is simply the current invoice with items
    // Future modules may add version history
    return invoice;
  }
}
