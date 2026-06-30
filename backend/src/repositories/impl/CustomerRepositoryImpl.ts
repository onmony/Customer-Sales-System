import { PrismaClient } from '@prisma/client';
import { CustomerRepository } from '../CustomerRepository';

const prisma = new PrismaClient();

export class CustomerRepositoryImpl implements CustomerRepository {
  async findById(id: string) {
    return prisma.customer.findUnique({
      where: { id },
      include: {
        status: true,
      },
    });
  }

  async findByTenantId(tenantId: string, params?: { skip?: number; take?: number }) {
    return prisma.customer.findMany({
      where: {
        tenantId,
        deletedAt: null,
      },
      include: {
        status: true,
      },
      skip: params?.skip,
      take: params?.take,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByGstNumber(tenantId: string, gstNumber: string) {
    return prisma.customer.findFirst({
      where: {
        tenantId,
        gstNumber,
        deletedAt: null,
      },
      include: {
        status: true,
      },
    });
  }

  async create(data: any) {
    return prisma.customer.create({
      data,
      include: {
        status: true,
      },
    });
  }

  async update(id: string, data: any) {
    return prisma.customer.update({
      where: { id },
      data,
      include: {
        status: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.customer.delete({
      where: { id },
    });
  }

  async softDelete(id: string) {
    return prisma.customer.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
      include: {
        status: true,
      },
    });
  }

  async search(tenantId: string, query: string, params?: { skip?: number; take?: number }) {
    return prisma.customer.findMany({
      where: {
        tenantId,
        deletedAt: null,
        OR: [
          {
            displayName: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            gstNumber: {
              contains: query,
              mode: 'insensitive',
            },
          },
        ],
      },
      include: {
        status: true,
      },
      skip: params?.skip,
      take: params?.take,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByStatus(tenantId: string, statusId: string, params?: { skip?: number; take?: number }) {
    return prisma.customer.findMany({
      where: {
        tenantId,
        statusId,
        deletedAt: null,
      },
      include: {
        status: true,
      },
      skip: params?.skip,
      take: params?.take,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
