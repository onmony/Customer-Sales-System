import { Router } from 'express';
import { InvoiceController } from '../controllers/InvoiceController';

export function createInvoiceRoutes(invoiceController: InvoiceController): Router {
  const router = Router();

  // POST /api/invoices/generate/:orderId - Generate Draft Invoice from Confirmed Order
  router.post('/invoices/generate/:orderId', (req, res) => invoiceController.generateInvoice(req, res));

  // GET /api/invoices/customer/:customerId - List customer invoices (must come before /:id)
  router.get('/invoices/customer/:customerId', (req, res) => invoiceController.listCustomerInvoices(req, res));

  // GET /api/invoices/order/:orderId - Get invoice by order (must come before /:id)
  router.get('/invoices/order/:orderId', (req, res) => invoiceController.getInvoiceByOrder(req, res));

  // GET /api/invoices/history/:id - Get invoice history (must come before /:id)
  router.get('/invoices/history/:id', (req, res) => invoiceController.getInvoiceHistory(req, res));

  // POST /api/invoices/:id/issue - Issue Invoice (must come before /:id)
  router.post('/invoices/:id/issue', (req, res) => invoiceController.issueInvoice(req, res));

  // POST /api/invoices/:id/cancel - Cancel Draft Invoice (must come before /:id)
  router.post('/invoices/:id/cancel', (req, res) => invoiceController.cancelInvoice(req, res));

  // GET /api/invoices/:id - Get invoice by ID
  router.get('/invoices/:id', (req, res) => invoiceController.getInvoice(req, res));

  // GET /api/invoices - List invoices
  router.get('/invoices', (req, res) => invoiceController.listInvoices(req, res));

  return router;
}
