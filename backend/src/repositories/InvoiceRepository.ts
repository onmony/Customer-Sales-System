import { Prisma } from '@prisma/client';

export interface InvoiceRepository {
  findById(id: string): Promise<Prisma.InvoiceGetPayload<null> | null>;
  findByIdWithItems(id: string): Promise<Prisma.InvoiceGetPayload<null> | null>;
  findByTenantId(tenantId: string, params?: { skip?: number; take?: number }): Promise<Prisma.InvoiceGetPayload<null>[]>;
  findByInvoiceNumber(tenantId: string, invoiceNumber: string): Promise<Prisma.InvoiceGetPayload<null> | null>;
  findByOrderId(tenantId: string, orderId: string): Promise<Prisma.InvoiceGetPayload<null>[]>;
  findByCustomerId(tenantId: string, customerId: string, params?: { skip?: number; take?: number }): Promise<Prisma.InvoiceGetPayload<null>[]>;
  findByStatus(tenantId: string, statusId: string, params?: { skip?: number; take?: number }): Promise<Prisma.InvoiceGetPayload<null>[]>;
  create(data: Prisma.InvoiceCreateInput): Promise<Prisma.InvoiceGetPayload<null>>;
  update(id: string, data: Prisma.InvoiceUpdateInput): Promise<Prisma.InvoiceGetPayload<null>>;
  delete(id: string): Promise<Prisma.InvoiceGetPayload<null>>;
  softDelete(id: string): Promise<Prisma.InvoiceGetPayload<null>>;
  
  // InvoiceItem operations
  createInvoiceItem(data: Prisma.InvoiceItemCreateInput): Promise<Prisma.InvoiceItemGetPayload<null>>;
  updateInvoiceItem(id: string, data: Prisma.InvoiceItemUpdateInput): Promise<Prisma.InvoiceItemGetPayload<null>>;
  deleteInvoiceItem(id: string): Promise<Prisma.InvoiceItemGetPayload<null>>;
  softDeleteInvoiceItem(id: string): Promise<Prisma.InvoiceItemGetPayload<null>>;
  findInvoiceItemsByInvoiceId(invoiceId: string): Promise<Prisma.InvoiceItemGetPayload<null>[]>;
  findInvoiceItemById(id: string): Promise<Prisma.InvoiceItemGetPayload<null> | null>;
  
  // Invoice numbering
  getNextInvoiceNumber(tenantId: string): Promise<number>;
}
