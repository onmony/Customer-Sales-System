import { Prisma } from '@prisma/client';

export interface PricingRepository {
  findById(id: string): Promise<Prisma.PricingGetPayload<null> | null>;
  findByTenantId(tenantId: string, skip?: number, take?: number): Promise<Prisma.PricingGetPayload<null>[]>;
  findByCustomerProduct(tenantId: string, customerId: string, productId: string): Promise<Prisma.PricingGetPayload<null>[]>;
  findActivePricing(tenantId: string, customerId: string, productId: string, date: Date): Promise<Prisma.PricingGetPayload<null> | null>;
  findOverlappingPricing(tenantId: string, customerId: string, productId: string, effectiveDate: Date, excludeId?: string): Promise<Prisma.PricingGetPayload<null> | null>;
  create(data: {
    tenantId: string;
    customerId: string;
    productId: string;
    price: number;
    currency?: string;
    effectiveDate: Date;
    expiryDate?: Date;
    statusId: string;
    version: number;
    createdBy?: string;
    updatedBy?: string;
  }): Promise<Prisma.PricingGetPayload<null>>;
  updateStatus(id: string, statusId: string, updatedBy?: string): Promise<Prisma.PricingGetPayload<null>>;
  archive(id: string): Promise<Prisma.PricingGetPayload<null>>;
  list(tenantId: string, skip?: number, take?: number): Promise<Prisma.PricingGetPayload<null>[]>;
}
