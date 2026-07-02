import { Request, Response } from 'express';
import { PricingService } from '../services/PricingService';
import { PricingValidator } from '../validation/PricingValidator';

export class PricingController {
  constructor(private pricingService: PricingService) {}

  async createPricing(req: Request, res: Response): Promise<Response> {
    try {
      const {
        tenantId,
        customerId,
        productId,
        price,
        currency,
        effectiveDate,
        expiryDate,
        statusId,
        createdBy,
      } = req.body;

      // Validate input
      const tenantIdValidation = PricingValidator.validateTenantId(tenantId);
      if (!tenantIdValidation.isValid) {
        return res.status(400).json({ errors: tenantIdValidation.errors });
      }

      const customerIdValidation = PricingValidator.validateCustomerId(customerId);
      if (!customerIdValidation.isValid) {
        return res.status(400).json({ errors: customerIdValidation.errors });
      }

      const productIdValidation = PricingValidator.validateProductId(productId);
      if (!productIdValidation.isValid) {
        return res.status(400).json({ errors: productIdValidation.errors });
      }

      const priceValidation = PricingValidator.validatePrice(price);
      if (!priceValidation.isValid) {
        return res.status(400).json({ errors: priceValidation.errors });
      }

      const currencyValidation = PricingValidator.validateCurrency(currency);
      if (!currencyValidation.isValid) {
        return res.status(400).json({ errors: currencyValidation.errors });
      }

      const effectiveDateValidation = PricingValidator.validateEffectiveDate(effectiveDate);
      if (!effectiveDateValidation.isValid) {
        return res.status(400).json({ errors: effectiveDateValidation.errors });
      }

      const expiryDateValidation = PricingValidator.validateExpiryDate(effectiveDate, expiryDate);
      if (!expiryDateValidation.isValid) {
        return res.status(400).json({ errors: expiryDateValidation.errors });
      }

      const statusIdValidation = PricingValidator.validateStatusId(statusId);
      if (!statusIdValidation.isValid) {
        return res.status(400).json({ errors: statusIdValidation.errors });
      }

      const pricing = await this.pricingService.createPricing({
        tenantId,
        customerId,
        productId,
        price,
        currency,
        effectiveDate: new Date(effectiveDate),
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        statusId,
        createdBy,
      });

      return res.status(201).json(pricing);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getPricing(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const pricing = await this.pricingService.getPricing(id);
      return res.json(pricing);
    } catch (error) {
      if (error instanceof Error && error.message === 'Pricing not found') {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async listPricing(req: Request, res: Response): Promise<Response> {
    try {
      const { tenantId } = req.query;
      const skip = req.query.skip ? parseInt(req.query.skip as string) : undefined;
      const take = req.query.take ? parseInt(req.query.take as string) : undefined;

      if (!tenantId || typeof tenantId !== 'string') {
        return res.status(400).json({ error: 'Tenant ID is required' });
      }

      const paginationValidation = PricingValidator.validatePagination(skip, take);
      if (!paginationValidation.isValid) {
        return res.status(400).json({ errors: paginationValidation.errors });
      }

      const pricing = await this.pricingService.listPricing(tenantId, { skip, take });
      return res.json(pricing);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async resolvePricing(req: Request, res: Response): Promise<Response> {
    try {
      const { customerId, productId } = req.params;
      const { tenantId, date } = req.query;

      if (!tenantId || typeof tenantId !== 'string') {
        return res.status(400).json({ error: 'Tenant ID is required' });
      }

      const resolutionDate = date ? new Date(date as string) : undefined;

      const pricing = await this.pricingService.resolvePricing(
        tenantId,
        customerId,
        productId,
        resolutionDate
      );

      return res.json(pricing);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'No active pricing found for this customer-product pair') {
          return res.status(404).json({ error: error.message });
        } else {
          return res.status(400).json({ error: error.message });
        }
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getPricingHistory(req: Request, res: Response): Promise<Response> {
    try {
      const { customerId, productId } = req.params;
      const { tenantId } = req.query;

      if (!tenantId || typeof tenantId !== 'string') {
        return res.status(400).json({ error: 'Tenant ID is required' });
      }

      const pricingHistory = await this.pricingService.getPricingHistory(
        tenantId,
        customerId,
        productId
      );

      return res.json(pricingHistory);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async updatePricing(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { price, currency, effectiveDate, expiryDate, updatedBy } = req.body;

      const pricing = await this.pricingService.updatePricing(id, {
        price,
        currency,
        effectiveDate: effectiveDate ? new Date(effectiveDate) : undefined,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        updatedBy,
      });

      return res.json(pricing);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Pricing not found') {
          return res.status(404).json({ error: error.message });
        } else {
          return res.status(400).json({ error: error.message });
        }
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async importPricing(_req: Request, res: Response): Promise<Response> {
    // Placeholder endpoint for pricing import
    // Full implementation will be in a future module
    return res.status(501).json({
      error: 'Pricing import not yet implemented',
      message: 'This endpoint is a placeholder for future pricing import functionality',
    });
  }
}
