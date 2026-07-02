import { PrismaClient, Pricing } from '@prisma/client';
import { PricingRepository } from '../PricingRepository';

const prisma = new PrismaClient();

export class PricingRepositoryImpl implements PricingRepository {
  async findById(id: string): Promise<Pricing | null> {
    return prisma.pricing.findUnique({
      where: { id },
      include: {
        tenant: true,
        customer: true,
        product: true,
        status: true,
      },
    });
  }

  async findByTenantId(tenantId: string, skip?: number, take?: number): Promise<Pricing[]> {
    return prisma.pricing.findMany({
      where: {
        tenantId,
        deletedAt: null,
      },
      include: {
        tenant: true,
        customer: true,
        product: true,
        status: true,
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCustomerProduct(tenantId: string, customerId: string, productId: string): Promise<Pricing[]> {
    return prisma.pricing.findMany({
      where: {
        tenantId,
        customerId,
        productId,
        deletedAt: null,
      },
      include: {
        tenant: true,
        customer: true,
        product: true,
        status: true,
      },
      orderBy: { effectiveDate: 'desc' },
    });
  }

  async findActivePricing(tenantId: string, customerId: string, productId: string, date: Date): Promise<Pricing | null> {
    return prisma.pricing.findFirst({
      where: {
        tenantId,
        customerId,
        productId,
        effectiveDate: { lte: date },
        OR: [
          { expiryDate: null },
          { expiryDate: { gte: date } },
        ],
        deletedAt: null,
      },
      include: {
        tenant: true,
        customer: true,
        product: true,
        status: true,
      },
      orderBy: { effectiveDate: 'desc' },
    });
  }

  async findOverlappingPricing(
    tenantId: string,
    customerId: string,
    productId: string,
    effectiveDate: Date,
    excludeId?: string
  ): Promise<Pricing | null> {
    return prisma.pricing.findFirst({
      where: {
        tenantId,
        customerId,
        productId,
        effectiveDate,
        deletedAt: null,
        ...(excludeId && { id: { not: excludeId } }),
      },
      include: {
        tenant: true,
        customer: true,
        product: true,
        status: true,
      },
    });
  }

  async create(data: {
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
  }): Promise<Pricing> {
    return prisma.pricing.create({
      data: {
        tenant: {
          connect: { id: data.tenantId },
        },
        customer: {
          connect: { id: data.customerId },
        },
        product: {
          connect: { id: data.productId },
        },
        status: {
          connect: { id: data.statusId },
        },
        price: data.price,
        currency: data.currency || 'INR',
        effectiveDate: data.effectiveDate,
        expiryDate: data.expiryDate,
        version: data.version,
        createdBy: data.createdBy,
        updatedBy: data.updatedBy,
      },
      include: {
        tenant: true,
        customer: true,
        product: true,
        status: true,
      },
    });
  }

  async updateStatus(id: string, statusId: string, updatedBy?: string): Promise<Pricing> {
    return prisma.pricing.update({
      where: { id },
      data: {
        status: {
          connect: { id: statusId },
        },
        updatedBy,
      },
      include: {
        tenant: true,
        customer: true,
        product: true,
        status: true,
      },
    });
  }

  async archive(id: string): Promise<Pricing> {
    return prisma.pricing.update({
      where: { id },
      data: { deletedAt: new Date() },
      include: {
        tenant: true,
        customer: true,
        product: true,
        status: true,
      },
    });
  }

  async list(tenantId: string, skip?: number, take?: number): Promise<Pricing[]> {
    return prisma.pricing.findMany({
      where: {
        tenantId,
        deletedAt: null,
      },
      include: {
        tenant: true,
        customer: true,
        product: true,
        status: true,
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Status lookup methods (shared across modules)
  async findStatusById(id: string): Promise<any | null> {
    return prisma.orderStatus.findUnique({
      where: { id },
    });
  }

  async findStatusByCode(code: string): Promise<any | null> {
    return prisma.orderStatus.findUnique({
      where: { code },
    });
  }
}
