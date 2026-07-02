import { Request, Response } from 'express';
import { OrderService } from '../services/OrderService';
import { OrderValidator } from '../validation/OrderValidator';

export class OrderController {
  constructor(private orderService: OrderService) {}

  async createOrder(req: Request, res: Response): Promise<Response> {
    try {
      const {
        tenantId,
        customerId,
        orderNumber,
        statusId,
        notes,
        createdBy,
      } = req.body;

      // Validate input
      const tenantIdValidation = OrderValidator.validateTenantId(tenantId);
      if (!tenantIdValidation.isValid) {
        return res.status(400).json({ errors: tenantIdValidation.errors });
      }

      const customerIdValidation = OrderValidator.validateCustomerId(customerId);
      if (!customerIdValidation.isValid) {
        return res.status(400).json({ errors: customerIdValidation.errors });
      }

      const orderNumberValidation = OrderValidator.validateOrderNumber(orderNumber);
      if (!orderNumberValidation.isValid) {
        return res.status(400).json({ errors: orderNumberValidation.errors });
      }

      const statusIdValidation = OrderValidator.validateStatusId(statusId);
      if (!statusIdValidation.isValid) {
        return res.status(400).json({ errors: statusIdValidation.errors });
      }

      const order = await this.orderService.createOrder({
        tenantId,
        customerId,
        orderNumber,
        statusId,
        notes,
        createdBy,
      });

      return res.status(201).json(order);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getOrder(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const order = await this.orderService.getOrder(id);
      return res.json(order);
    } catch (error) {
      if (error instanceof Error && error.message === 'Order not found') {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getOrderWithItems(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const order = await this.orderService.getOrderWithItems(id);
      return res.json(order);
    } catch (error) {
      if (error instanceof Error && error.message === 'Order not found') {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async listOrders(req: Request, res: Response): Promise<Response> {
    try {
      const { tenantId } = req.query;
      const skip = req.query.skip ? parseInt(req.query.skip as string) : undefined;
      const take = req.query.take ? parseInt(req.query.take as string) : undefined;

      if (!tenantId || typeof tenantId !== 'string') {
        return res.status(400).json({ error: 'Tenant ID is required' });
      }

      const paginationValidation = OrderValidator.validatePagination(skip, take);
      if (!paginationValidation.isValid) {
        return res.status(400).json({ errors: paginationValidation.errors });
      }

      const orders = await this.orderService.listOrders(tenantId, { skip, take });
      return res.json(orders);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async listCustomerOrders(req: Request, res: Response): Promise<Response> {
    try {
      const { customerId } = req.params;
      const { tenantId } = req.query;
      const skip = req.query.skip ? parseInt(req.query.skip as string) : undefined;
      const take = req.query.take ? parseInt(req.query.take as string) : undefined;

      if (!tenantId || typeof tenantId !== 'string') {
        return res.status(400).json({ error: 'Tenant ID is required' });
      }

      const paginationValidation = OrderValidator.validatePagination(skip, take);
      if (!paginationValidation.isValid) {
        return res.status(400).json({ errors: paginationValidation.errors });
      }

      const orders = await this.orderService.listCustomerOrders(tenantId, customerId, { skip, take });
      return res.json(orders);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async updateOrder(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { notes, updatedBy } = req.body;

      const order = await this.orderService.updateOrder(id, {
        notes,
        updatedBy,
      });

      return res.json(order);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Order not found') {
          return res.status(404).json({ error: error.message });
        } else {
          return res.status(400).json({ error: error.message });
        }
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async confirmOrder(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { updatedBy } = req.body;

      const order = await this.orderService.confirmOrder(id, updatedBy);
      return res.json(order);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Order not found') {
          return res.status(404).json({ error: error.message });
        } else {
          return res.status(400).json({ error: error.message });
        }
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async cancelOrder(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { updatedBy } = req.body;

      const order = await this.orderService.cancelOrder(id, updatedBy);
      return res.json(order);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Order not found') {
          return res.status(404).json({ error: error.message });
        } else {
          return res.status(400).json({ error: error.message });
        }
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async addOrderItem(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const {
        productId,
        quantity,
        createdBy,
      } = req.body;

      const orderItem = await this.orderService.addOrderItem(id, {
        productId,
        quantity,
        createdBy,
      });

      return res.status(201).json(orderItem);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async updateOrderItem(req: Request, res: Response): Promise<Response> {
    try {
      const { itemId } = req.params;
      const { quantity, unitPrice, lineTotal, currency, notes, updatedBy } = req.body;

      const orderItem = await this.orderService.updateOrderItem(itemId, {
        quantity,
        unitPrice,
        lineTotal,
        currency,
        notes,
        updatedBy,
      });

      return res.json(orderItem);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Order item not found') {
          return res.status(404).json({ error: error.message });
        } else {
          return res.status(400).json({ error: error.message });
        }
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async removeOrderItem(req: Request, res: Response): Promise<Response> {
    try {
      const { itemId } = req.params;

      const orderItem = await this.orderService.removeOrderItem(itemId);
      return res.json(orderItem);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Order item not found') {
          return res.status(404).json({ error: error.message });
        } else {
          return res.status(400).json({ error: error.message });
        }
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getOrderHistory(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const order = await this.orderService.getOrderHistory(id);
      return res.json(order);
    } catch (error) {
      if (error instanceof Error && error.message === 'Order not found') {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
