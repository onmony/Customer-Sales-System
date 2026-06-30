import { Request, Response } from 'express';
import { CustomerService } from '../services/CustomerService';
import { CustomerValidator } from '../validation/CustomerValidator';

export class CustomerController {
  constructor(private customerService: CustomerService) {}

  async createCustomer(req: Request, res: Response): Promise<Response> {
    try {
      const { tenantId, displayName, gstNumber, creditLimit, statusId, createdBy } = req.body;

      // Validate input
      const displayNameValidation = CustomerValidator.validateDisplayName(displayName);
      if (!displayNameValidation.isValid) {
        return res.status(400).json({ errors: displayNameValidation.errors });
      }

      const gstValidation = CustomerValidator.validateGstNumber(gstNumber);
      if (!gstValidation.isValid) {
        return res.status(400).json({ errors: gstValidation.errors });
      }

      const creditLimitValidation = CustomerValidator.validateCreditLimit(creditLimit);
      if (!creditLimitValidation.isValid) {
        return res.status(400).json({ errors: creditLimitValidation.errors });
      }

      const statusValidation = CustomerValidator.validateStatusId(statusId);
      if (!statusValidation.isValid) {
        return res.status(400).json({ errors: statusValidation.errors });
      }

      const customer = await this.customerService.createCustomer({
        tenantId,
        displayName,
        gstNumber,
        creditLimit,
        statusId,
        createdBy,
      });

      return res.status(201).json(customer);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getCustomer(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const customer = await this.customerService.getCustomer(id);
      return res.json(customer);
    } catch (error) {
      if (error instanceof Error && error.message === 'Customer not found') {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async listCustomers(req: Request, res: Response): Promise<Response> {
    try {
      const { tenantId } = req.query;
      const skip = req.query.skip ? parseInt(req.query.skip as string) : undefined;
      const take = req.query.take ? parseInt(req.query.take as string) : undefined;

      if (!tenantId || typeof tenantId !== 'string') {
        return res.status(400).json({ error: 'Tenant ID is required' });
      }

      const paginationValidation = CustomerValidator.validatePagination(skip, take);
      if (!paginationValidation.isValid) {
        return res.status(400).json({ errors: paginationValidation.errors });
      }

      const customers = await this.customerService.listCustomers(tenantId, { skip, take });
      return res.json(customers);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async searchCustomers(req: Request, res: Response): Promise<Response> {
    try {
      const { tenantId, query } = req.query;
      const skip = req.query.skip ? parseInt(req.query.skip as string) : undefined;
      const take = req.query.take ? parseInt(req.query.take as string) : undefined;

      if (!tenantId || typeof tenantId !== 'string') {
        return res.status(400).json({ error: 'Tenant ID is required' });
      }

      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Search query is required' });
      }

      const queryValidation = CustomerValidator.validateSearchQuery(query);
      if (!queryValidation.isValid) {
        return res.status(400).json({ errors: queryValidation.errors });
      }

      const paginationValidation = CustomerValidator.validatePagination(skip, take);
      if (!paginationValidation.isValid) {
        return res.status(400).json({ errors: paginationValidation.errors });
      }

      const customers = await this.customerService.searchCustomers({
        tenantId,
        query,
        skip,
        take,
      });
      return res.json(customers);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async updateCustomer(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { displayName, gstNumber, creditLimit, statusId, updatedBy } = req.body;

      // Validate input if provided
      if (displayName !== undefined) {
        const displayNameValidation = CustomerValidator.validateDisplayName(displayName);
        if (!displayNameValidation.isValid) {
          return res.status(400).json({ errors: displayNameValidation.errors });
        }
      }

      if (gstNumber !== undefined) {
        const gstValidation = CustomerValidator.validateGstNumber(gstNumber);
        if (!gstValidation.isValid) {
          return res.status(400).json({ errors: gstValidation.errors });
        }
      }

      if (creditLimit !== undefined) {
        const creditLimitValidation = CustomerValidator.validateCreditLimit(creditLimit);
        if (!creditLimitValidation.isValid) {
          return res.status(400).json({ errors: creditLimitValidation.errors });
        }
      }

      const customer = await this.customerService.updateCustomer(id, {
        displayName,
        gstNumber,
        creditLimit,
        statusId,
        updatedBy,
      });

      return res.json(customer);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Customer not found') {
          return res.status(404).json({ error: error.message });
        } else {
          return res.status(400).json({ error: error.message });
        }
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async archiveCustomer(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { archivedBy } = req.body;

      const customer = await this.customerService.archiveCustomer(id, archivedBy);
      return res.json(customer);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Customer not found') {
          return res.status(404).json({ error: error.message });
        } else {
          return res.status(400).json({ error: error.message });
        }
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getCustomersByStatus(req: Request, res: Response): Promise<Response> {
    try {
      const { tenantId, statusId } = req.query;
      const skip = req.query.skip ? parseInt(req.query.skip as string) : undefined;
      const take = req.query.take ? parseInt(req.query.take as string) : undefined;

      if (!tenantId || typeof tenantId !== 'string') {
        return res.status(400).json({ error: 'Tenant ID is required' });
      }

      if (!statusId || typeof statusId !== 'string') {
        return res.status(400).json({ error: 'Status ID is required' });
      }

      const paginationValidation = CustomerValidator.validatePagination(skip, take);
      if (!paginationValidation.isValid) {
        return res.status(400).json({ errors: paginationValidation.errors });
      }

      const customers = await this.customerService.getCustomersByStatus(tenantId, statusId, { skip, take });
      return res.json(customers);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async importCustomers(_req: Request, res: Response): Promise<Response> {
    // Placeholder endpoint for customer import
    // Full implementation will be in a future module
    return res.status(501).json({
      error: 'Customer import not yet implemented',
      message: 'This endpoint is a placeholder for future customer import functionality',
    });
  }
}
