import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';

export function createProductRoutes(productController: ProductController): Router {
  const router = Router();

  // POST /api/products - Create product
  router.post('/products', (req, res) => productController.createProduct(req, res));

  // GET /api/products/search - Search products (must come before /products/:id)
  router.get('/products/search', (req, res) => productController.searchProducts(req, res));

  // GET /api/products/active - Get products by active status (must come before /products/:id)
  router.get('/products/active', (req, res) => productController.getProductsByActive(req, res));

  // GET /api/products/:id - Get product by ID
  router.get('/products/:id', (req, res) => productController.getProduct(req, res));

  // GET /api/products - List products (with tenant filter and pagination)
  router.get('/products', (req, res) => productController.listProducts(req, res));

  // PUT /api/products/:id - Update product
  router.put('/products/:id', (req, res) => productController.updateProduct(req, res));

  // DELETE /api/products/:id - Archive product (soft delete)
  router.delete('/products/:id', (req, res) => productController.archiveProduct(req, res));

  // POST /api/products/import - Import products (placeholder)
  router.post('/products/import', (req, res) => productController.importProducts(req, res));

  return router;
}
