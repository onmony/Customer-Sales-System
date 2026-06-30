import { Prisma } from '@prisma/client';

export interface CustomerRepository {
  findById(id: string): Promise<Prisma.CustomerGetPayload<null> | null>;
  findByTenantId(tenantId: string, params?: { skip?: number; take?: number }): Promise<Prisma.CustomerGetPayload<null>[]>;
  findByGstNumber(tenantId: string, gstNumber: string): Promise<Prisma.CustomerGetPayload<null> | null>;
  create(data: Prisma.CustomerCreateInput): Promise<Prisma.CustomerGetPayload<null>>;
  update(id: string, data: Prisma.CustomerUpdateInput): Promise<Prisma.CustomerGetPayload<null>>;
  delete(id: string): Promise<Prisma.CustomerGetPayload<null>>;
  softDelete(id: string): Promise<Prisma.CustomerGetPayload<null>>;
}
