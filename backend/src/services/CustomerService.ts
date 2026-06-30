import { CustomerRepository } from '../repositories/CustomerRepository';
import { Prisma } from '@prisma/client';

export interface CreateCustomerInput {
  tenantId: string;
  displayName: string;
  gstNumber?: string;
  creditLimit?: number;
  statusId: string;
  createdBy?: string;
}

export interface UpdateCustomerInput {
  displayName?: string;
  gstNumber?: string;
  creditLimit?: number;
  statusId?: string;
  updatedBy?: string;
}

export interface SearchCustomersInput {
  tenantId: string;
  query: string;
  skip?: number;
  take?: number;
}

export class CustomerService {
  constructor(private customerRepository: CustomerRepository) {}

  async createCustomer(input: CreateCustomerInput) {
    // CUS-001: New customers start in Active state
    // Validate required fields
    if (!input.displayName || input.displayName.trim().length === 0) {
      throw new Error('Customer display name is required');
    }

    // Validate GST number format if provided (basic validation)
    if (input.gstNumber && input.gstNumber.trim().length > 0) {
      // Basic GST validation - should be 15 characters for India GST
      if (input.gstNumber.length !== 15) {
        throw new Error('GST number must be 15 characters');
      }
    }

    // Check for duplicate GST number within tenant
    if (input.gstNumber) {
      const existing = await this.customerRepository.findByGstNumber(input.tenantId, input.gstNumber);
      if (existing) {
        throw new Error('Customer with this GST number already exists');
      }
    }

    // Validate credit limit
    if (input.creditLimit !== undefined && input.creditLimit < 0) {
      throw new Error('Credit limit cannot be negative');
    }

    const customerData: Prisma.CustomerCreateInput = {
      tenant: {
        connect: {
          id: input.tenantId,
        },
      },
      displayName: input.displayName.trim(),
      gstNumber: input.gstNumber?.trim() || null,
      creditLimit: input.creditLimit || 0,
      status: {
        connect: {
          id: input.statusId,
        },
      },
      createdBy: input.createdBy,
    };

    return this.customerRepository.create(customerData);
  }

  async updateCustomer(id: string, input: UpdateCustomerInput) {
    // Validate customer exists
    const existing = await this.customerRepository.findById(id);
    if (!existing) {
      throw new Error('Customer not found');
    }

    // Validate customer is not deleted
    if (existing.deletedAt) {
      throw new Error('Cannot update archived customer');
    }

    // Validate display name if provided
    if (input.displayName !== undefined) {
      if (input.displayName.trim().length === 0) {
        throw new Error('Customer display name cannot be empty');
      }
      input.displayName = input.displayName.trim();
    }

    // Validate GST number if provided
    if (input.gstNumber !== undefined) {
      if (input.gstNumber.trim().length > 0) {
        if (input.gstNumber.length !== 15) {
          throw new Error('GST number must be 15 characters');
        }
        // Check for duplicate GST number within tenant (excluding current customer)
        const duplicate = await this.customerRepository.findByGstNumber(existing.tenantId, input.gstNumber);
        if (duplicate && duplicate.id !== id) {
          throw new Error('Customer with this GST number already exists');
        }
      }
      input.gstNumber = input.gstNumber.trim() || undefined;
    }

    // Validate credit limit if provided
    if (input.creditLimit !== undefined && input.creditLimit < 0) {
      throw new Error('Credit limit cannot be negative');
    }

    // Status transition validation (basic validation without order/balance checks)
    if (input.statusId && input.statusId !== existing.statusId) {
      await this.validateStatusTransition(existing.statusId, input.statusId);
    }

    const updateData: Prisma.CustomerUpdateInput = {
      ...(input.displayName !== undefined && { displayName: input.displayName }),
      ...(input.gstNumber !== undefined && { gstNumber: input.gstNumber }),
      ...(input.creditLimit !== undefined && { creditLimit: input.creditLimit }),
      ...(input.statusId !== undefined && { statusId: input.statusId }),
      ...(input.updatedBy !== undefined && { updatedBy: input.updatedBy }),
    };

    return this.customerRepository.update(id, updateData);
  }

  async archiveCustomer(id: string, _archivedBy?: string) {
    // Validate customer exists
    const existing = await this.customerRepository.findById(id);
    if (!existing) {
      throw new Error('Customer not found');
    }

    // Validate customer is not already archived
    if (existing.deletedAt) {
      throw new Error('Customer is already archived');
    }

    // Soft delete the customer
    // archivedBy is not used in soft delete but kept for future audit trail
    return this.customerRepository.softDelete(id);
  }

  async getCustomer(id: string) {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new Error('Customer not found');
    }
    return customer;
  }

  async listCustomers(tenantId: string, params?: { skip?: number; take?: number }) {
    return this.customerRepository.findByTenantId(tenantId, params);
  }

  async searchCustomers(input: SearchCustomersInput) {
    if (!input.query || input.query.trim().length === 0) {
      throw new Error('Search query is required');
    }

    return this.customerRepository.search(input.tenantId, input.query.trim(), {
      skip: input.skip,
      take: input.take,
    });
  }

  async getCustomersByStatus(tenantId: string, statusId: string, params?: { skip?: number; take?: number }) {
    return this.customerRepository.findByStatus(tenantId, statusId, params);
  }

  private async validateStatusTransition(_currentStatusId: string, _newStatusId: string) {
    // Basic status transition validation
    // Full business rule validation (CUS-002 to CUS-009) requires order/balance checks which are out of scope for Module 3
    
    // For now, allow all transitions except to/from 'blocked' if not active
    // This is a simplified version - full implementation will check orders and balances
    
    // TODO: Implement full status transition validation when Orders and Invoices modules are available
    // CUS-002: Active → Inactive (requires no pending orders or outstanding balance)
    // CUS-003: Active → Blocked (requires credit limit exceeded or payment overdue)
    // CUS-004: Inactive → Active (requires contact verification)
    // CUS-005: Blocked → Active (requires credit limit restored or payment received)
    // CUS-009: Inactive → Blocked (not allowed - must reactivate first)
  }
}
