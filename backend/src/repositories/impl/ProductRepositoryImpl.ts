import { PrismaClient, Product } from '@prisma/client';
import { ProductRepository } from '../ProductRepository';

const prisma = new PrismaClient();

export class ProductRepositoryImpl implements ProductRepository {
  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
      include: { tenant: true },
    });
  }

  async findByTenantId(tenantId: string): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        tenantId,
        deletedAt: null,
      },
      include: { tenant: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySku(tenantId: string, sku: string): Promise<Product | null> {
    return prisma.product.findFirst({
      where: {
        tenantId,
        sku,
        deletedAt: null,
      },
      include: { tenant: true },
    });
  }

  async findBySkuExcludingId(tenantId: string, sku: string, excludeId: string): Promise<Product | null> {
    return prisma.product.findFirst({
      where: {
        tenantId,
        sku,
        id: { not: excludeId },
        deletedAt: null,
      },
      include: { tenant: true },
    });
  }

  async findByActive(tenantId: string, isActive: boolean): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        tenantId,
        isActive,
        deletedAt: null,
      },
      include: { tenant: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async search(tenantId: string, query: string, skip?: number, take?: number): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        tenantId,
        deletedAt: null,
        OR: [
          { displayName: { contains: query, mode: 'insensitive' } },
          { sku: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: { tenant: true },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    tenantId: string;
    displayName: string;
    sku?: string;
    unit: string;
    isActive?: boolean;
    createdBy?: string;
  }): Promise<Product> {
    return prisma.product.create({
      data: {
        tenant: {
          connect: { id: data.tenantId },
        },
        displayName: data.displayName,
        sku: data.sku,
        unit: data.unit,
        isActive: data.isActive ?? true,
        createdBy: data.createdBy,
      },
      include: { tenant: true },
    });
  }

  async update(
    id: string,
    data: {
      displayName?: string;
      sku?: string;
      unit?: string;
      isActive?: boolean;
      updatedBy?: string;
    }
  ): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: {
        ...(data.displayName !== undefined && { displayName: data.displayName }),
        ...(data.sku !== undefined && { sku: data.sku }),
        ...(data.unit !== undefined && { unit: data.unit }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        ...(data.updatedBy !== undefined && { updatedBy: data.updatedBy }),
      },
      include: { tenant: true },
    });
  }

  async archive(id: string): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
      include: { tenant: true },
    });
  }

  async list(tenantId: string, skip?: number, take?: number): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        tenantId,
        deletedAt: null,
      },
      include: { tenant: true },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }
}
