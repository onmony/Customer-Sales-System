export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class CustomerValidator {
  static validateDisplayName(displayName: string): ValidationResult {
    const errors: string[] = [];

    if (!displayName || displayName.trim().length === 0) {
      errors.push('Customer display name is required');
    } else if (displayName.trim().length > 255) {
      errors.push('Customer display name cannot exceed 255 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateGstNumber(gstNumber?: string): ValidationResult {
    const errors: string[] = [];

    if (gstNumber && gstNumber.trim().length > 0) {
      if (gstNumber.length !== 15) {
        errors.push('GST number must be 15 characters');
      }
      // Basic GST format validation (2 letters, 14 characters)
      const gstPattern = /^[0-9A-Z]{15}$/;
      if (!gstPattern.test(gstNumber)) {
        errors.push('GST number must contain only alphanumeric characters');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateCreditLimit(creditLimit?: number): ValidationResult {
    const errors: string[] = [];

    if (creditLimit !== undefined && creditLimit !== null) {
      if (creditLimit < 0) {
        errors.push('Credit limit cannot be negative');
      }
      if (creditLimit > 999999999999.99) {
        errors.push('Credit limit exceeds maximum allowed value');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateStatusId(statusId: string): ValidationResult {
    const errors: string[] = [];

    if (!statusId || statusId.trim().length === 0) {
      errors.push('Customer status ID is required');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateSearchQuery(query: string): ValidationResult {
    const errors: string[] = [];

    if (!query || query.trim().length === 0) {
      errors.push('Search query is required');
    } else if (query.trim().length < 2) {
      errors.push('Search query must be at least 2 characters');
    } else if (query.trim().length > 100) {
      errors.push('Search query cannot exceed 100 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validatePagination(skip?: number, take?: number): ValidationResult {
    const errors: string[] = [];

    if (skip !== undefined && skip < 0) {
      errors.push('Skip value cannot be negative');
    }

    if (take !== undefined) {
      if (take < 0) {
        errors.push('Take value cannot be negative');
      }
      if (take > 100) {
        errors.push('Take value cannot exceed 100');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
