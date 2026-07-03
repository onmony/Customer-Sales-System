export class InvoiceValidator {
  static validateTenantId(tenantId: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!tenantId || typeof tenantId !== 'string') {
      errors.push('Tenant ID is required and must be a string');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateCustomerId(customerId: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!customerId || typeof customerId !== 'string') {
      errors.push('Customer ID is required and must be a string');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateOrderId(orderId: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!orderId || typeof orderId !== 'string') {
      errors.push('Order ID is required and must be a string');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateInvoiceNumber(invoiceNumber: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!invoiceNumber || typeof invoiceNumber !== 'string') {
      errors.push('Invoice number is required and must be a string');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateStatusId(statusId: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!statusId || typeof statusId !== 'string') {
      errors.push('Status ID is required and must be a string');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateInvoiceItems(items: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!Array.isArray(items)) {
      errors.push('Invoice items must be an array');
      return { isValid: false, errors };
    }
    
    if (items.length === 0) {
      errors.push('Invoice must have at least one item');
    }
    
    items.forEach((item, index) => {
      if (!item.productId || typeof item.productId !== 'string') {
        errors.push(`Item ${index + 1}: Product ID is required`);
      }
      
      if (item.quantity === undefined || item.quantity === null) {
        errors.push(`Item ${index + 1}: Quantity is required`);
      } else if (typeof item.quantity !== 'number' || item.quantity <= 0) {
        errors.push(`Item ${index + 1}: Quantity must be a positive number`);
      }
      
      if (item.unitPrice === undefined || item.unitPrice === null) {
        errors.push(`Item ${index + 1}: Unit price is required`);
      } else if (typeof item.unitPrice !== 'number' || item.unitPrice <= 0) {
        errors.push(`Item ${index + 1}: Unit price must be a positive number`);
      }
      
      if (!item.currency || typeof item.currency !== 'string') {
        errors.push(`Item ${index + 1}: Currency is required`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateInvoiceStatusForIssue(currentStatus: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Module 7 (Invoice) only allows issuing Draft invoices
    const validIssueStatuses = ['draft'];
    
    if (!validIssueStatuses.includes(currentStatus.toLowerCase())) {
      errors.push('Only Draft invoices can be issued');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateInvoiceStatusForCancel(currentStatus: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Module 7 (Invoice) only allows cancelling Draft invoices
    const validCancelStatuses = ['draft'];
    
    if (!validCancelStatuses.includes(currentStatus.toLowerCase())) {
      errors.push('Only Draft invoices can be cancelled');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateInvoiceStatusForEdit(currentStatus: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Module 7 (Invoice) only allows editing Draft invoices
    const validEditStatuses = ['draft'];
    
    if (!validEditStatuses.includes(currentStatus.toLowerCase())) {
      errors.push('Only Draft invoices can be edited');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateStatusTransition(currentStatus: string, targetStatus: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Module 7 (Invoice) allowed transitions
    const allowedTransitions: Record<string, string[]> = {
      draft: ['issued', 'cancelled'],
      issued: [], // Immutable
      cancelled: [], // Terminal
    };
    
    // Blocked statuses (future modules)
    const blockedStatuses = ['viewed', 'partial', 'paid', 'overdue', 'void', 'written_off'];
    
    if (blockedStatuses.includes(targetStatus.toLowerCase())) {
      errors.push(`Transition to ${targetStatus} is not allowed in Module 7`);
      return { isValid: false, errors };
    }
    
    const current = currentStatus.toLowerCase();
    const target = targetStatus.toLowerCase();
    
    if (!allowedTransitions[current] || !allowedTransitions[current].includes(target)) {
      errors.push(`Invalid status transition from ${currentStatus} to ${targetStatus}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateOrderForInvoiceGeneration(orderStatus: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Invoice can only be generated from Confirmed orders
    const validOrderStatuses = ['confirmed'];
    
    if (!validOrderStatuses.includes(orderStatus.toLowerCase())) {
      errors.push('Invoice can only be generated from Confirmed orders');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateDocumentSnapshot(documentSnapshot: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!documentSnapshot || typeof documentSnapshot !== 'object') {
      errors.push('Document snapshot is required and must be an object');
      return { isValid: false, errors };
    }
    
    // Validate customer snapshot
    if (!documentSnapshot.customer) {
      errors.push('Document snapshot must contain customer information');
    }
    
    // Validate order snapshot
    if (!documentSnapshot.order) {
      errors.push('Document snapshot must contain order information');
    }
    
    // Validate items
    if (!documentSnapshot.items || !Array.isArray(documentSnapshot.items)) {
      errors.push('Document snapshot must contain items array');
    } else if (documentSnapshot.items.length === 0) {
      errors.push('Document snapshot must contain at least one item');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validatePagination(skip?: any, take?: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (skip !== undefined) {
      if (typeof skip !== 'number' || Number.isNaN(skip) || skip < 0) {
        errors.push('Skip must be a non-negative number');
      }
    }
    
    if (take !== undefined) {
      if (typeof take !== 'number' || Number.isNaN(take) || take <= 0) {
        errors.push('Take must be a positive number');
      }
      if (take > 100) {
        errors.push('Take cannot exceed 100');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
