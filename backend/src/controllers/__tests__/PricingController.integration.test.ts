import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { PricingController } from '../PricingController';
import { PricingService } from '../../services/PricingService';
import { PricingRepositoryImpl } from '../../repositories/impl/PricingRepositoryImpl';
import { PrismaClient } from '@prisma/client';
import { createPricingRoutes } from '../../routes/pricingRoutes';

const prisma = new PrismaClient();

describe('PricingController Integration Tests', () => {
  let app: express.Express;
  let pricingController: PricingController;

  beforeAll(async () => {
    // Set up Express app with Pricing routes
    app = express();
    app.use(express.json());

    const pricingRepository = new PricingRepositoryImpl();
    const pricingService = new PricingService(pricingRepository);
    pricingController = new PricingController(pricingService);

    app.use('/api', createPricingRoutes(pricingController));
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/pricing', () => {
    it('should return validation error for missing tenant ID', async () => {
      const response = await request(app)
        .post('/api/pricing')
        .send({
          customerId: 'customer-123',
          productId: 'product-123',
          price: 100,
          currency: 'INR',
          effectiveDate: '2024-01-01',
          statusId: 'status-123',
        });

      expect(response.status).toBe(400);
      expect(Array.isArray(response.body.errors) || response.body.error).toBeTruthy();
    });

    it('should return validation error for missing customer ID', async () => {
      const response = await request(app)
        .post('/api/pricing')
        .send({
          tenantId: 'test-tenant-1',
          productId: 'product-123',
          price: 100,
          currency: 'INR',
          effectiveDate: '2024-01-01',
          statusId: 'status-123',
        });

      expect(response.status).toBe(400);
      expect(Array.isArray(response.body.errors) || response.body.error).toBeTruthy();
    });

    it('should return validation error for missing product ID', async () => {
      const response = await request(app)
        .post('/api/pricing')
        .send({
          tenantId: 'test-tenant-1',
          customerId: 'customer-123',
          price: 100,
          currency: 'INR',
          effectiveDate: '2024-01-01',
          statusId: 'status-123',
        });

      expect(response.status).toBe(400);
      expect(Array.isArray(response.body.errors) || response.body.error).toBeTruthy();
    });

    it('should return validation error for invalid price (zero)', async () => {
      const response = await request(app)
        .post('/api/pricing')
        .send({
          tenantId: 'test-tenant-1',
          customerId: 'customer-123',
          productId: 'product-123',
          price: 0,
          currency: 'INR',
          effectiveDate: '2024-01-01',
          statusId: 'status-123',
        });

      expect(response.status).toBe(400);
      expect(Array.isArray(response.body.errors) || response.body.error).toBeTruthy();
    });

    it('should return validation error for invalid price (negative)', async () => {
      const response = await request(app)
        .post('/api/pricing')
        .send({
          tenantId: 'test-tenant-1',
          customerId: 'customer-123',
          productId: 'product-123',
          price: -10,
          currency: 'INR',
          effectiveDate: '2024-01-01',
          statusId: 'status-123',
        });

      expect(response.status).toBe(400);
      expect(Array.isArray(response.body.errors) || response.body.error).toBeTruthy();
    });

    it('should return validation error for invalid currency', async () => {
      const response = await request(app)
        .post('/api/pricing')
        .send({
          tenantId: 'test-tenant-1',
          customerId: 'customer-123',
          productId: 'product-123',
          price: 100,
          currency: 'inr',
          effectiveDate: '2024-01-01',
          statusId: 'status-123',
        });

      expect(response.status).toBe(400);
      expect(Array.isArray(response.body.errors) || response.body.error).toBeTruthy();
    });

    it('should return validation error for missing effective date', async () => {
      const response = await request(app)
        .post('/api/pricing')
        .send({
          tenantId: 'test-tenant-1',
          customerId: 'customer-123',
          productId: 'product-123',
          price: 100,
          currency: 'INR',
          statusId: 'status-123',
        });

      expect(response.status).toBe(400);
      expect(Array.isArray(response.body.errors) || response.body.error).toBeTruthy();
    });

    it('should return validation error for invalid effective date', async () => {
      const response = await request(app)
        .post('/api/pricing')
        .send({
          tenantId: 'test-tenant-1',
          customerId: 'customer-123',
          productId: 'product-123',
          price: 100,
          currency: 'INR',
          effectiveDate: 'invalid-date',
          statusId: 'status-123',
        });

      expect(response.status).toBe(400);
      expect(Array.isArray(response.body.errors) || response.body.error).toBeTruthy();
    });
  });

  describe('GET /api/pricing/customer/:customerId/product/:productId', () => {
    it('should return validation error for missing tenant ID', async () => {
      const response = await request(app)
        .get('/api/pricing/customer/customer-123/product/product-123');

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Tenant ID is required');
    });
  });

  describe('POST /api/pricing/import', () => {
    it('should return 501 for import placeholder', async () => {
      const response = await request(app)
        .post('/api/pricing/import')
        .send({});

      expect(response.status).toBe(501);
      expect(response.body.error).toBe('Pricing import not yet implemented');
    });
  });
});
