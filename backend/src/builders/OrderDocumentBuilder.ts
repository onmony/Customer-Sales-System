import { OrderRepository } from '../repositories/OrderRepository';
import { DocumentBuilder, DocumentPayload } from './DocumentBuilder';

export interface OrderDocumentPayload extends DocumentPayload {
  customer: {
    id: string;
    name: string;
    gstNumber: string | null;
    billingAddress: unknown;
    shippingAddress: unknown;
  };
  order: {
    id: string;
    orderNumber: string;
    orderDate: string;
    currency: string;
    notes: string | null;
  };
  items: Array<{
    productId: string;
    product: {
      code: string | null;
      name: string;
      unit: string;
    };
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    currency: string;
    pricing: {
      version: number;
      effectiveDate: string;
      source: string;
    };
  }>;
  totals: {
    subtotal: number;
    tax: number;
    discount: number;
    grandTotal: number;
    currency: string;
  };
  metadata: {
    schemaVersion: number;
    generatedAt: string;
    generatedBy: string;
    correlationId: string | null;
  };
}

export class OrderDocumentBuilder implements DocumentBuilder<OrderDocumentPayload> {
  constructor(private orderRepository: OrderRepository) {}

  async build(id: string): Promise<OrderDocumentPayload> {
    const orderId = id;
    const order = await this.orderRepository.findByIdWithItems(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const orderItems = order.orderItems || await this.orderRepository.findOrderItemsByOrderId(orderId);
    const items = orderItems.map((item: any) => ({
      productId: item.productId,
      product: {
        code: item.productSnapshotCode,
        name: item.productSnapshotName,
        unit: item.productSnapshotUnit,
      },
      quantity: Number(item.quantity),
      unitPrice: Number(item.unitPrice),
      lineTotal: Number(item.lineTotal),
      currency: item.currency,
      pricing: {
        version: item.pricingSnapshotVersion,
        effectiveDate: toIsoString(item.pricingSnapshotEffectiveDate),
        source: item.pricingSnapshotSource,
      },
    }));

    const subtotal = items.reduce(
      (sum: number, item: OrderDocumentPayload['items'][number]) => sum + item.lineTotal,
      0
    );
    const tax = 0;
    const discount = 0;

    return {
      customer: {
        id: order.customerId,
        name: order.customerSnapshotName,
        gstNumber: order.customerSnapshotGstNumber,
        billingAddress: order.customerSnapshotBillingAddress,
        shippingAddress: order.customerSnapshotShippingAddress,
      },
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        orderDate: toIsoString(order.orderDate),
        currency: order.currency,
        notes: order.notes,
      },
      items,
      totals: {
        subtotal,
        tax,
        discount,
        grandTotal: Number(order.totalAmount),
        currency: order.currency,
      },
      metadata: {
        schemaVersion: order.snapshotSchemaVersion || 1,
        generatedAt: new Date().toISOString(),
        generatedBy: 'OrderDocumentBuilder',
        correlationId: order.correlationId,
      },
    };
  }
}

function toIsoString(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}
