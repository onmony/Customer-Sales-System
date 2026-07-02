export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class PricingValidator {
  static validatePrice(price?: number): ValidationResult {
    const errors: string[] = [];

    if (price === undefined || price === null) {
      errors.push('Price is required');
    } else if (typeof price !== 'number' || isNaN(price)) {
      errors.push('Price must be a valid number');
    } else if (price <= 0) {
      errors.push('Price must be greater than 0');
    } else if (price > 999999999.99) {
      errors.push('Price cannot exceed 999,999,999.99');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateCurrency(currency?: string): ValidationResult {
    const errors: string[] = [];

    if (!currency || currency.trim().length === 0) {
      errors.push('Currency is required');
    } else if (currency.length !== 3) {
      errors.push('Currency must be a 3-letter ISO code');
    } else if (!/^[A-Z]{3}$/.test(currency)) {
      errors.push('Currency must be uppercase letters only');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateEffectiveDate(effectiveDate?: Date | string): ValidationResult {
    const errors: string[] = [];

    if (!effectiveDate) {
      errors.push('Effective date is required');
      return { isValid: false, errors };
    }

    const date = typeof effectiveDate === 'string' ? new Date(effectiveDate) : effectiveDate;

    if (isNaN(date.getTime())) {
      errors.push('Effective date must be a valid date');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateExpiryDate(effectiveDate: Date | string, expiryDate?: Date | string): ValidationResult {
    const errors: string[] = [];

    if (!expiryDate) {
      return { isValid: true, errors: [] };
    }

    const effective = typeof effectiveDate === 'string' ? new Date(effectiveDate) : effectiveDate;
    const expiry = typeof expiryDate === 'string' ? new Date(expiryDate) : expiryDate;

    if (isNaN(expiry.getTime())) {
      errors.push('Expiry date must be a valid date');
    } else if (expiry <= effective) {
      errors.push('Expiry date must be after effective date');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateCustomerId(customerId?: string): ValidationResult {
    const errors: string[] = [];

    if (!customerId || customerId.trim().length === 0) {
      errors.push('Customer ID is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateProductId(productId?: string): ValidationResult {
    const errors: string[] = [];

    if (!productId || productId.trim().length === 0) {
      errors.push('Product ID is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateTenantId(tenantId?: string): ValidationResult {
    const errors: string[] = [];

    if (!tenantId || tenantId.trim().length === 0) {
      errors.push('Tenant ID is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateStatusId(statusId?: string): ValidationResult {
    const errors: string[] = [];

    if (!statusId || statusId.trim().length === 0) {
      errors.push('Status ID is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateVersion(version?: number): ValidationResult {
    const errors: string[] = [];

    if (version === undefined || version === null) {
      errors.push('Version is required');
    } else if (typeof version !== 'number' || isNaN(version)) {
      errors.push('Version must be a valid number');
    } else if (version < 1) {
      errors.push('Version must be at least 1');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validatePagination(skip?: number, take?: number): ValidationResult {
    const errors: string[] = [];

    if (skip !== undefined) {
      if (typeof skip !== 'number' || isNaN(skip)) {
        errors.push('Skip must be a valid number');
      } else if (skip < 0) {
        errors.push('Skip must be non-negative');
      }
    }

    if (take !== undefined) {
      if (typeof take !== 'number' || isNaN(take)) {
        errors.push('Take must be a valid number');
      } else if (take < 0) {
        errors.push('Take must be non-negative');
      } else if (take > 100) {
        errors.push('Take cannot exceed 100');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
