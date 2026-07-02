import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { OrderController } from '../OrderController';
import { OrderService } from '../../services/OrderService';
import { OrderRepositoryImpl } from '../../repositories/impl/OrderRepositoryImpl';
import { CustomerRepositoryImpl } from '../../repositories/impl/CustomerRepositoryImpl';
import { ProductRepositoryImpl } from '../../repositories/impl/ProductRepositoryImpl';
import { PricingRepositoryImpl } from '../../repositories/impl/PricingRepositoryImpl';
import { PrismaClient } from '@prisma/client';
import { createOrderRoutes } from '../../routes/orderRoutes';

const prisma = new PrismaClient();

describe('OrderController Integration Tests', () => {
  let app: express.Express;
  let orderController: OrderController;

  beforeAll(async () => {
    // Set up Express app with Order routes
    app = express();
    app.use(express.json());

    const orderRepository = new OrderRepositoryImpl();
    const customerRepository = new CustomerRepositoryImpl();
    const productRepository = new ProductRepositoryImpl();
    const pricingRepository = new PricingRepositoryImpl();
    const orderService = new OrderService(orderRepository, customerRepository, productRepository, pricingRepository);
    orderController = new OrderController(orderService);

    app.use('/api', createOrderRoutes(orderController));
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/orders', () => {
    it('should return validation error for missing tenant ID', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          customerId: 'test-customer-id',
          orderNumber: 'ORD-001',
          statusId: 'test-status-id',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toContain('Tenant ID is required and must be a string');
    });

    it('should return validation error for missing customer ID', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          tenantId: 'test-tenant-id',
          orderNumber: 'ORD-001',
          statusId: 'test-status-id',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toContain('Customer ID is required and must be a string');
    });

    it('should return validation error for missing order number', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          tenantId: 'test-tenant-id',
          customerId: 'test-customer-id',
          statusId: 'test-status-id',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toContain('Order number is required and must be a string');
    });

    it('should return validation error for missing status ID', async () => {
      const response = await request(app)
        .post('/api/orders')
        .send({
          tenantId: 'test-tenant-id',
          customerId: 'test-customer-id',
          orderNumber: 'ORD-001',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toContain('Status ID is required and must be a string');
    });
  });

  describe('GET /api/orders', () => {
    it('should return validation error for missing tenant ID', async () => {
      const response = await request(app)
        .get('/api/orders');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Tenant ID is required');
    });

    it('should return validation error for invalid pagination', async () => {
      const response = await request(app)
        .get('/api/orders?tenantId=test-tenant-id&take=101');

      expect(response.status).toBe(400);
      expect(response.body.errors).toContain('Take cannot exceed 100');
    });
  });

  describe('PUT /api/orders/:id', () => {
    it('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .put('/api/orders/non-existent-id')
        .send({
          notes: 'Updated notes',
          updatedBy: 'test-user',
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('Order not found');
    });
  });

  describe('POST /api/orders/:id/confirm', () => {
    it('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .post('/api/orders/non-existent-id/confirm')
        .send({
          updatedBy: 'test-user',
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('Order not found');
    });
  });

  describe('POST /api/orders/:id/cancel', () => {
    it('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .post('/api/orders/non-existent-id/cancel')
        .send({
          updatedBy: 'test-user',
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('Order not found');
    });
  });

  describe('POST /api/orders/:id/items', () => {
    it('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .post('/api/orders/non-existent-id/items')
        .send({
          productId: 'test-product-id',
          quantity: 10,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Order not found');
    });

    it('should return validation error for missing product ID', async () => {
      const response = await request(app)
        .post('/api/orders/non-existent-id/items')
        .send({
          quantity: 10,
        });

      expect(response.status).toBe(400);
    });

    it('should return validation error for missing quantity', async () => {
      const response = await request(app)
        .post('/api/orders/non-existent-id/items')
        .send({
          productId: 'test-product-id',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .get('/api/orders/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('Order not found');
    });
  });

  describe('GET /api/orders/history/:id', () => {
    it('should return 404 for non-existent order', async () => {
      const response = await request(app)
        .get('/api/orders/history/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('Order not found');
    });
  });
});
