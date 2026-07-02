import { ProductRepository } from '../repositories/ProductRepository';
import { ProductValidator } from '../validation/ProductValidator';

export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  async createProduct(input: {
    tenantId: string;
    displayName: string;
    sku?: string;
    unit: string;
    isActive?: boolean;
    createdBy?: string;
  }) {
    // Validate input
    const displayNameValidation = ProductValidator.validateDisplayName(input.displayName);
    if (!displayNameValidation.isValid) {
      throw new Error(displayNameValidation.errors.join(', '));
    }

    const skuValidation = ProductValidator.validateSku(input.sku);
    if (!skuValidation.isValid) {
      throw new Error(skuValidation.errors.join(', '));
    }

    const unitValidation = ProductValidator.validateUnit(input.unit);
    if (!unitValidation.isValid) {
      throw new Error(unitValidation.errors.join(', '));
    }

    const isActiveValidation = ProductValidator.validateIsActive(input.isActive);
    if (!isActiveValidation.isValid) {
      throw new Error(isActiveValidation.errors.join(', '));
    }

    // Check SKU uniqueness if provided
    if (input.sku && input.sku.trim().length > 0) {
      input.sku = input.sku.trim();
      const existingSku = await this.productRepository.findBySku(input.tenantId, input.sku);
      if (existingSku) {
        throw new Error('SKU must be unique within tenant');
      }
    } else {
      input.sku = undefined;
    }

    // Create product
    return this.productRepository.create(input);
  }

  async getProduct(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async listProducts(tenantId: string, params?: { skip?: number; take?: number }) {
    const { skip, take } = params || {};

    // Validate pagination
    const paginationValidation = ProductValidator.validatePagination(skip, take);
    if (!paginationValidation.isValid) {
      throw new Error(paginationValidation.errors.join(', '));
    }

    return this.productRepository.list(tenantId, skip, take);
  }

  async searchProducts(params: {
    tenantId: string;
    query: string;
    skip?: number;
    take?: number;
  }) {
    const { tenantId, query, skip, take } = params;

    // Validate search query
    const queryValidation = ProductValidator.validateSearchQuery(query);
    if (!queryValidation.isValid) {
      throw new Error(queryValidation.errors.join(', '));
    }

    // Validate pagination
    const paginationValidation = ProductValidator.validatePagination(skip, take);
    if (!paginationValidation.isValid) {
      throw new Error(paginationValidation.errors.join(', '));
    }

    return this.productRepository.search(tenantId, query, skip, take);
  }

  async updateProduct(id: string, input: {
    displayName?: string;
    sku?: string;
    unit?: string;
    isActive?: boolean;
    updatedBy?: string;
  }) {
    // Validate input if provided
    if (input.displayName !== undefined) {
      const displayNameValidation = ProductValidator.validateDisplayName(input.displayName);
      if (!displayNameValidation.isValid) {
        throw new Error(displayNameValidation.errors.join(', '));
      }
    }

    if (input.sku !== undefined) {
      const skuValidation = ProductValidator.validateSku(input.sku);
      if (!skuValidation.isValid) {
        throw new Error(skuValidation.errors.join(', '));
      }
    }

    if (input.unit !== undefined) {
      const unitValidation = ProductValidator.validateUnit(input.unit);
      if (!unitValidation.isValid) {
        throw new Error(unitValidation.errors.join(', '));
      }
    }

    if (input.isActive !== undefined) {
      const isActiveValidation = ProductValidator.validateIsActive(input.isActive);
      if (!isActiveValidation.isValid) {
        throw new Error(isActiveValidation.errors.join(', '));
      }
    }

    // Check if product exists
    const existing = await this.productRepository.findById(id);
    if (!existing) {
      throw new Error('Product not found');
    }

    // Check if product is archived
    if (existing.deletedAt) {
      throw new Error('Cannot update archived product');
    }

    // Check SKU uniqueness if being changed
    if (input.sku !== undefined && input.sku.trim().length > 0) {
      input.sku = input.sku.trim();
      const existingSku = await this.productRepository.findBySkuExcludingId(
        existing.tenantId,
        input.sku,
        id
      );
      if (existingSku) {
        throw new Error('SKU must be unique within tenant');
      }
    } else if (input.sku !== undefined && input.sku.trim().length === 0) {
      input.sku = undefined;
    }

    // Update product
    return this.productRepository.update(id, input);
  }

  async archiveProduct(id: string) {
    // Check if product exists
    const existing = await this.productRepository.findById(id);
    if (!existing) {
      throw new Error('Product not found');
    }

    // Check if already archived
    if (existing.deletedAt) {
      throw new Error('Product is already archived');
    }

    // Archive product
    return this.productRepository.archive(id);
  }

  async getProductsByActive(tenantId: string, isActive: boolean) {
    return this.productRepository.findByActive(tenantId, isActive);
  }
}
