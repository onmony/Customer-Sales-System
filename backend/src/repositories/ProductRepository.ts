import { Prisma } from '@prisma/client';

export interface ProductRepository {
  findById(id: string): Promise<Prisma.ProductGetPayload<null> | null>;
  findByTenantId(tenantId: string): Promise<Prisma.ProductGetPayload<null>[]>;
  findBySku(tenantId: string, sku: string): Promise<Prisma.ProductGetPayload<null> | null>;
  findBySkuExcludingId(tenantId: string, sku: string, excludeId: string): Promise<Prisma.ProductGetPayload<null> | null>;
  findByActive(tenantId: string, isActive: boolean): Promise<Prisma.ProductGetPayload<null>[]>;
  search(tenantId: string, query: string, skip?: number, take?: number): Promise<Prisma.ProductGetPayload<null>[]>;
  create(data: {
    tenantId: string;
    displayName: string;
    sku?: string;
    unit: string;
    isActive?: boolean;
    createdBy?: string;
  }): Promise<Prisma.ProductGetPayload<null>>;
  update(id: string, data: {
    displayName?: string;
    sku?: string;
    unit?: string;
    isActive?: boolean;
    updatedBy?: string;
  }): Promise<Prisma.ProductGetPayload<null>>;
  archive(id: string): Promise<Prisma.ProductGetPayload<null>>;
  list(tenantId: string, skip?: number, take?: number): Promise<Prisma.ProductGetPayload<null>[]>;
}
