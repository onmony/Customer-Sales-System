import { Prisma } from '@prisma/client';

export interface DeliveryRepository {
  findById(id: string): Promise<Prisma.DeliveryGetPayload<null> | null>;
  findByTenantId(tenantId: string, params?: { skip?: number; take?: number }): Promise<Prisma.DeliveryGetPayload<null>[]>;
  findByShipmentId(tenantId: string, shipmentId: string): Promise<Prisma.DeliveryGetPayload<null> | null>;
  findByCustomerId(tenantId: string, customerId: string, params?: { skip?: number; take?: number }): Promise<Prisma.DeliveryGetPayload<null>[]>;
  findByStatus(tenantId: string, status: string, params?: { skip?: number; take?: number }): Promise<Prisma.DeliveryGetPayload<null>[]>;
  create(data: Prisma.DeliveryCreateInput): Promise<Prisma.DeliveryGetPayload<null>>;
  update(id: string, data: Prisma.DeliveryUpdateInput): Promise<Prisma.DeliveryGetPayload<null>>;
  delete(id: string): Promise<Prisma.DeliveryGetPayload<null>>;
  softDelete(id: string): Promise<Prisma.DeliveryGetPayload<null>>;
}
