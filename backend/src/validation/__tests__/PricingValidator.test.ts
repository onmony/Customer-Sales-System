import { describe, it, expect } from 'vitest';
import { PricingValidator } from '../PricingValidator';

describe('PricingValidator', () => {
  describe('validatePrice', () => {
    it('should pass for valid price', () => {
      const result = PricingValidator.validatePrice(100.50);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for missing price', () => {
      const result = PricingValidator.validatePrice(undefined);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Price is required');
    });

    it('should fail for zero price', () => {
      const result = PricingValidator.validatePrice(0);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Price must be greater than 0');
    });

    it('should fail for negative price', () => {
      const result = PricingValidator.validatePrice(-10);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Price must be greater than 0');
    });

    it('should fail for NaN', () => {
      const result = PricingValidator.validatePrice(NaN);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Price must be a valid number');
    });

    it('should fail for price exceeding maximum', () => {
      const result = PricingValidator.validatePrice(1000000000);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Price cannot exceed 999,999,999.99');
    });
  });

  describe('validateCurrency', () => {
    it('should pass for valid currency', () => {
      const result = PricingValidator.validateCurrency('INR');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should pass for USD', () => {
      const result = PricingValidator.validateCurrency('USD');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for missing currency', () => {
      const result = PricingValidator.validateCurrency(undefined);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Currency is required');
    });

    it('should fail for empty currency', () => {
      const result = PricingValidator.validateCurrency('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Currency is required');
    });

    it('should fail for lowercase currency', () => {
      const result = PricingValidator.validateCurrency('inr');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Currency must be uppercase letters only');
    });

    it('should fail for currency with wrong length', () => {
      const result = PricingValidator.validateCurrency('IN');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Currency must be a 3-letter ISO code');
    });
  });

  describe('validateEffectiveDate', () => {
    it('should pass for valid date', () => {
      const date = new Date('2024-01-01');
      const result = PricingValidator.validateEffectiveDate(date);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should pass for valid date string', () => {
      const result = PricingValidator.validateEffectiveDate('2024-01-01');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for missing date', () => {
      const result = PricingValidator.validateEffectiveDate(undefined);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Effective date is required');
    });

    it('should fail for invalid date string', () => {
      const result = PricingValidator.validateEffectiveDate('invalid');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Effective date must be a valid date');
    });
  });

  describe('validateExpiryDate', () => {
    it('should pass when expiry date is after effective date', () => {
      const effectiveDate = new Date('2024-01-01');
      const expiryDate = new Date('2024-12-31');
      const result = PricingValidator.validateExpiryDate(effectiveDate, expiryDate);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should pass when expiry date is not provided', () => {
      const effectiveDate = new Date('2024-01-01');
      const result = PricingValidator.validateExpiryDate(effectiveDate, undefined);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail when expiry date is before effective date', () => {
      const effectiveDate = new Date('2024-12-31');
      const expiryDate = new Date('2024-01-01');
      const result = PricingValidator.validateExpiryDate(effectiveDate, expiryDate);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Expiry date must be after effective date');
    });

    it('should fail when expiry date equals effective date', () => {
      const effectiveDate = new Date('2024-01-01');
      const expiryDate = new Date('2024-01-01');
      const result = PricingValidator.validateExpiryDate(effectiveDate, expiryDate);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Expiry date must be after effective date');
    });

    it('should fail for invalid expiry date string', () => {
      const effectiveDate = new Date('2024-01-01');
      const result = PricingValidator.validateExpiryDate(effectiveDate, 'invalid');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Expiry date must be a valid date');
    });
  });

  describe('validateCustomerId', () => {
    it('should pass for valid customer ID', () => {
      const result = PricingValidator.validateCustomerId('customer-123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for missing customer ID', () => {
      const result = PricingValidator.validateCustomerId(undefined);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Customer ID is required');
    });

    it('should fail for empty customer ID', () => {
      const result = PricingValidator.validateCustomerId('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Customer ID is required');
    });
  });

  describe('validateProductId', () => {
    it('should pass for valid product ID', () => {
      const result = PricingValidator.validateProductId('product-123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for missing product ID', () => {
      const result = PricingValidator.validateProductId(undefined);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Product ID is required');
    });

    it('should fail for empty product ID', () => {
      const result = PricingValidator.validateProductId('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Product ID is required');
    });
  });

  describe('validateTenantId', () => {
    it('should pass for valid tenant ID', () => {
      const result = PricingValidator.validateTenantId('tenant-123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for missing tenant ID', () => {
      const result = PricingValidator.validateTenantId(undefined);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Tenant ID is required');
    });

    it('should fail for empty tenant ID', () => {
      const result = PricingValidator.validateTenantId('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Tenant ID is required');
    });
  });

  describe('validateStatusId', () => {
    it('should pass for valid status ID', () => {
      const result = PricingValidator.validateStatusId('status-123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for missing status ID', () => {
      const result = PricingValidator.validateStatusId(undefined);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Status ID is required');
    });

    it('should fail for empty status ID', () => {
      const result = PricingValidator.validateStatusId('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Status ID is required');
    });
  });

  describe('validateVersion', () => {
    it('should pass for valid version', () => {
      const result = PricingValidator.validateVersion(1);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for missing version', () => {
      const result = PricingValidator.validateVersion(undefined);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Version is required');
    });

    it('should fail for zero version', () => {
      const result = PricingValidator.validateVersion(0);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Version must be at least 1');
    });

    it('should fail for negative version', () => {
      const result = PricingValidator.validateVersion(-1);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Version must be at least 1');
    });

    it('should fail for NaN', () => {
      const result = PricingValidator.validateVersion(NaN);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Version must be a valid number');
    });
  });

  describe('validatePagination', () => {
    it('should pass for valid pagination', () => {
      const result = PricingValidator.validatePagination(0, 10);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should pass for undefined pagination', () => {
      const result = PricingValidator.validatePagination(undefined, undefined);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for negative skip', () => {
      const result = PricingValidator.validatePagination(-1, 10);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Skip must be non-negative');
    });

    it('should fail for negative take', () => {
      const result = PricingValidator.validatePagination(0, -1);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Take must be non-negative');
    });

    it('should fail for take exceeding maximum', () => {
      const result = PricingValidator.validatePagination(0, 101);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Take cannot exceed 100');
    });

    it('should fail for NaN skip', () => {
      const result = PricingValidator.validatePagination(NaN, 10);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Skip must be a valid number');
    });

    it('should fail for NaN take', () => {
      const result = PricingValidator.validatePagination(0, NaN);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Take must be a valid number');
    });
  });
});
