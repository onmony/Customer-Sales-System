"use strict";

const ERRORS = Object.freeze({
  MISSING_TENANT: "MISSING_TENANT_CONTEXT",
  CROSS_TENANT_ACCESS: "CROSS_TENANT_ACCESS",
  PRODUCT_NOT_FOUND: "PRODUCT_NOT_FOUND",
  REQUIRED_FIELD_POLICY_NOT_APPROVED: "REQUIRED_FIELD_POLICY_NOT_APPROVED",
  DUPLICATE_POLICY_NOT_APPROVED: "DUPLICATE_POLICY_NOT_APPROVED",
  UNIT_POLICY_NOT_APPROVED: "UNIT_POLICY_NOT_APPROVED",
  INACTIVE_PRODUCT_POLICY_NOT_APPROVED: "INACTIVE_PRODUCT_POLICY_NOT_APPROVED"
});

class ProductError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "ProductError";
    this.code = code;
  }
}

class ProductRepository {
  constructor() {
    this.products = new Map();
    this.nextId = 1;
  }

  create(product) {
    const id = `pro_${this.nextId++}`;
    const now = new Date().toISOString();
    const record = Object.freeze({
      id,
      tenantId: product.tenantId,
      displayName: product.displayName,
      unit: product.unit || null,
      active: product.active !== false,
      createdAt: now,
      updatedAt: now
    });

    this.products.set(id, record);
    return record;
  }

  get(id) {
    return this.products.get(id) || null;
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
      updatedAt: new Date().toISOString()
    });

    this.products.set(id, updated);
    return updated;
  }

  list() {
    return Array.from(this.products.values());
  }
}

class ProductService {
  constructor({ repository = new ProductRepository(), policy = {} } = {}) {
    this.repository = repository;
    this.policy = {
      requiredFieldsApproved: false,
      duplicatePolicyApproved: false,
      unitPolicyApproved: false,
      inactiveProductPolicyApproved: false,
      ...policy
    };
  }

  createProduct(context, input) {
    const tenantId = requireTenant(context);

    if (!this.policy.requiredFieldsApproved) {
      throw new ProductError(
        ERRORS.REQUIRED_FIELD_POLICY_NOT_APPROVED,
        "Product required fields are not approved."
      );
    }

    if (input.unit !== undefined && !this.policy.unitPolicyApproved) {
      throw new ProductError(ERRORS.UNIT_POLICY_NOT_APPROVED, "Product unit behavior is not approved.");
    }

    const possibleDuplicate = this.findPossibleDuplicate(tenantId, input.displayName);
    if (possibleDuplicate && !this.policy.duplicatePolicyApproved) {
      throw new ProductError(ERRORS.DUPLICATE_POLICY_NOT_APPROVED, "Duplicate product behavior is not approved.");
    }

    return this.repository.create({
      tenantId,
      displayName: String(input.displayName || "").trim(),
      unit: input.unit,
      active: input.active
    });
  }

  searchProducts(context, query = "") {
    const tenantId = requireTenant(context);
    const normalizedQuery = normalize(query);

    return this.repository
      .list()
      .filter((product) => product.tenantId === tenantId)
      .filter((product) => normalize(product.displayName).includes(normalizedQuery));
  }

  getProduct(context, productId) {
    const tenantId = requireTenant(context);
    const product = this.repository.get(productId);

    if (!product) {
      throw new ProductError(ERRORS.PRODUCT_NOT_FOUND, "Product was not found.");
    }

    assertTenant(product, tenantId);
    return product;
  }

  selectProductForOrder(context, productId) {
    const product = this.getProduct(context, productId);

    if (!product.active && !this.policy.inactiveProductPolicyApproved) {
      throw new ProductError(
        ERRORS.INACTIVE_PRODUCT_POLICY_NOT_APPROVED,
        "Inactive product behavior is not approved."
      );
    }

    return Object.freeze({
      product,
      canCreateOrderItem: true
    });
  }

  updateProduct(context, productId, patch) {
    const current = this.getProduct(context, productId);

    if (patch.unit !== undefined && !this.policy.unitPolicyApproved) {
      throw new ProductError(ERRORS.UNIT_POLICY_NOT_APPROVED, "Product unit behavior is not approved.");
    }

    return this.repository.update(current.id, {
      displayName: patch.displayName === undefined ? current.displayName : String(patch.displayName).trim(),
      unit: patch.unit === undefined ? current.unit : patch.unit,
      active: patch.active === undefined ? current.active : patch.active
    });
  }

  createSnapshot(context, productId) {
    const product = this.getProduct(context, productId);
    return deepFreeze({
      productId: product.id,
      tenantId: product.tenantId,
      displayName: product.displayName,
      unit: product.unit,
      active: product.active
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
        .find((product) => product.tenantId === tenantId && normalize(product.displayName) === normalizedName) ||
      null
    );
  }
}

function requireTenant(context) {
  if (!context || !context.tenantId) {
    throw new ProductError(ERRORS.MISSING_TENANT, "Tenant context is required.");
  }

  return context.tenantId;
}

function assertTenant(record, tenantId) {
  if (record.tenantId !== tenantId) {
    throw new ProductError(ERRORS.CROSS_TENANT_ACCESS, "Cross-tenant product access is forbidden.");
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
  ProductError,
  ProductRepository,
  ProductService,
  ERRORS
};
