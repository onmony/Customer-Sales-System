import { Prisma } from '@prisma/client';

export interface ProductRepository {
  findById(id: string): Promise<Prisma.ProductGetPayload<null> | null>;
  findByTenantId(tenantId: string, params?: { skip?: number; take?: number }): Promise<Prisma.ProductGetPayload<null>[]>;
  findBySku(tenantId: string, sku: string): Promise<Prisma.ProductGetPayload<null> | null>;
  create(data: Prisma.ProductCreateInput): Promise<Prisma.ProductGetPayload<null>>;
  update(id: string, data: Prisma.ProductUpdateInput): Promise<Prisma.ProductGetPayload<null>>;
  delete(id: string): Promise<Prisma.ProductGetPayload<null>>;
  softDelete(id: string): Promise<Prisma.ProductGetPayload<null>>;
}
