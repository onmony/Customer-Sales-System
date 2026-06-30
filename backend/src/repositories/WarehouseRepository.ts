import { Prisma } from '@prisma/client';

export interface WarehouseRepository {
  findById(id: string): Promise<Prisma.WarehouseRequestGetPayload<null> | null>;
  findByTenantId(tenantId: string, params?: { skip?: number; take?: number }): Promise<Prisma.WarehouseRequestGetPayload<null>[]>;
  findByOrderId(tenantId: string, orderId: string): Promise<Prisma.WarehouseRequestGetPayload<null> | null>;
  findByStatus(tenantId: string, status: string, params?: { skip?: number; take?: number }): Promise<Prisma.WarehouseRequestGetPayload<null>[]>;
  create(data: Prisma.WarehouseRequestCreateInput): Promise<Prisma.WarehouseRequestGetPayload<null>>;
  update(id: string, data: Prisma.WarehouseRequestUpdateInput): Promise<Prisma.WarehouseRequestGetPayload<null>>;
  delete(id: string): Promise<Prisma.WarehouseRequestGetPayload<null>>;
  softDelete(id: string): Promise<Prisma.WarehouseRequestGetPayload<null>>;
}
