import { Prisma } from '@prisma/client';

export interface InvoiceRepository {
  findById(id: string): Promise<Prisma.InvoiceGetPayload<null> | null>;
  findByTenantId(tenantId: string, params?: { skip?: number; take?: number }): Promise<Prisma.InvoiceGetPayload<null>[]>;
  findByInvoiceNumber(tenantId: string, invoiceNumber: string): Promise<Prisma.InvoiceGetPayload<null> | null>;
  findByOrderId(tenantId: string, orderId: string): Promise<Prisma.InvoiceGetPayload<null>[]>;
  findByCustomerId(tenantId: string, customerId: string, params?: { skip?: number; take?: number }): Promise<Prisma.InvoiceGetPayload<null>[]>;
  create(data: Prisma.InvoiceCreateInput): Promise<Prisma.InvoiceGetPayload<null>>;
  update(id: string, data: Prisma.InvoiceUpdateInput): Promise<Prisma.InvoiceGetPayload<null>>;
  delete(id: string): Promise<Prisma.InvoiceGetPayload<null>>;
  softDelete(id: string): Promise<Prisma.InvoiceGetPayload<null>>;
}
