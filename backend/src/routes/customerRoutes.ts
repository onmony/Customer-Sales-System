import { Router } from 'express';
import { CustomerController } from '../controllers/CustomerController';

export function createCustomerRoutes(customerController: CustomerController): Router {
  const router = Router();

  // POST /api/customers - Create customer
  router.post('/customers', (req, res) => customerController.createCustomer(req, res));

  // GET /api/customers/search - Search customers (must come before /customers/:id)
  router.get('/customers/search', (req, res) => customerController.searchCustomers(req, res));

  // GET /api/customers/status/:statusId - Get customers by status (must come before /customers/:id)
  router.get('/customers/status/:statusId', (req, res) => customerController.getCustomersByStatus(req, res));

  // GET /api/customers/:id - Get customer by ID
  router.get('/customers/:id', (req, res) => customerController.getCustomer(req, res));

  // GET /api/customers - List customers (with tenant filter and pagination)
  router.get('/customers', (req, res) => customerController.listCustomers(req, res));

  // PUT /api/customers/:id - Update customer
  router.put('/customers/:id', (req, res) => customerController.updateCustomer(req, res));

  // DELETE /api/customers/:id - Archive customer (soft delete)
  router.delete('/customers/:id', (req, res) => customerController.archiveCustomer(req, res));

  // POST /api/customers/import - Import customers (placeholder)
  router.post('/customers/import', (req, res) => customerController.importCustomers(req, res));

  return router;
}
