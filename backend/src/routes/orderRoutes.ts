import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';

export function createOrderRoutes(orderController: OrderController): Router {
  const router = Router();

  // POST /api/orders - Create Draft Order
  router.post('/orders', (req, res) => orderController.createOrder(req, res));

  // GET /api/orders/customer/:customerId - List customer orders (must come before /:id)
  router.get('/orders/customer/:customerId', (req, res) => orderController.listCustomerOrders(req, res));

  // GET /api/orders/history/:id - Get order history (must come before /:id)
  router.get('/orders/history/:id', (req, res) => orderController.getOrderHistory(req, res));

  // GET /api/orders/:id/items - Get order with items (must come before /:id)
  router.get('/orders/:id/items', (req, res) => orderController.getOrderWithItems(req, res));

  // POST /api/orders/:id/confirm - Confirm Order (must come before /:id)
  router.post('/orders/:id/confirm', (req, res) => orderController.confirmOrder(req, res));

  // POST /api/orders/:id/cancel - Cancel Draft Order (must come before /:id)
  router.post('/orders/:id/cancel', (req, res) => orderController.cancelOrder(req, res));

  // POST /api/orders/:id/items - Add order item (must come before /:id)
  router.post('/orders/:id/items', (req, res) => orderController.addOrderItem(req, res));

  // PUT /api/orders/:id/items/:itemId - Update order item (must come before /:id)
  router.put('/orders/:id/items/:itemId', (req, res) => orderController.updateOrderItem(req, res));

  // DELETE /api/orders/:id/items/:itemId - Remove order item (must come before /:id)
  router.delete('/orders/:id/items/:itemId', (req, res) => orderController.removeOrderItem(req, res));

  // PUT /api/orders/:id - Edit Draft Order
  router.put('/orders/:id', (req, res) => orderController.updateOrder(req, res));

  // GET /api/orders/:id - Get order by ID
  router.get('/orders/:id', (req, res) => orderController.getOrder(req, res));

  // GET /api/orders - List orders
  router.get('/orders', (req, res) => orderController.listOrders(req, res));

  return router;
}
