import { Prisma } from '@prisma/client';

export interface PricingRepository {
  findById(id: string): Promise<Prisma.PricingGetPayload<null> | null>;
  findByTenantId(tenantId: string, params?: { skip?: number; take?: number }): Promise<Prisma.PricingGetPayload<null>[]>;
  findByCustomerProduct(tenantId: string, customerId: string, productId: string): Promise<Prisma.PricingGetPayload<null>[]>;
  findActivePricing(tenantId: string, customerId: string, productId: string, date: Date): Promise<Prisma.PricingGetPayload<null> | null>;
  create(data: Prisma.PricingCreateInput): Promise<Prisma.PricingGetPayload<null>>;
  update(id: string, data: Prisma.PricingUpdateInput): Promise<Prisma.PricingGetPayload<null>>;
  delete(id: string): Promise<Prisma.PricingGetPayload<null>>;
  softDelete(id: string): Promise<Prisma.PricingGetPayload<null>>;
}
