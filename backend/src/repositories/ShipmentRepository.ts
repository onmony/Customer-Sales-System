import { Prisma } from '@prisma/client';

export interface ShipmentRepository {
  findById(id: string): Promise<Prisma.ShipmentGetPayload<null> | null>;
  findByTenantId(tenantId: string, params?: { skip?: number; take?: number }): Promise<Prisma.ShipmentGetPayload<null>[]>;
  findByCustomerId(tenantId: string, customerId: string, params?: { skip?: number; take?: number }): Promise<Prisma.ShipmentGetPayload<null>[]>;
  findByTrackingNumber(tenantId: string, trackingNumber: string): Promise<Prisma.ShipmentGetPayload<null> | null>;
  findByStatus(tenantId: string, status: string, params?: { skip?: number; take?: number }): Promise<Prisma.ShipmentGetPayload<null>[]>;
  create(data: Prisma.ShipmentCreateInput): Promise<Prisma.ShipmentGetPayload<null>>;
  update(id: string, data: Prisma.ShipmentUpdateInput): Promise<Prisma.ShipmentGetPayload<null>>;
  delete(id: string): Promise<Prisma.ShipmentGetPayload<null>>;
  softDelete(id: string): Promise<Prisma.ShipmentGetPayload<null>>;
}
