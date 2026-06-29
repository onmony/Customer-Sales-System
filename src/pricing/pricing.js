"use strict";

const ERRORS = Object.freeze({
  MISSING_TENANT: "MISSING_TENANT_CONTEXT",
  CROSS_TENANT_ACCESS: "CROSS_TENANT_ACCESS",
  CUSTOMER_REQUIRED: "CUSTOMER_REQUIRED",
  PRODUCT_REQUIRED: "PRODUCT_REQUIRED",
  PRICE_NOT_FOUND: "CUSTOMER_PRICE_NOT_FOUND",
  MISSING_PRICE_POLICY_NOT_APPROVED: "MISSING_PRICE_POLICY_NOT_APPROVED",
  PRICE_REQUIRED: "PRICE_REQUIRED",
  PRICING_VERSION_REQUIRED: "PRICING_VERSION_REQUIRED"
});

class PricingError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "PricingError";
    this.code = code;
  }
}

class PricingRepository {
  constructor() {
    this.versions = new Map();
    this.nextId = 1;
  }

  createVersion(version) {
    const id = `prv_${this.nextId++}`;
    const record = Object.freeze({
      id,
      tenantId: version.tenantId,
      customerId: version.customerId,
      productId: version.productId,
      price: version.price,
      versionNumber: this.listForPair(version.tenantId, version.customerId, version.productId).length + 1,
      createdAt: new Date().toISOString()
    });

    this.versions.set(id, record);
    return record;
  }

  list() {
    return Array.from(this.versions.values());
  }

  listForPair(tenantId, customerId, productId) {
    return this.list()
      .filter(
        (version) =>
          version.tenantId === tenantId && version.customerId === customerId && version.productId === productId
      )
      .sort((a, b) => a.versionNumber - b.versionNumber);
  }

  getCurrent(tenantId, customerId, productId) {
    const versions = this.listForPair(tenantId, customerId, productId);
    return versions.at(-1) || null;
  }

  getVersion(versionId) {
    return this.versions.get(versionId) || null;
  }
}

class PricingService {
  constructor({ repository = new PricingRepository(), policy = {} } = {}) {
    this.repository = repository;
    this.policy = {
      missingPricePolicyApproved: false,
      ...policy
    };
  }

  createCustomerPrice(context, input) {
    const tenantId = requireTenant(context);
    const customerId = requireCustomer(input.customerId);
    const productId = requireProduct(input.productId);
    const price = requirePrice(input.price);

    return this.repository.createVersion({ tenantId, customerId, productId, price });
  }

  changeCustomerPrice(context, input) {
    const tenantId = requireTenant(context);
    const customerId = requireCustomer(input.customerId);
    const productId = requireProduct(input.productId);
    const price = requirePrice(input.price);
    const current = this.repository.getCurrent(tenantId, customerId, productId);

    if (current && current.price === price) {
      return Object.freeze({
        changed: false,
        currentVersion: current
      });
    }

    const newVersion = this.repository.createVersion({ tenantId, customerId, productId, price });
    return Object.freeze({
      changed: true,
      previousVersion: current,
      currentVersion: newVersion
    });
  }

  resolveOrderItemPrice(context, input) {
    const tenantId = requireTenant(context);
    const customerId = requireCustomer(input.customerId);
    const productId = requireProduct(input.productId);
    const current = this.repository.getCurrent(tenantId, customerId, productId);

    if (!current) {
      throw new PricingError(
        ERRORS.MISSING_PRICE_POLICY_NOT_APPROVED,
        "Missing customer-specific price behavior is not approved."
      );
    }

    return Object.freeze({
      tenantId,
      customerId,
      productId,
      price: current.price,
      pricingVersionId: current.id,
      versionNumber: current.versionNumber
    });
  }

  listCustomerPriceHistory(context, input) {
    const tenantId = requireTenant(context);
    const customerId = requireCustomer(input.customerId);
    const productId = requireProduct(input.productId);

    return this.repository.listForPair(tenantId, customerId, productId);
  }

  createOrderItemPricingSnapshot(context, resolution) {
    const tenantId = requireTenant(context);

    if (!resolution || resolution.tenantId !== tenantId) {
      throw new PricingError(ERRORS.CROSS_TENANT_ACCESS, "Cross-tenant pricing snapshot access is forbidden.");
    }

    requireCustomer(resolution.customerId);
    requireProduct(resolution.productId);

    if (resolution.price === undefined || resolution.price === null) {
      throw new PricingError(ERRORS.PRICE_REQUIRED, "Resolved price is required for a pricing snapshot.");
    }

    if (!resolution.pricingVersionId) {
      throw new PricingError(
        ERRORS.PRICING_VERSION_REQUIRED,
        "Pricing version traceability is required for a pricing snapshot."
      );
    }

    return deepFreeze({
      tenantId,
      customerId: resolution.customerId,
      productId: resolution.productId,
      price: resolution.price,
      pricingVersionId: resolution.pricingVersionId,
      versionNumber: resolution.versionNumber
    });
  }

  getPricingVersion(context, versionId) {
    const tenantId = requireTenant(context);
    const version = this.repository.getVersion(versionId);

    if (!version) {
      throw new PricingError(ERRORS.PRICE_NOT_FOUND, "Pricing version was not found.");
    }

    if (version.tenantId !== tenantId) {
      throw new PricingError(ERRORS.CROSS_TENANT_ACCESS, "Cross-tenant pricing access is forbidden.");
    }

    return version;
  }
}

function requireTenant(context) {
  if (!context || !context.tenantId) {
    throw new PricingError(ERRORS.MISSING_TENANT, "Tenant context is required.");
  }

  return context.tenantId;
}

function requireCustomer(customerId) {
  if (!customerId) {
    throw new PricingError(ERRORS.CUSTOMER_REQUIRED, "Customer is required for pricing.");
  }

  return customerId;
}

function requireProduct(productId) {
  if (!productId) {
    throw new PricingError(ERRORS.PRODUCT_REQUIRED, "Product is required for pricing.");
  }

  return productId;
}

function requirePrice(price) {
  if (price === undefined || price === null) {
    throw new PricingError(ERRORS.PRICE_REQUIRED, "Price is required.");
  }

  return price;
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    Object.values(value).forEach(deepFreeze);
  }

  return value;
}

module.exports = {
  PricingError,
  PricingRepository,
  PricingService,
  ERRORS
};
