import { PrismaClient } from '@prisma/client';
import { OrderRepository } from '../OrderRepository';

const prisma = new PrismaClient();

export class OrderRepositoryImpl implements OrderRepository {
  async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        tenant: true,
        customer: true,
        status: true,
      },
    });
  }

  async findByIdWithItems(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        tenant: true,
        customer: true,
        status: true,
      },
    });
    
    if (!order) return null;
    
    // Manually fetch order items using raw query to avoid type issues
    const orderItems = await prisma.$queryRaw`
      SELECT * FROM order_items 
      WHERE "orderId" = ${id} AND "deletedAt" IS NULL 
      ORDER BY "createdAt" ASC
    `;
    
    return { ...order, orderItems };
  }

  async findByTenantId(tenantId: string, params?: { skip?: number; take?: number }) {
    const { skip, take } = params || {};
    return prisma.order.findMany({
      where: {
        tenantId,
        deletedAt: null,
      },
      include: {
        tenant: true,
        customer: true,
        status: true,
      },
      skip,
      take,
      orderBy: { orderDate: 'desc' },
    });
  }

  async findByOrderNumber(tenantId: string, orderNumber: string) {
    return prisma.order.findUnique({
      where: {
        tenantId_orderNumber: {
          tenantId,
          orderNumber,
        },
        deletedAt: null,
      },
      include: {
        tenant: true,
        customer: true,
        status: true,
      },
    });
  }

  async findByCustomerId(tenantId: string, customerId: string, params?: { skip?: number; take?: number }) {
    const { skip, take } = params || {};
    return prisma.order.findMany({
      where: {
        tenantId,
        customerId,
        deletedAt: null,
      },
      include: {
        tenant: true,
        customer: true,
        status: true,
      },
      skip,
      take,
      orderBy: { orderDate: 'desc' },
    });
  }

  async create(data: any) {
    return prisma.order.create({
      data,
      include: {
        tenant: true,
        customer: true,
        status: true,
      },
    });
  }

  async update(id: string, data: any) {
    return prisma.order.update({
      where: { id },
      data,
      include: {
        tenant: true,
        customer: true,
        status: true,
      },
    });
  }

  async updateStatus(id: string, statusId: string, updatedBy?: string) {
    return prisma.order.update({
      where: { id },
      data: {
        statusId,
        updatedBy,
      },
      include: {
        tenant: true,
        customer: true,
        status: true,
      },
    });
  }

  async delete(id: string) {
    return prisma.order.delete({
      where: { id },
      include: {
        tenant: true,
        customer: true,
        status: true,
      },
    });
  }

  async softDelete(id: string) {
    return prisma.order.update({
      where: { id },
      data: { deletedAt: new Date() },
      include: {
        tenant: true,
        customer: true,
        status: true,
      },
    });
  }

  // OrderItem operations using raw queries to avoid Prisma client generation issues
  async createOrderItem(data: any) {
    return prisma.$queryRaw`
      INSERT INTO order_items (
        "id", "orderId", "productId", quantity, "unitPrice", "lineTotal", currency, notes,
        "productSnapshotCode", "productSnapshotName", "productSnapshotUnit",
        "pricingSnapshotVersion", "pricingSnapshotEffectiveDate", "pricingSnapshotCurrency", "pricingSnapshotSource",
        "createdAt", "updatedAt", "createdBy", "updatedBy"
      ) VALUES (
        ${data.id}, ${data.orderId}, ${data.productId}, ${data.quantity}, ${data.unitPrice}, ${data.lineTotal}, ${data.currency}, ${data.notes},
        ${data.productSnapshotCode}, ${data.productSnapshotName}, ${data.productSnapshotUnit},
        ${data.pricingSnapshotVersion}, ${data.pricingSnapshotEffectiveDate}, ${data.pricingSnapshotCurrency}, ${data.pricingSnapshotSource},
        NOW(), NOW(), ${data.createdBy}, ${data.updatedBy}
      )
      RETURNING *
    `;
  }

  async updateOrderItem(id: string, data: any) {
    const updates: string[] = [];
    const values: any[] = [];
    
    if (data.quantity !== undefined) { updates.push('"quantity" = $' + (values.length + 1)); values.push(data.quantity); }
    if (data.unitPrice !== undefined) { updates.push('"unitPrice" = $' + (values.length + 1)); values.push(data.unitPrice); }
    if (data.lineTotal !== undefined) { updates.push('"lineTotal" = $' + (values.length + 1)); values.push(data.lineTotal); }
    if (data.currency !== undefined) { updates.push('"currency" = $' + (values.length + 1)); values.push(data.currency); }
    if (data.notes !== undefined) { updates.push('"notes" = $' + (values.length + 1)); values.push(data.notes); }
    if (data.updatedBy !== undefined) { updates.push('"updatedBy" = $' + (values.length + 1)); values.push(data.updatedBy); }
    
    updates.push('"updatedAt" = NOW()');
    values.push(id);
    
    const query = `UPDATE order_items SET ${updates.join(', ')} WHERE "id" = $${values.length} RETURNING *`;
    return prisma.$queryRawUnsafe(query, ...values);
  }

  async deleteOrderItem(id: string) {
    return prisma.$queryRaw`DELETE FROM order_items WHERE "id" = ${id} RETURNING *`;
  }

  async softDeleteOrderItem(id: string) {
    return prisma.$queryRaw`UPDATE order_items SET "deletedAt" = NOW() WHERE "id" = ${id} RETURNING *`;
  }

  async findOrderItemsByOrderId(orderId: string): Promise<any[]> {
    const result = await prisma.$queryRaw`
      SELECT * FROM order_items 
      WHERE "orderId" = ${orderId} AND "deletedAt" IS NULL 
      ORDER BY "createdAt" ASC
    `;
    return result as any[];
  }

  async findOrderItemById(id: string) {
    const result = await prisma.$queryRaw`
      SELECT * FROM order_items WHERE "id" = ${id}
    `;
    const items = result as any[];
    return items[0] || null;
  }
}
