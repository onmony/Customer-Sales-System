import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { InvoiceController } from '../InvoiceController';
import { InvoiceService } from '../../services/InvoiceService';
import { InvoiceRepositoryImpl } from '../../repositories/impl/InvoiceRepositoryImpl';
import { OrderRepositoryImpl } from '../../repositories/impl/OrderRepositoryImpl';
import { CustomerRepositoryImpl } from '../../repositories/impl/CustomerRepositoryImpl';
import { ProductRepositoryImpl } from '../../repositories/impl/ProductRepositoryImpl';
import { PricingRepositoryImpl } from '../../repositories/impl/PricingRepositoryImpl';
import { PrismaClient } from '@prisma/client';
import { createInvoiceRoutes } from '../../routes/invoiceRoutes';

const prisma = new PrismaClient();

describe('InvoiceController Integration Tests', () => {
  let app: express.Express;
  let invoiceController: InvoiceController;

  beforeAll(async () => {
    // Set up Express app with Invoice routes
    app = express();
    app.use(express.json());

    const invoiceRepository = new InvoiceRepositoryImpl();
    const orderRepository = new OrderRepositoryImpl();
    const customerRepository = new CustomerRepositoryImpl();
    const productRepository = new ProductRepositoryImpl();
    const pricingRepository = new PricingRepositoryImpl();
    const invoiceService = new InvoiceService(invoiceRepository, orderRepository, customerRepository, productRepository, pricingRepository);
    invoiceController = new InvoiceController(invoiceService);

    app.use('/api', createInvoiceRoutes(invoiceController));
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/invoices/generate/:orderId', () => {
    it('should return validation error for missing tenant ID', async () => {
      const response = await request(app)
        .post('/api/invoices/generate/order-123')
        .send({
          orderId: 'order-123',
        });

      expect(response.status).toBe(400);
      expect(response.body.errors).toContain('Tenant ID is required and must be a string');
    });

    it('should return validation error for missing order ID in params', async () => {
      const response = await request(app)
        .post('/api/invoices/generate/')
        .send({
          tenantId: 'test-tenant-id',
        });

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/invoices', () => {
    it('should return validation error for missing tenant ID', async () => {
      const response = await request(app)
        .get('/api/invoices');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Tenant ID is required');
    });

    it('should return validation error for invalid pagination', async () => {
      const response = await request(app)
        .get('/api/invoices?tenantId=test-tenant-id&take=101');

      expect(response.status).toBe(400);
      expect(response.body.errors).toContain('Take cannot exceed 100');
    });
  });

  describe('GET /api/invoices/customer/:customerId', () => {
    it('should return validation error for missing tenant ID', async () => {
      const response = await request(app)
        .get('/api/invoices/customer/customer-123');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Tenant ID is required');
    });

    it('should return validation error for invalid pagination', async () => {
      const response = await request(app)
        .get('/api/invoices/customer/customer-123?tenantId=test-tenant-id&take=101');

      expect(response.status).toBe(400);
      expect(response.body.errors).toContain('Take cannot exceed 100');
    });
  });

  describe('GET /api/invoices/order/:orderId', () => {
    it('should return validation error for missing tenant ID', async () => {
      const response = await request(app)
        .get('/api/invoices/order/order-123');

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Tenant ID is required');
    });
  });

  describe('POST /api/invoices/:id/issue', () => {
    it('should return 404 for non-existent invoice', async () => {
      const response = await request(app)
        .post('/api/invoices/non-existent-id/issue')
        .send({
          issuedBy: 'test-user',
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('Invoice not found');
    });
  });

  describe('POST /api/invoices/:id/cancel', () => {
    it('should return 404 for non-existent invoice', async () => {
      const response = await request(app)
        .post('/api/invoices/non-existent-id/cancel')
        .send({
          cancelledBy: 'test-user',
        });

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('Invoice not found');
    });
  });

  describe('GET /api/invoices/:id', () => {
    it('should return 404 for non-existent invoice', async () => {
      const response = await request(app)
        .get('/api/invoices/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('Invoice not found');
    });
  });

  describe('GET /api/invoices/history/:id', () => {
    it('should return 404 for non-existent invoice', async () => {
      const response = await request(app)
        .get('/api/invoices/history/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body.error).toContain('Invoice not found');
    });
  });
});
