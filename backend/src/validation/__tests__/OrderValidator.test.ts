import { describe, it, expect } from 'vitest';
import { OrderValidator } from '../OrderValidator';

describe('OrderValidator', () => {
  describe('validateTenantId', () => {
    it('should pass for valid tenant ID', () => {
      const result = OrderValidator.validateTenantId('tenant-123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for missing tenant ID', () => {
      const result = OrderValidator.validateTenantId(undefined);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Tenant ID is required and must be a string');
    });

    it('should fail for empty tenant ID', () => {
      const result = OrderValidator.validateTenantId('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Tenant ID is required and must be a string');
    });

    it('should fail for non-string tenant ID', () => {
      const result = OrderValidator.validateTenantId(123);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Tenant ID is required and must be a string');
    });
  });

  describe('validateCustomerId', () => {
    it('should pass for valid customer ID', () => {
      const result = OrderValidator.validateCustomerId('customer-123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for missing customer ID', () => {
      const result = OrderValidator.validateCustomerId(undefined);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Customer ID is required and must be a string');
    });

    it('should fail for empty customer ID', () => {
      const result = OrderValidator.validateCustomerId('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Customer ID is required and must be a string');
    });
  });

  describe('validateOrderNumber', () => {
    it('should pass for valid order number', () => {
      const result = OrderValidator.validateOrderNumber('ORD-001');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for missing order number', () => {
      const result = OrderValidator.validateOrderNumber(undefined);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Order number is required and must be a string');
    });

    it('should fail for empty order number', () => {
      const result = OrderValidator.validateOrderNumber('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Order number is required and must be a string');
    });
  });

  describe('validateStatusId', () => {
    it('should pass for valid status ID', () => {
      const result = OrderValidator.validateStatusId('status-123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for missing status ID', () => {
      const result = OrderValidator.validateStatusId(undefined);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Status ID is required and must be a string');
    });

    it('should fail for empty status ID', () => {
      const result = OrderValidator.validateStatusId('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Status ID is required and must be a string');
    });
  });

  describe('validateOrderItems', () => {
    it('should pass for valid order items', () => {
      const items = [
        {
          productId: 'product-1',
          quantity: 10,
          unitPrice: 100.50,
        },
      ];
      const result = OrderValidator.validateOrderItems(items);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for non-array items', () => {
      const result = OrderValidator.validateOrderItems('not-an-array');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Order items must be an array');
    });

    it('should fail for empty items array', () => {
      const result = OrderValidator.validateOrderItems([]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Order must have at least one item');
    });

    it('should fail for item missing product ID', () => {
      const items = [{ quantity: 10, unitPrice: 100.50 }];
      const result = OrderValidator.validateOrderItems(items);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Item 1: Product ID is required');
    });

    it('should fail for item missing quantity', () => {
      const items = [{ productId: 'product-1', unitPrice: 100.50 }];
      const result = OrderValidator.validateOrderItems(items);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Item 1: Quantity is required');
    });

    it('should fail for item with zero quantity', () => {
      const items = [{ productId: 'product-1', quantity: 0, unitPrice: 100.50 }];
      const result = OrderValidator.validateOrderItems(items);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Item 1: Quantity must be a positive number');
    });

    it('should fail for item with negative quantity', () => {
      const items = [{ productId: 'product-1', quantity: -5, unitPrice: 100.50 }];
      const result = OrderValidator.validateOrderItems(items);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Item 1: Quantity must be a positive number');
    });

    it('should fail for item missing unit price', () => {
      const items = [{ productId: 'product-1', quantity: 10 }];
      const result = OrderValidator.validateOrderItems(items);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Item 1: Unit price is required');
    });

    it('should fail for item with zero unit price', () => {
      const items = [{ productId: 'product-1', quantity: 10, unitPrice: 0 }];
      const result = OrderValidator.validateOrderItems(items);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Item 1: Unit price must be a positive number');
    });

    it('should fail for item with negative unit price', () => {
      const items = [{ productId: 'product-1', quantity: 10, unitPrice: -50 }];
      const result = OrderValidator.validateOrderItems(items);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Item 1: Unit price must be a positive number');
    });
  });

  describe('validateOrderStatusForEdit', () => {
    it('should pass for draft status', () => {
      const result = OrderValidator.validateOrderStatusForEdit('draft');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for confirmed status', () => {
      const result = OrderValidator.validateOrderStatusForEdit('confirmed');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Only Draft orders can be edited');
    });

    it('should fail for cancelled status', () => {
      const result = OrderValidator.validateOrderStatusForEdit('cancelled');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Only Draft orders can be edited');
    });

    it('should fail for future module status', () => {
      const result = OrderValidator.validateOrderStatusForEdit('shipped');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Only Draft orders can be edited');
    });
  });

  describe('validateOrderStatusForConfirm', () => {
    it('should pass for draft status', () => {
      const result = OrderValidator.validateOrderStatusForConfirm('draft');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for confirmed status', () => {
      const result = OrderValidator.validateOrderStatusForConfirm('confirmed');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Only Draft orders can be confirmed');
    });

    it('should fail for cancelled status', () => {
      const result = OrderValidator.validateOrderStatusForConfirm('cancelled');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Only Draft orders can be confirmed');
    });
  });

  describe('validateOrderStatusForCancel', () => {
    it('should pass for draft status', () => {
      const result = OrderValidator.validateOrderStatusForCancel('draft');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for confirmed status', () => {
      const result = OrderValidator.validateOrderStatusForCancel('confirmed');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Only Draft orders can be cancelled');
    });

    it('should fail for cancelled status', () => {
      const result = OrderValidator.validateOrderStatusForCancel('cancelled');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Only Draft orders can be cancelled');
    });
  });

  describe('validateStatusTransition', () => {
    it('should pass for draft to confirmed', () => {
      const result = OrderValidator.validateStatusTransition('draft', 'confirmed');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should pass for draft to cancelled', () => {
      const result = OrderValidator.validateStatusTransition('draft', 'cancelled');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for confirmed to draft', () => {
      const result = OrderValidator.validateStatusTransition('confirmed', 'draft');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid status transition from confirmed to draft');
    });

    it('should fail for cancelled to draft', () => {
      const result = OrderValidator.validateStatusTransition('cancelled', 'draft');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid status transition from cancelled to draft');
    });

    it('should fail for transition to future module status', () => {
      const result = OrderValidator.validateStatusTransition('draft', 'shipped');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Transition to shipped is not allowed in Module 6');
    });

    it('should fail for transition to pending', () => {
      const result = OrderValidator.validateStatusTransition('draft', 'pending');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Transition to pending is not allowed in Module 6');
    });

    it('should fail for transition to processing', () => {
      const result = OrderValidator.validateStatusTransition('draft', 'processing');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Transition to processing is not allowed in Module 6');
    });

    it('should fail for transition to delivered', () => {
      const result = OrderValidator.validateStatusTransition('draft', 'delivered');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Transition to delivered is not allowed in Module 6');
    });

    it('should fail for transition to on_hold', () => {
      const result = OrderValidator.validateStatusTransition('draft', 'on_hold');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Transition to on_hold is not allowed in Module 6');
    });
  });

  describe('validatePagination', () => {
    it('should pass for valid pagination', () => {
      const result = OrderValidator.validatePagination(0, 10);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should pass for undefined pagination', () => {
      const result = OrderValidator.validatePagination(undefined, undefined);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for negative skip', () => {
      const result = OrderValidator.validatePagination(-1, 10);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Skip must be a non-negative number');
    });

    it('should fail for negative take', () => {
      const result = OrderValidator.validatePagination(0, -1);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Take must be a positive number');
    });

    it('should fail for take exceeding maximum', () => {
      const result = OrderValidator.validatePagination(0, 101);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Take cannot exceed 100');
    });

    it('should fail for NaN skip', () => {
      const result = OrderValidator.validatePagination(NaN, 10);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Skip must be a non-negative number');
    });

    it('should fail for NaN take', () => {
      const result = OrderValidator.validatePagination(0, NaN);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Take must be a positive number');
    });
  });
});
