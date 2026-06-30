import { describe, it, expect } from 'vitest';
import { CustomerValidator } from '../CustomerValidator';

describe('CustomerValidator', () => {
  describe('validateDisplayName', () => {
    it('should pass for valid display name', () => {
      const result = CustomerValidator.validateDisplayName('Test Customer');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for empty display name', () => {
      const result = CustomerValidator.validateDisplayName('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Customer display name is required');
    });

    it('should fail for whitespace-only display name', () => {
      const result = CustomerValidator.validateDisplayName('   ');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Customer display name is required');
    });

    it('should fail for display name exceeding 255 characters', () => {
      const longName = 'A'.repeat(256);
      const result = CustomerValidator.validateDisplayName(longName);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Customer display name cannot exceed 255 characters');
    });
  });

  describe('validateGstNumber', () => {
    it('should pass for valid GST number', () => {
      const result = CustomerValidator.validateGstNumber('27ABCDE1234F1Z5');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should pass for undefined GST number', () => {
      const result = CustomerValidator.validateGstNumber(undefined);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should pass for empty string GST number', () => {
      const result = CustomerValidator.validateGstNumber('');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for GST number with wrong length', () => {
      const result = CustomerValidator.validateGstNumber('12345');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('GST number must be 15 characters');
    });

    it('should fail for GST number with special characters', () => {
      const result = CustomerValidator.validateGstNumber('27ABCDE1234F1@5');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('GST number must contain only alphanumeric characters');
    });
  });

  describe('validateCreditLimit', () => {
    it('should pass for valid credit limit', () => {
      const result = CustomerValidator.validateCreditLimit(10000);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should pass for undefined credit limit', () => {
      const result = CustomerValidator.validateCreditLimit(undefined);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should pass for zero credit limit', () => {
      const result = CustomerValidator.validateCreditLimit(0);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for negative credit limit', () => {
      const result = CustomerValidator.validateCreditLimit(-100);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Credit limit cannot be negative');
    });

    it('should fail for credit limit exceeding maximum', () => {
      const result = CustomerValidator.validateCreditLimit(1000000000000);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Credit limit exceeds maximum allowed value');
    });
  });

  describe('validateStatusId', () => {
    it('should pass for valid status ID', () => {
      const result = CustomerValidator.validateStatusId('status-123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for empty status ID', () => {
      const result = CustomerValidator.validateStatusId('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Customer status ID is required');
    });

    it('should fail for whitespace-only status ID', () => {
      const result = CustomerValidator.validateStatusId('   ');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Customer status ID is required');
    });
  });

  describe('validateSearchQuery', () => {
    it('should pass for valid search query', () => {
      const result = CustomerValidator.validateSearchQuery('Test');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for empty search query', () => {
      const result = CustomerValidator.validateSearchQuery('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Search query is required');
    });

    it('should fail for whitespace-only search query', () => {
      const result = CustomerValidator.validateSearchQuery('   ');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Search query is required');
    });

    it('should fail for search query less than 2 characters', () => {
      const result = CustomerValidator.validateSearchQuery('A');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Search query must be at least 2 characters');
    });

    it('should fail for search query exceeding 100 characters', () => {
      const longQuery = 'A'.repeat(101);
      const result = CustomerValidator.validateSearchQuery(longQuery);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Search query cannot exceed 100 characters');
    });
  });

  describe('validatePagination', () => {
    it('should pass for valid pagination', () => {
      const result = CustomerValidator.validatePagination(0, 10);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should pass for undefined pagination', () => {
      const result = CustomerValidator.validatePagination(undefined, undefined);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail for negative skip', () => {
      const result = CustomerValidator.validatePagination(-1, 10);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Skip value cannot be negative');
    });

    it('should fail for negative take', () => {
      const result = CustomerValidator.validatePagination(0, -10);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Take value cannot be negative');
    });

    it('should fail for take exceeding 100', () => {
      const result = CustomerValidator.validatePagination(0, 101);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Take value cannot exceed 100');
    });
  });
});
