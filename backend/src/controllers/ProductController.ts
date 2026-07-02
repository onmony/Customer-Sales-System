import { Request, Response } from 'express';
import { ProductService } from '../services/ProductService';
import { ProductValidator } from '../validation/ProductValidator';

export class ProductController {
  constructor(private productService: ProductService) {}

  async createProduct(req: Request, res: Response): Promise<Response> {
    try {
      const { tenantId, displayName, sku, unit, isActive, createdBy } = req.body;

      // Validate input
      const displayNameValidation = ProductValidator.validateDisplayName(displayName);
      if (!displayNameValidation.isValid) {
        return res.status(400).json({ errors: displayNameValidation.errors });
      }

      const skuValidation = ProductValidator.validateSku(sku);
      if (!skuValidation.isValid) {
        return res.status(400).json({ errors: skuValidation.errors });
      }

      const unitValidation = ProductValidator.validateUnit(unit);
      if (!unitValidation.isValid) {
        return res.status(400).json({ errors: unitValidation.errors });
      }

      const isActiveValidation = ProductValidator.validateIsActive(isActive);
      if (!isActiveValidation.isValid) {
        return res.status(400).json({ errors: isActiveValidation.errors });
      }

      const product = await this.productService.createProduct({
        tenantId,
        displayName,
        sku,
        unit,
        isActive,
        createdBy,
      });

      return res.status(201).json(product);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getProduct(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const product = await this.productService.getProduct(id);
      return res.json(product);
    } catch (error) {
      if (error instanceof Error && error.message === 'Product not found') {
        return res.status(404).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async listProducts(req: Request, res: Response): Promise<Response> {
    try {
      const { tenantId } = req.query;
      const skip = req.query.skip ? parseInt(req.query.skip as string) : undefined;
      const take = req.query.take ? parseInt(req.query.take as string) : undefined;

      if (!tenantId || typeof tenantId !== 'string') {
        return res.status(400).json({ error: 'Tenant ID is required' });
      }

      const paginationValidation = ProductValidator.validatePagination(skip, take);
      if (!paginationValidation.isValid) {
        return res.status(400).json({ errors: paginationValidation.errors });
      }

      const products = await this.productService.listProducts(tenantId, { skip, take });
      return res.json(products);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async searchProducts(req: Request, res: Response): Promise<Response> {
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

      const queryValidation = ProductValidator.validateSearchQuery(query);
      if (!queryValidation.isValid) {
        return res.status(400).json({ errors: queryValidation.errors });
      }

      const paginationValidation = ProductValidator.validatePagination(skip, take);
      if (!paginationValidation.isValid) {
        return res.status(400).json({ errors: paginationValidation.errors });
      }

      const products = await this.productService.searchProducts({
        tenantId,
        query,
        skip,
        take,
      });
      return res.json(products);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async updateProduct(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { displayName, sku, unit, isActive, updatedBy } = req.body;

      // Validate input if provided
      if (displayName !== undefined) {
        const displayNameValidation = ProductValidator.validateDisplayName(displayName);
        if (!displayNameValidation.isValid) {
          return res.status(400).json({ errors: displayNameValidation.errors });
        }
      }

      if (sku !== undefined) {
        const skuValidation = ProductValidator.validateSku(sku);
        if (!skuValidation.isValid) {
          return res.status(400).json({ errors: skuValidation.errors });
        }
      }

      if (unit !== undefined) {
        const unitValidation = ProductValidator.validateUnit(unit);
        if (!unitValidation.isValid) {
          return res.status(400).json({ errors: unitValidation.errors });
        }
      }

      if (isActive !== undefined) {
        const isActiveValidation = ProductValidator.validateIsActive(isActive);
        if (!isActiveValidation.isValid) {
          return res.status(400).json({ errors: isActiveValidation.errors });
        }
      }

      const product = await this.productService.updateProduct(id, {
        displayName,
        sku,
        unit,
        isActive,
        updatedBy,
      });

      return res.json(product);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Product not found') {
          return res.status(404).json({ error: error.message });
        } else {
          return res.status(400).json({ error: error.message });
        }
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async archiveProduct(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const product = await this.productService.archiveProduct(id);
      return res.json(product);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Product not found') {
          return res.status(404).json({ error: error.message });
        } else {
          return res.status(400).json({ error: error.message });
        }
      } else {
        return res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getProductsByActive(req: Request, res: Response): Promise<Response> {
    try {
      const { tenantId, isActive } = req.query;

      if (!tenantId || typeof tenantId !== 'string') {
        return res.status(400).json({ error: 'Tenant ID is required' });
      }

      if (isActive === undefined || typeof isActive !== 'string') {
        return res.status(400).json({ error: 'isActive is required' });
      }

      const isActiveBool = isActive === 'true';
      const products = await this.productService.getProductsByActive(tenantId, isActiveBool);
      return res.json(products);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  async importProducts(_req: Request, res: Response): Promise<Response> {
    // Placeholder endpoint for product import
    // Full implementation will be in a future module
    return res.status(501).json({
      error: 'Product import not yet implemented',
      message: 'This endpoint is a placeholder for future product import functionality',
    });
  }
}
