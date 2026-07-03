import { PrismaClient } from '@prisma/client';
import { InvoiceRepository } from '../InvoiceRepository';

const prisma = new PrismaClient();

export class InvoiceRepositoryImpl implements InvoiceRepository {
  async findById(id: string) {
    return prisma.invoice.findUnique({
      where: { id },
      include: {
        status: true,
        customer: true,
        order: true,
      },
    });
  }

  async findByIdWithItems(id: string) {
    return prisma.invoice.findUnique({
      where: { id },
      include: {
        status: true,
        customer: true,
        order: true,
        invoiceItems: {
          where: {
            deletedAt: null,
          },
        },
      },
    });
  }

  async findByTenantId(tenantId: string, params?: { skip?: number; take?: number }) {
    return prisma.invoice.findMany({
      where: {
        tenantId,
        deletedAt: null,
      },
      include: {
        status: true,
        customer: true,
        order: true,
      },
      skip: params?.skip,
      take: params?.take,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByInvoiceNumber(tenantId: string, invoiceNumber: string) {
    return prisma.invoice.findFirst({
      where: {
        tenantId,
        invoiceNumber,
        deletedAt: null,
      },
      include: {
        status: true,
        customer: true,
        order: true,
      },
    });
  }

  async findByOrderId(tenantId: string, orderId: string) {
    return prisma.invoice.findMany({
      where: {
        tenantId,
        orderId,
        deletedAt: null,
      },
      include: {
        status: true,
        customer: true,
        order: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByCustomerId(tenantId: string, customerId: string, params?: { skip?: number; take?: number }) {
    return prisma.invoice.findMany({
      where: {
        tenantId,
        customerId,
        deletedAt: null,
      },
      include: {
        status: true,
        customer: true,
        order: true,
      },
      skip: params?.skip,
      take: params?.take,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findByStatus(tenantId: string, statusId: string, params?: { skip?: number; take?: number }) {
    return prisma.invoice.findMany({
      where: {
        tenantId,
        statusId,
        deletedAt: null,
      },
      include: {
        status: true,
        customer: true,
        order: true,
      },
      skip: params?.skip,
      take: params?.take,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(data: any) {
    return prisma.invoice.create({
      data,
      include: {
        status: true,
        customer: true,
        order: true,
      },
    });
  }

  async update(id: string, data: any) {
    return prisma.invoice.update({
      where: { id },
      data,
      include: {
        status: true,
        customer: true,
        order: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.invoice.delete({
      where: { id },
    });
  }

  async softDelete(id: string) {
    return prisma.invoice.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
      include: {
        status: true,
        customer: true,
        order: true,
      },
    });
  }

  // InvoiceItem operations
  async createInvoiceItem(data: any) {
    return prisma.invoiceItem.create({
      data,
    });
  }

  async updateInvoiceItem(id: string, data: any) {
    return prisma.invoiceItem.update({
      where: { id },
      data,
    });
  }

  async deleteInvoiceItem(id: string) {
    return prisma.invoiceItem.delete({
      where: { id },
    });
  }

  async softDeleteInvoiceItem(id: string) {
    return prisma.invoiceItem.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async findInvoiceItemsByInvoiceId(invoiceId: string) {
    return prisma.invoiceItem.findMany({
      where: {
        invoiceId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findInvoiceItemById(id: string) {
    return prisma.invoiceItem.findUnique({
      where: { id },
    });
  }

  // Invoice numbering - simple sequential tenant-scoped strategy
  async getNextInvoiceNumber(tenantId: string): Promise<number> {
    const lastInvoice = await prisma.invoice.findFirst({
      where: {
        tenantId,
        deletedAt: null,
      },
      orderBy: {
        invoiceNumber: 'desc',
      },
      select: {
        invoiceNumber: true,
      },
    });

    if (!lastInvoice) {
      return 1;
    }

    const lastNumber = parseInt(lastInvoice.invoiceNumber, 10);
    if (isNaN(lastNumber)) {
      return 1;
    }

    return lastNumber + 1;
  }
}
