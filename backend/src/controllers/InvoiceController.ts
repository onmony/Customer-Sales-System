import { Request, Response } from 'express';
import { InvoiceService } from '../services/InvoiceService';
import { InvoiceValidator } from '../validation/InvoiceValidator';

export class InvoiceController {
  constructor(private invoiceService: InvoiceService) {}

  async generateInvoice(req: Request, res: Response): Promise<Response> {
    try {
      const { orderId } = req.params;
      const { tenantId, createdBy } = req.body;

      // Validate input
      const tenantIdValidation = InvoiceValidator.validateTenantId(tenantId);
      if (!tenantIdValidation.isValid) {
        return res.status(400).json({ errors: tenantIdValidation.errors });
      }

      const orderIdValidation = InvoiceValidator.validateOrderId(orderId);
      if (!orderIdValidation.isValid) {
        return res.status(400).json({ errors: orderIdValidation.errors });
      }

      const invoice = await this.invoiceService.generateInvoice({
        tenantId,
        orderId,
        createdBy,
      });

      return res.status(201).json(invoice);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getInvoice(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const invoice = await this.invoiceService.getInvoice(id);
      return res.json(invoice);
    } catch (error) {
      if (error instanceof Error && error.message === 'Invoice not found') {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async listInvoices(req: Request, res: Response): Promise<Response> {
    try {
      const { tenantId } = req.query;
      const skip = req.query.skip ? parseInt(req.query.skip as string) : undefined;
      const take = req.query.take ? parseInt(req.query.take as string) : undefined;

      if (!tenantId || typeof tenantId !== 'string') {
        return res.status(400).json({ error: 'Tenant ID is required' });
      }

      const paginationValidation = InvoiceValidator.validatePagination(skip, take);
      if (!paginationValidation.isValid) {
        return res.status(400).json({ errors: paginationValidation.errors });
      }

      const invoices = await this.invoiceService.listInvoices(tenantId, { skip, take });
      return res.json(invoices);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async listCustomerInvoices(req: Request, res: Response): Promise<Response> {
    try {
      const { customerId } = req.params;
      const { tenantId } = req.query;
      const skip = req.query.skip ? parseInt(req.query.skip as string) : undefined;
      const take = req.query.take ? parseInt(req.query.take as string) : undefined;

      if (!tenantId || typeof tenantId !== 'string') {
        return res.status(400).json({ error: 'Tenant ID is required' });
      }

      const paginationValidation = InvoiceValidator.validatePagination(skip, take);
      if (!paginationValidation.isValid) {
        return res.status(400).json({ errors: paginationValidation.errors });
      }

      const invoices = await this.invoiceService.listCustomerInvoices(tenantId, customerId, { skip, take });
      return res.json(invoices);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getInvoiceByOrder(req: Request, res: Response): Promise<Response> {
    try {
      const { orderId } = req.params;
      const { tenantId } = req.query;

      if (!tenantId || typeof tenantId !== 'string') {
        return res.status(400).json({ error: 'Tenant ID is required' });
      }

      const invoice = await this.invoiceService.getInvoiceByOrder(tenantId as string, orderId);
      return res.json(invoice);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Invoice not found for this order') {
          return res.status(404).json({ error: error.message });
        } else {
          return res.status(400).json({ error: error.message });
        }
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async issueInvoice(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { issuedBy } = req.body;

      const invoice = await this.invoiceService.issueInvoice(id, { issuedBy });
      return res.json(invoice);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Invoice not found') {
          return res.status(404).json({ error: error.message });
        } else {
          return res.status(400).json({ error: error.message });
        }
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async cancelInvoice(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { cancelledBy } = req.body;

      const invoice = await this.invoiceService.cancelInvoice(id, { cancelledBy });
      return res.json(invoice);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Invoice not found') {
          return res.status(404).json({ error: error.message });
        } else {
          return res.status(400).json({ error: error.message });
        }
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getInvoiceHistory(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const invoice = await this.invoiceService.getInvoiceHistory(id);
      return res.json(invoice);
    } catch (error) {
      if (error instanceof Error && error.message === 'Invoice not found') {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
