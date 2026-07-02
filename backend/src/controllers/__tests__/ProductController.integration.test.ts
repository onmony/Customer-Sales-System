import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { ProductController } from '../ProductController';
import { ProductService } from '../../services/ProductService';
import { ProductRepositoryImpl } from '../../repositories/impl/ProductRepositoryImpl';
import { PrismaClient } from '@prisma/client';
import { createProductRoutes } from '../../routes/productRoutes';

const prisma = new PrismaClient();

describe('ProductController Integration Tests', () => {
  let app: express.Express;
  let productController: ProductController;

  beforeAll(async () => {
    // Set up Express app with Product routes
    app = express();
    app.use(express.json());

    const productRepository = new ProductRepositoryImpl();
    const productService = new ProductService(productRepository);
    productController = new ProductController(productService);

    // Import routes using ES import
    app.use('/api', createProductRoutes(productController));
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/products', () => {
    it('should create a product with valid data', async () => {
      // This test requires a valid tenant to exist
      const response = await request(app)
        .post('/api/products')
        .send({
          tenantId: 'test-tenant-1',
          displayName: 'Test Product',
          sku: 'SKU-123',
          unit: 'PCS',
          isActive: true,
          createdBy: 'test-user',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.displayName).toBe('Test Product');
      expect(response.body.sku).toBe('SKU-123');
      expect(response.body.unit).toBe('PCS');
    });

    it('should return validation error for missing display name', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({
          tenantId: 'test-tenant-1',
          sku: 'SKU-123',
          unit: 'PCS',
        });

      expect(response.status).toBe(400);
      expect(Array.isArray(response.body.errors) || response.body.error).toBeTruthy();
    });

    it('should return validation error for missing unit', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({
          tenantId: 'test-tenant-1',
          displayName: 'Test Product',
          sku: 'SKU-123',
        });

      expect(response.status).toBe(400);
      expect(Array.isArray(response.body.errors) || response.body.error).toBeTruthy();
    });
  });

  describe('GET /api/products/search', () => {
    it('should return validation error for empty search query', async () => {
      const response = await request(app)
        .get('/api/products/search')
        .query({
          tenantId: 'test-tenant-1',
          query: '',
        });

      expect(response.status).toBe(400);
      expect(Array.isArray(response.body.errors) || response.body.error).toBeTruthy();
    });

    it('should return validation error for short search query', async () => {
      const response = await request(app)
        .get('/api/products/search')
        .query({
          tenantId: 'test-tenant-1',
          query: 'A',
        });

      expect(response.status).toBe(400);
      expect(Array.isArray(response.body.errors) || response.body.error).toBeTruthy();
    });
  });

  describe('POST /api/products/import', () => {
    it('should return 501 for import placeholder', async () => {
      const response = await request(app)
        .post('/api/products/import')
        .send({});

      expect(response.status).toBe(501);
      expect(response.body.error).toBe('Product import not yet implemented');
    });
  });
});
