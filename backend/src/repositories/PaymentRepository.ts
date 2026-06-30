import { Prisma } from '@prisma/client';

export interface PaymentRepository {
  findById(id: string): Promise<Prisma.PaymentGetPayload<null> | null>;
  findByTenantId(tenantId: string, params?: { skip?: number; take?: number }): Promise<Prisma.PaymentGetPayload<null>[]>;
  findByInvoiceId(tenantId: string, invoiceId: string): Promise<Prisma.PaymentGetPayload<null>[]>;
  findByReferenceNumber(tenantId: string, referenceNumber: string): Promise<Prisma.PaymentGetPayload<null> | null>;
  create(data: Prisma.PaymentCreateInput): Promise<Prisma.PaymentGetPayload<null>>;
  update(id: string, data: Prisma.PaymentUpdateInput): Promise<Prisma.PaymentGetPayload<null>>;
  delete(id: string): Promise<Prisma.PaymentGetPayload<null>>;
  softDelete(id: string): Promise<Prisma.PaymentGetPayload<null>>;
}
