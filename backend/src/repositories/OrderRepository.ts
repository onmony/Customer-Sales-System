import { Prisma } from '@prisma/client';

export interface OrderRepository {
  findById(id: string): Promise<any | null>;
  findByIdWithItems(id: string): Promise<any | null>;
  findByTenantId(tenantId: string, params?: { skip?: number; take?: number }): Promise<any[]>;
  findByOrderNumber(tenantId: string, orderNumber: string): Promise<any | null>;
  findByCustomerId(tenantId: string, customerId: string, params?: { skip?: number; take?: number }): Promise<any[]>;
  create(data: Prisma.OrderCreateInput): Promise<any>;
  update(id: string, data: Prisma.OrderUpdateInput): Promise<any>;
  updateDocumentPayload(id: string, orderDocumentPayload: Prisma.InputJsonValue, updatedBy?: string): Promise<any>;
  updateStatusAndDocumentPayload(
    id: string,
    statusId: string,
    orderDocumentPayload: Prisma.InputJsonValue,
    updatedBy?: string
  ): Promise<any>;
  updateStatus(id: string, statusId: string, updatedBy?: string): Promise<any>;
  delete(id: string): Promise<any>;
  softDelete(id: string): Promise<any>;
  
  // OrderItem operations
  createOrderItem(data: any): Promise<any>;
  updateOrderItem(id: string, data: any): Promise<any>;
  deleteOrderItem(id: string): Promise<any>;
  softDeleteOrderItem(id: string): Promise<any>;
  findOrderItemsByOrderId(orderId: string): Promise<any[]>;
  findOrderItemById(id: string): Promise<any | null>;
}
