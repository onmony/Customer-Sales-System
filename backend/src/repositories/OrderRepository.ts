import { Prisma } from '@prisma/client';

export interface OrderRepository {
  findById(id: string): Promise<Prisma.OrderGetPayload<null> | null>;
  findByTenantId(tenantId: string, params?: { skip?: number; take?: number }): Promise<Prisma.OrderGetPayload<null>[]>;
  findByOrderNumber(tenantId: string, orderNumber: string): Promise<Prisma.OrderGetPayload<null> | null>;
  findByCustomerId(tenantId: string, customerId: string, params?: { skip?: number; take?: number }): Promise<Prisma.OrderGetPayload<null>[]>;
  create(data: Prisma.OrderCreateInput): Promise<Prisma.OrderGetPayload<null>>;
  update(id: string, data: Prisma.OrderUpdateInput): Promise<Prisma.OrderGetPayload<null>>;
  delete(id: string): Promise<Prisma.OrderGetPayload<null>>;
  softDelete(id: string): Promise<Prisma.OrderGetPayload<null>>;
}
