import { describe, it, expect } from 'vitest';
import { ProductValidator } from '../ProductValidator';

describe('ProductValidator', () => {
  describe('validateDisplayName', () => {
    it('should pass for valid display name', () => {
      const result = ProductValidator.validateDisplayName('Test Product');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for empty display name', () => {
      const result = ProductValidator.validateDisplayName('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Display name is required');
    });

    it('should fail for missing display name', () => {
      const result = ProductValidator.validateDisplayName(undefined);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Display name is required');
    });

    it('should fail for display name exceeding max length', () => {
      const longName = 'A'.repeat(256);
      const result = ProductValidator.validateDisplayName(longName);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Display name must be at most 255 characters');
    });
  });

  describe('validateSku', () => {
    it('should pass for valid SKU', () => {
      const result = ProductValidator.validateSku('SKU-123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should pass for undefined SKU', () => {
      const result = ProductValidator.validateSku(undefined);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for empty SKU', () => {
      const result = ProductValidator.validateSku('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('SKU cannot be empty if provided');
    });

    it('should fail for SKU exceeding max length', () => {
      const longSku = 'A'.repeat(101);
      const result = ProductValidator.validateSku(longSku);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('SKU must be at most 100 characters');
    });
  });

  describe('validateUnit', () => {
    it('should pass for valid unit', () => {
      const result = ProductValidator.validateUnit('PCS');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for empty unit', () => {
      const result = ProductValidator.validateUnit('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Unit is required');
    });

    it('should fail for missing unit', () => {
      const result = ProductValidator.validateUnit(undefined);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Unit is required');
    });

    it('should fail for unit exceeding max length', () => {
      const longUnit = 'A'.repeat(51);
      const result = ProductValidator.validateUnit(longUnit);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Unit must be at most 50 characters');
    });
  });

  describe('validateIsActive', () => {
    it('should pass for true', () => {
      const result = ProductValidator.validateIsActive(true);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should pass for false', () => {
      const result = ProductValidator.validateIsActive(false);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should pass for undefined', () => {
      const result = ProductValidator.validateIsActive(undefined);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for non-boolean', () => {
      const result = ProductValidator.validateIsActive('true' as any);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('isActive must be a boolean');
    });
  });

  describe('validateSearchQuery', () => {
    it('should pass for valid search query', () => {
      const result = ProductValidator.validateSearchQuery('Test');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for empty search query', () => {
      const result = ProductValidator.validateSearchQuery('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Search query is required');
    });

    it('should fail for missing search query', () => {
      const result = ProductValidator.validateSearchQuery(undefined);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Search query is required');
    });

    it('should fail for search query below minimum length', () => {
      const result = ProductValidator.validateSearchQuery('A');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Search query must be at least 2 characters');
    });

    it('should fail for search query exceeding max length', () => {
      const longQuery = 'A'.repeat(101);
      const result = ProductValidator.validateSearchQuery(longQuery);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Search query must be at most 100 characters');
    });
  });

  describe('validatePagination', () => {
    it('should pass for valid pagination', () => {
      const result = ProductValidator.validatePagination(0, 10);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should pass for undefined pagination', () => {
      const result = ProductValidator.validatePagination(undefined, undefined);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for negative skip', () => {
      const result = ProductValidator.validatePagination(-1, 10);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Skip must be a non-negative number');
    });

    it('should fail for negative take', () => {
      const result = ProductValidator.validatePagination(0, -1);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Take must be a non-negative number');
    });

    it('should fail for take exceeding maximum', () => {
      const result = ProductValidator.validatePagination(0, 101);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Take cannot exceed 100');
    });
  });
});
