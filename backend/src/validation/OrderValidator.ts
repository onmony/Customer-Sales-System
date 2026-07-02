export class OrderValidator {
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

  static validateOrderNumber(orderNumber: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!orderNumber || typeof orderNumber !== 'string') {
      errors.push('Order number is required and must be a string');
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

  static validateOrderItems(items: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!Array.isArray(items)) {
      errors.push('Order items must be an array');
      return { isValid: false, errors };
    }
    
    if (items.length === 0) {
      errors.push('Order must have at least one item');
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
    });
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateOrderStatusForEdit(currentStatus: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Module 6 (Order) only allows editing Draft orders
    const validEditStatuses = ['draft'];
    
    if (!validEditStatuses.includes(currentStatus.toLowerCase())) {
      errors.push('Only Draft orders can be edited');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateOrderStatusForConfirm(currentStatus: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Module 6 (Order) only allows confirming Draft orders
    const validConfirmStatuses = ['draft'];
    
    if (!validConfirmStatuses.includes(currentStatus.toLowerCase())) {
      errors.push('Only Draft orders can be confirmed');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateOrderStatusForCancel(currentStatus: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Module 6 (Order) only allows cancelling Draft orders
    const validCancelStatuses = ['draft'];
    
    if (!validCancelStatuses.includes(currentStatus.toLowerCase())) {
      errors.push('Only Draft orders can be cancelled');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateStatusTransition(currentStatus: string, targetStatus: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Module 6 (Order) allowed transitions
    const allowedTransitions: Record<string, string[]> = {
      draft: ['confirmed', 'cancelled'],
      confirmed: [], // Immutable
      cancelled: [], // Terminal
    };
    
    // Blocked statuses (future modules)
    const blockedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'on_hold'];
    
    if (blockedStatuses.includes(targetStatus.toLowerCase())) {
      errors.push(`Transition to ${targetStatus} is not allowed in Module 6`);
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

  static validatePagination(skip?: any, take?: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (skip !== undefined) {
      if (typeof skip !== 'number' || skip < 0) {
        errors.push('Skip must be a non-negative number');
      }
    }
    
    if (take !== undefined) {
      if (typeof take !== 'number' || take <= 0) {
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
