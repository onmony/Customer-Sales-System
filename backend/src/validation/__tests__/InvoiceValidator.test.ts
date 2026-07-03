import { describe, it, expect } from 'vitest';
import { InvoiceValidator } from '../InvoiceValidator';

describe('InvoiceValidator', () => {
  describe('validateTenantId', () => {
    it('should pass for valid tenant ID', () => {
      const result = InvoiceValidator.validateTenantId('tenant-123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for missing tenant ID', () => {
      const result = InvoiceValidator.validateTenantId(undefined);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Tenant ID is required and must be a string');
    });

    it('should fail for empty tenant ID', () => {
      const result = InvoiceValidator.validateTenantId('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Tenant ID is required and must be a string');
    });

    it('should fail for non-string tenant ID', () => {
      const result = InvoiceValidator.validateTenantId(123);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Tenant ID is required and must be a string');
    });
  });

  describe('validateCustomerId', () => {
    it('should pass for valid customer ID', () => {
      const result = InvoiceValidator.validateCustomerId('customer-123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for missing customer ID', () => {
      const result = InvoiceValidator.validateCustomerId(undefined);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Customer ID is required and must be a string');
    });

    it('should fail for empty customer ID', () => {
      const result = InvoiceValidator.validateCustomerId('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Customer ID is required and must be a string');
    });
  });

  describe('validateOrderId', () => {
    it('should pass for valid order ID', () => {
      const result = InvoiceValidator.validateOrderId('order-123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for missing order ID', () => {
      const result = InvoiceValidator.validateOrderId(undefined);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Order ID is required and must be a string');
    });

    it('should fail for empty order ID', () => {
      const result = InvoiceValidator.validateOrderId('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Order ID is required and must be a string');
    });
  });

  describe('validateInvoiceNumber', () => {
    it('should pass for valid invoice number', () => {
      const result = InvoiceValidator.validateInvoiceNumber('INV-001');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for missing invoice number', () => {
      const result = InvoiceValidator.validateInvoiceNumber(undefined);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invoice number is required and must be a string');
    });

    it('should fail for empty invoice number', () => {
      const result = InvoiceValidator.validateInvoiceNumber('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invoice number is required and must be a string');
    });
  });

  describe('validateStatusId', () => {
    it('should pass for valid status ID', () => {
      const result = InvoiceValidator.validateStatusId('status-123');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for missing status ID', () => {
      const result = InvoiceValidator.validateStatusId(undefined);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Status ID is required and must be a string');
    });

    it('should fail for empty status ID', () => {
      const result = InvoiceValidator.validateStatusId('');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Status ID is required and must be a string');
    });
  });

  describe('validateInvoiceItems', () => {
    it('should pass for valid invoice items', () => {
      const items = [
        {
          productId: 'product-1',
          quantity: 10,
          unitPrice: 100.50,
          currency: 'INR',
        },
      ];
      const result = InvoiceValidator.validateInvoiceItems(items);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for non-array items', () => {
      const result = InvoiceValidator.validateInvoiceItems('not-an-array');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invoice items must be an array');
    });

    it('should fail for empty items array', () => {
      const result = InvoiceValidator.validateInvoiceItems([]);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invoice must have at least one item');
    });

    it('should fail for item missing product ID', () => {
      const items = [{ quantity: 10, unitPrice: 100.50, currency: 'INR' }];
      const result = InvoiceValidator.validateInvoiceItems(items);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Item 1: Product ID is required');
    });

    it('should fail for item missing quantity', () => {
      const items = [{ productId: 'product-1', unitPrice: 100.50, currency: 'INR' }];
      const result = InvoiceValidator.validateInvoiceItems(items);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Item 1: Quantity is required');
    });

    it('should fail for item with zero quantity', () => {
      const items = [{ productId: 'product-1', quantity: 0, unitPrice: 100.50, currency: 'INR' }];
      const result = InvoiceValidator.validateInvoiceItems(items);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Item 1: Quantity must be a positive number');
    });

    it('should fail for item with negative quantity', () => {
      const items = [{ productId: 'product-1', quantity: -5, unitPrice: 100.50, currency: 'INR' }];
      const result = InvoiceValidator.validateInvoiceItems(items);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Item 1: Quantity must be a positive number');
    });

    it('should fail for item missing unit price', () => {
      const items = [{ productId: 'product-1', quantity: 10, currency: 'INR' }];
      const result = InvoiceValidator.validateInvoiceItems(items);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Item 1: Unit price is required');
    });

    it('should fail for item with zero unit price', () => {
      const items = [{ productId: 'product-1', quantity: 10, unitPrice: 0, currency: 'INR' }];
      const result = InvoiceValidator.validateInvoiceItems(items);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Item 1: Unit price must be a positive number');
    });

    it('should fail for item with negative unit price', () => {
      const items = [{ productId: 'product-1', quantity: 10, unitPrice: -50, currency: 'INR' }];
      const result = InvoiceValidator.validateInvoiceItems(items);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Item 1: Unit price must be a positive number');
    });

    it('should fail for item missing currency', () => {
      const items = [{ productId: 'product-1', quantity: 10, unitPrice: 100.50 }];
      const result = InvoiceValidator.validateInvoiceItems(items);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Item 1: Currency is required');
    });
  });

  describe('validateInvoiceStatusForIssue', () => {
    it('should pass for draft status', () => {
      const result = InvoiceValidator.validateInvoiceStatusForIssue('draft');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for issued status', () => {
      const result = InvoiceValidator.validateInvoiceStatusForIssue('issued');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Only Draft invoices can be issued');
    });

    it('should fail for cancelled status', () => {
      const result = InvoiceValidator.validateInvoiceStatusForIssue('cancelled');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Only Draft invoices can be issued');
    });

    it('should fail for future module status', () => {
      const result = InvoiceValidator.validateInvoiceStatusForIssue('paid');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Only Draft invoices can be issued');
    });
  });

  describe('validateInvoiceStatusForCancel', () => {
    it('should pass for draft status', () => {
      const result = InvoiceValidator.validateInvoiceStatusForCancel('draft');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for issued status', () => {
      const result = InvoiceValidator.validateInvoiceStatusForCancel('issued');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Only Draft invoices can be cancelled');
    });

    it('should fail for cancelled status', () => {
      const result = InvoiceValidator.validateInvoiceStatusForCancel('cancelled');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Only Draft invoices can be cancelled');
    });
  });

  describe('validateInvoiceStatusForEdit', () => {
    it('should pass for draft status', () => {
      const result = InvoiceValidator.validateInvoiceStatusForEdit('draft');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for issued status', () => {
      const result = InvoiceValidator.validateInvoiceStatusForEdit('issued');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Only Draft invoices can be edited');
    });

    it('should fail for cancelled status', () => {
      const result = InvoiceValidator.validateInvoiceStatusForEdit('cancelled');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Only Draft invoices can be edited');
    });
  });

  describe('validateStatusTransition', () => {
    it('should pass for draft to issued', () => {
      const result = InvoiceValidator.validateStatusTransition('draft', 'issued');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should pass for draft to cancelled', () => {
      const result = InvoiceValidator.validateStatusTransition('draft', 'cancelled');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for issued to draft', () => {
      const result = InvoiceValidator.validateStatusTransition('issued', 'draft');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid status transition from issued to draft');
    });

    it('should fail for cancelled to draft', () => {
      const result = InvoiceValidator.validateStatusTransition('cancelled', 'draft');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid status transition from cancelled to draft');
    });

    it('should fail for transition to future module status', () => {
      const result = InvoiceValidator.validateStatusTransition('draft', 'paid');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Transition to paid is not allowed in Module 7');
    });

    it('should fail for transition to viewed', () => {
      const result = InvoiceValidator.validateStatusTransition('draft', 'viewed');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Transition to viewed is not allowed in Module 7');
    });

    it('should fail for transition to partial', () => {
      const result = InvoiceValidator.validateStatusTransition('draft', 'partial');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Transition to partial is not allowed in Module 7');
    });

    it('should fail for transition to overdue', () => {
      const result = InvoiceValidator.validateStatusTransition('draft', 'overdue');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Transition to overdue is not allowed in Module 7');
    });

    it('should fail for transition to void', () => {
      const result = InvoiceValidator.validateStatusTransition('draft', 'void');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Transition to void is not allowed in Module 7');
    });

    it('should fail for transition to written_off', () => {
      const result = InvoiceValidator.validateStatusTransition('draft', 'written_off');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Transition to written_off is not allowed in Module 7');
    });
  });

  describe('validateOrderForInvoiceGeneration', () => {
    it('should pass for confirmed order', () => {
      const result = InvoiceValidator.validateOrderForInvoiceGeneration('confirmed');
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for draft order', () => {
      const result = InvoiceValidator.validateOrderForInvoiceGeneration('draft');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invoice can only be generated from Confirmed orders');
    });

    it('should fail for cancelled order', () => {
      const result = InvoiceValidator.validateOrderForInvoiceGeneration('cancelled');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invoice can only be generated from Confirmed orders');
    });

    it('should fail for pending order', () => {
      const result = InvoiceValidator.validateOrderForInvoiceGeneration('pending');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invoice can only be generated from Confirmed orders');
    });
  });

  describe('validateDocumentSnapshot', () => {
    it('should pass for valid document snapshot', () => {
      const snapshot = {
        customer: { name: 'Test Customer', gstNumber: 'GST123' },
        order: { orderNumber: 'ORD-001', orderDate: new Date() },
        items: [{ productId: 'product-1', quantity: 10, unitPrice: 100 }],
      };
      const result = InvoiceValidator.validateDocumentSnapshot(snapshot);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for missing document snapshot', () => {
      const result = InvoiceValidator.validateDocumentSnapshot(undefined);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Document snapshot is required and must be an object');
    });

    it('should fail for non-object snapshot', () => {
      const result = InvoiceValidator.validateDocumentSnapshot('not-an-object');
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Document snapshot is required and must be an object');
    });

    it('should fail for missing customer snapshot', () => {
      const snapshot = {
        order: { orderNumber: 'ORD-001' },
        items: [],
      };
      const result = InvoiceValidator.validateDocumentSnapshot(snapshot);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Document snapshot must contain customer information');
    });

    it('should fail for missing order snapshot', () => {
      const snapshot = {
        customer: { name: 'Test' },
        items: [],
      };
      const result = InvoiceValidator.validateDocumentSnapshot(snapshot);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Document snapshot must contain order information');
    });

    it('should fail for missing items', () => {
      const snapshot = {
        customer: { name: 'Test' },
        order: { orderNumber: 'ORD-001' },
      };
      const result = InvoiceValidator.validateDocumentSnapshot(snapshot);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Document snapshot must contain items array');
    });

    it('should fail for empty items array', () => {
      const snapshot = {
        customer: { name: 'Test' },
        order: { orderNumber: 'ORD-001' },
        items: [],
      };
      const result = InvoiceValidator.validateDocumentSnapshot(snapshot);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Document snapshot must contain at least one item');
    });
  });

  describe('validatePagination', () => {
    it('should pass for valid pagination', () => {
      const result = InvoiceValidator.validatePagination(0, 10);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should pass for undefined pagination', () => {
      const result = InvoiceValidator.validatePagination(undefined, undefined);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should fail for negative skip', () => {
      const result = InvoiceValidator.validatePagination(-1, 10);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Skip must be a non-negative number');
    });

    it('should fail for negative take', () => {
      const result = InvoiceValidator.validatePagination(0, -1);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Take must be a positive number');
    });

    it('should fail for take exceeding maximum', () => {
      const result = InvoiceValidator.validatePagination(0, 101);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Take cannot exceed 100');
    });

    it('should fail for NaN skip', () => {
      const result = InvoiceValidator.validatePagination(NaN, 10);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Skip must be a non-negative number');
    });

    it('should fail for NaN take', () => {
      const result = InvoiceValidator.validatePagination(0, NaN);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Take must be a positive number');
    });
  });
});
