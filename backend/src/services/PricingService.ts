import { PricingRepository } from '../repositories/PricingRepository';
import { PricingValidator } from '../validation/PricingValidator';

export class PricingService {
  constructor(private pricingRepository: PricingRepository) {}

  async createPricing(input: {
    tenantId: string;
    customerId: string;
    productId: string;
    price: number;
    currency?: string;
    effectiveDate: Date;
    expiryDate?: Date;
    statusId: string;
    createdBy?: string;
  }) {
    // Validate input
    const tenantIdValidation = PricingValidator.validateTenantId(input.tenantId);
    if (!tenantIdValidation.isValid) {
      throw new Error(tenantIdValidation.errors.join(', '));
    }

    const customerIdValidation = PricingValidator.validateCustomerId(input.customerId);
    if (!customerIdValidation.isValid) {
      throw new Error(customerIdValidation.errors.join(', '));
    }

    const productIdValidation = PricingValidator.validateProductId(input.productId);
    if (!productIdValidation.isValid) {
      throw new Error(productIdValidation.errors.join(', '));
    }

    const priceValidation = PricingValidator.validatePrice(input.price);
    if (!priceValidation.isValid) {
      throw new Error(priceValidation.errors.join(', '));
    }

    const currencyValidation = PricingValidator.validateCurrency(input.currency);
    if (!currencyValidation.isValid) {
      throw new Error(currencyValidation.errors.join(', '));
    }

    const effectiveDateValidation = PricingValidator.validateEffectiveDate(input.effectiveDate);
    if (!effectiveDateValidation.isValid) {
      throw new Error(effectiveDateValidation.errors.join(', '));
    }

    const expiryDateValidation = PricingValidator.validateExpiryDate(input.effectiveDate, input.expiryDate);
    if (!expiryDateValidation.isValid) {
      throw new Error(expiryDateValidation.errors.join(', '));
    }

    const statusIdValidation = PricingValidator.validateStatusId(input.statusId);
    if (!statusIdValidation.isValid) {
      throw new Error(statusIdValidation.errors.join(', '));
    }

    // Check for overlapping pricing (same effective date for same customer-product pair)
    const existingPricing = await this.pricingRepository.findOverlappingPricing(
      input.tenantId,
      input.customerId,
      input.productId,
      input.effectiveDate
    );

    if (existingPricing) {
      throw new Error('Pricing with the same effective date already exists for this customer-product pair');
    }

    // Determine version number (increment from existing versions)
    const existingVersions = await this.pricingRepository.findByCustomerProduct(
      input.tenantId,
      input.customerId,
      input.productId
    );
    const maxVersion = existingVersions.length > 0 ? Math.max(...existingVersions.map((p) => p.version)) : 0;
    const newVersion = maxVersion + 1;

    // Create pricing
    return this.pricingRepository.create({
      tenantId: input.tenantId,
      customerId: input.customerId,
      productId: input.productId,
      price: input.price,
      currency: input.currency || 'INR',
      effectiveDate: input.effectiveDate,
      expiryDate: input.expiryDate,
      statusId: input.statusId,
      version: newVersion,
      createdBy: input.createdBy,
    });
  }

  async getPricing(id: string) {
    const pricing = await this.pricingRepository.findById(id);
    if (!pricing) {
      throw new Error('Pricing not found');
    }
    return pricing;
  }

  async listPricing(tenantId: string, params?: { skip?: number; take?: number }) {
    const { skip, take } = params || {};

    // Validate pagination
    const paginationValidation = PricingValidator.validatePagination(skip, take);
    if (!paginationValidation.isValid) {
      throw new Error(paginationValidation.errors.join(', '));
    }

    return this.pricingRepository.list(tenantId, skip, take);
  }

  async resolvePricing(tenantId: string, customerId: string, productId: string, date?: Date) {
    const tenantIdValidation = PricingValidator.validateTenantId(tenantId);
    if (!tenantIdValidation.isValid) {
      throw new Error(tenantIdValidation.errors.join(', '));
    }

    const customerIdValidation = PricingValidator.validateCustomerId(customerId);
    if (!customerIdValidation.isValid) {
      throw new Error(customerIdValidation.errors.join(', '));
    }

    const productIdValidation = PricingValidator.validateProductId(productId);
    if (!productIdValidation.isValid) {
      throw new Error(productIdValidation.errors.join(', '));
    }

    const resolutionDate = date || new Date();

    // Resolve active pricing for the given date
    const activePricing = await this.pricingRepository.findActivePricing(
      tenantId,
      customerId,
      productId,
      resolutionDate
    );

    if (!activePricing) {
      throw new Error('No active pricing found for this customer-product pair');
    }

    return activePricing;
  }

  async getPricingHistory(tenantId: string, customerId: string, productId: string) {
    const tenantIdValidation = PricingValidator.validateTenantId(tenantId);
    if (!tenantIdValidation.isValid) {
      throw new Error(tenantIdValidation.errors.join(', '));
    }

    const customerIdValidation = PricingValidator.validateCustomerId(customerId);
    if (!customerIdValidation.isValid) {
      throw new Error(customerIdValidation.errors.join(', '));
    }

    const productIdValidation = PricingValidator.validateProductId(productId);
    if (!productIdValidation.isValid) {
      throw new Error(productIdValidation.errors.join(', '));
    }

    return this.pricingRepository.findByCustomerProduct(tenantId, customerId, productId);
  }

  async updatePricing(id: string, input: {
    price?: number;
    currency?: string;
    effectiveDate?: Date;
    expiryDate?: Date;
    updatedBy?: string;
  }) {
    // Check if pricing exists
    const existing = await this.pricingRepository.findById(id);
    if (!existing) {
      throw new Error('Pricing not found');
    }

    // Validate input if provided
    if (input.price !== undefined) {
      const priceValidation = PricingValidator.validatePrice(input.price);
      if (!priceValidation.isValid) {
        throw new Error(priceValidation.errors.join(', '));
      }
    }

    if (input.currency !== undefined) {
      const currencyValidation = PricingValidator.validateCurrency(input.currency);
      if (!currencyValidation.isValid) {
        throw new Error(currencyValidation.errors.join(', '));
      }
    }

    if (input.effectiveDate !== undefined) {
      const effectiveDateValidation = PricingValidator.validateEffectiveDate(input.effectiveDate);
      if (!effectiveDateValidation.isValid) {
        throw new Error(effectiveDateValidation.errors.join(', '));
      }

      // Check for overlapping pricing if effective date is changing
      if (input.effectiveDate.getTime() !== existing.effectiveDate.getTime()) {
        const overlappingPricing = await this.pricingRepository.findOverlappingPricing(
          existing.tenantId,
          existing.customerId,
          existing.productId,
          input.effectiveDate
        );

        if (overlappingPricing && overlappingPricing.id !== id) {
          throw new Error('Pricing with the same effective date already exists for this customer-product pair');
        }
      }
    }

    if (input.expiryDate !== undefined) {
      const effectiveDateToUse = input.effectiveDate || existing.effectiveDate;
      const expiryDateValidation = PricingValidator.validateExpiryDate(effectiveDateToUse, input.expiryDate);
      if (!expiryDateValidation.isValid) {
        throw new Error(expiryDateValidation.errors.join(', '));
      }
    }

    // Create new version instead of updating existing (immutable versioning)
    const existingVersions = await this.pricingRepository.findByCustomerProduct(
      existing.tenantId,
      existing.customerId,
      existing.productId
    );
    const maxVersion = existingVersions.length > 0 ? Math.max(...existingVersions.map((p) => p.version)) : 0;
    const newVersion = maxVersion + 1;

    return this.pricingRepository.create({
      tenantId: existing.tenantId,
      customerId: existing.customerId,
      productId: existing.productId,
      price: input.price !== undefined ? input.price : Number(existing.price),
      currency: input.currency !== undefined ? input.currency : existing.currency,
      effectiveDate: input.effectiveDate !== undefined ? input.effectiveDate : existing.effectiveDate,
      expiryDate: input.expiryDate !== undefined ? input.expiryDate : (existing.expiryDate || undefined),
      statusId: existing.statusId,
      version: newVersion,
      createdBy: existing.createdBy || undefined,
      updatedBy: input.updatedBy,
    });
  }

  async archivePricing(id: string) {
    // Check if pricing exists
    const existing = await this.pricingRepository.findById(id);
    if (!existing) {
      throw new Error('Pricing not found');
    }

    // Check if already archived
    if (existing.deletedAt) {
      throw new Error('Pricing is already archived');
    }

    // Archive pricing
    return this.pricingRepository.archive(id);
  }
}
