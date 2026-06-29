"use strict";

const ERRORS = Object.freeze({
  MISSING_TENANT: "MISSING_TENANT_CONTEXT",
  CROSS_TENANT_ACCESS: "CROSS_TENANT_ACCESS",
  CUSTOMER_NOT_FOUND: "CUSTOMER_NOT_FOUND",
  REQUIRED_FIELD_POLICY_NOT_APPROVED: "REQUIRED_FIELD_POLICY_NOT_APPROVED",
  DUPLICATE_POLICY_NOT_APPROVED: "DUPLICATE_POLICY_NOT_APPROVED"
});

class CustomerError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "CustomerError";
    this.code = code;
  }
}

class CustomerRepository {
  constructor() {
    this.customers = new Map();
    this.nextId = 1;
  }

  create(customer) {
    const id = `cus_${this.nextId++}`;
    const now = new Date().toISOString();
    const record = Object.freeze({
      id,
      tenantId: customer.tenantId,
      displayName: customer.displayName,
      contacts: Object.freeze([...(customer.contacts || [])]),
      addresses: Object.freeze([...(customer.addresses || [])]),
      createdAt: now,
      updatedAt: now
    });

    this.customers.set(id, record);
    return record;
  }

  get(id) {
    return this.customers.get(id) || null;
  }

  update(id, patch) {
    const existing = this.get(id);
    if (!existing) {
      return null;
    }

    const updated = Object.freeze({
      ...existing,
      ...patch,
      id: existing.id,
      tenantId: existing.tenantId,
      contacts: Object.freeze([...(patch.contacts || existing.contacts)]),
      addresses: Object.freeze([...(patch.addresses || existing.addresses)]),
      updatedAt: new Date().toISOString()
    });

    this.customers.set(id, updated);
    return updated;
  }

  list() {
    return Array.from(this.customers.values());
  }
}

class CustomerService {
  constructor({ repository = new CustomerRepository(), policy = {} } = {}) {
    this.repository = repository;
    this.policy = {
      requiredFieldsApproved: false,
      duplicatePolicyApproved: false,
      ...policy
    };
  }

  createCustomer(context, input) {
    const tenantId = requireTenant(context);

    if (!this.policy.requiredFieldsApproved) {
      throw new CustomerError(
        ERRORS.REQUIRED_FIELD_POLICY_NOT_APPROVED,
        "Customer required fields are not approved."
      );
    }

    const possibleDuplicate = this.findPossibleDuplicate(tenantId, input.displayName);
    if (possibleDuplicate && !this.policy.duplicatePolicyApproved) {
      throw new CustomerError(
        ERRORS.DUPLICATE_POLICY_NOT_APPROVED,
        "Duplicate customer behavior is not approved."
      );
    }

    return this.repository.create({
      tenantId,
      displayName: String(input.displayName || "").trim(),
      contacts: input.contacts || [],
      addresses: input.addresses || []
    });
  }

  searchCustomers(context, query = "") {
    const tenantId = requireTenant(context);
    const normalizedQuery = normalize(query);

    return this.repository
      .list()
      .filter((customer) => customer.tenantId === tenantId)
      .filter((customer) => normalize(customer.displayName).includes(normalizedQuery));
  }

  getCustomer(context, customerId) {
    const tenantId = requireTenant(context);
    const customer = this.repository.get(customerId);

    if (!customer) {
      throw new CustomerError(ERRORS.CUSTOMER_NOT_FOUND, "Customer was not found.");
    }

    assertTenant(customer, tenantId);
    return customer;
  }

  selectCustomerForOrder(context, customerId) {
    const customer = this.getCustomer(context, customerId);
    return Object.freeze({
      customer,
      canStartOrder: true
    });
  }

  updateCustomer(context, customerId, patch) {
    const current = this.getCustomer(context, customerId);
    const updated = this.repository.update(current.id, {
      displayName: patch.displayName === undefined ? current.displayName : String(patch.displayName).trim(),
      contacts: patch.contacts === undefined ? current.contacts : patch.contacts,
      addresses: patch.addresses === undefined ? current.addresses : patch.addresses
    });

    return updated;
  }

  createSnapshot(context, customerId) {
    const customer = this.getCustomer(context, customerId);
    return deepFreeze({
      customerId: customer.id,
      tenantId: customer.tenantId,
      displayName: customer.displayName,
      contacts: customer.contacts.map((contact) => ({ ...contact })),
      addresses: customer.addresses.map((address) => ({ ...address }))
    });
  }

  findPossibleDuplicate(tenantId, displayName) {
    const normalizedName = normalize(displayName);
    if (!normalizedName) {
      return null;
    }

    return (
      this.repository
        .list()
        .find((customer) => customer.tenantId === tenantId && normalize(customer.displayName) === normalizedName) ||
      null
    );
  }
}

function requireTenant(context) {
  if (!context || !context.tenantId) {
    throw new CustomerError(ERRORS.MISSING_TENANT, "Tenant context is required.");
  }

  return context.tenantId;
}

function assertTenant(record, tenantId) {
  if (record.tenantId !== tenantId) {
    throw new CustomerError(ERRORS.CROSS_TENANT_ACCESS, "Cross-tenant customer access is forbidden.");
  }
}

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    Object.values(value).forEach(deepFreeze);
  }

  return value;
}

module.exports = {
  CustomerError,
  CustomerRepository,
  CustomerService,
  ERRORS
};
