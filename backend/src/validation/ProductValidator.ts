export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ProductValidator {
  static validateDisplayName(displayName?: string): ValidationResult {
    const errors: string[] = [];

    if (!displayName || displayName.trim().length === 0) {
      errors.push('Display name is required');
    } else if (displayName.length > 255) {
      errors.push('Display name must be at most 255 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateSku(sku?: string): ValidationResult {
    const errors: string[] = [];

    if (sku !== undefined && sku !== null) {
      if (sku.trim().length === 0) {
        errors.push('SKU cannot be empty if provided');
      } else if (sku.length > 100) {
        errors.push('SKU must be at most 100 characters');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateUnit(unit?: string): ValidationResult {
    const errors: string[] = [];

    if (!unit || unit.trim().length === 0) {
      errors.push('Unit is required');
    } else if (unit.length > 50) {
      errors.push('Unit must be at most 50 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateIsActive(isActive?: boolean): ValidationResult {
    const errors: string[] = [];

    if (isActive !== undefined && typeof isActive !== 'boolean') {
      errors.push('isActive must be a boolean');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateSearchQuery(query?: string): ValidationResult {
    const errors: string[] = [];

    if (!query || query.trim().length === 0) {
      errors.push('Search query is required');
    } else if (query.length < 2) {
      errors.push('Search query must be at least 2 characters');
    } else if (query.length > 100) {
      errors.push('Search query must be at most 100 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validatePagination(skip?: number, take?: number): ValidationResult {
    const errors: string[] = [];

    if (skip !== undefined) {
      if (typeof skip !== 'number' || skip < 0) {
        errors.push('Skip must be a non-negative number');
      }
    }

    if (take !== undefined) {
      if (typeof take !== 'number' || take < 0) {
        errors.push('Take must be a non-negative number');
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
