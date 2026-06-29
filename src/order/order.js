"use strict";

const ERRORS = Object.freeze({
  MISSING_TENANT: "MISSING_TENANT_CONTEXT",
  CROSS_TENANT_ACCESS: "CROSS_TENANT_ACCESS",
  ORDER_NOT_FOUND: "ORDER_NOT_FOUND",
  CUSTOMER_REQUIRED: "CUSTOMER_REQUIRED",
  PRODUCT_REQUIRED: "PRODUCT_REQUIRED",
  QUANTITY_REQUIRED: "QUANTITY_REQUIRED",
  ITEMS_REQUIRED: "ITEMS_REQUIRED",
  PRICING_SNAPSHOT_REQUIRED: "PRICING_SNAPSHOT_REQUIRED",
  ORDER_ALREADY_SAVED: "ORDER_ALREADY_SAVED",
  LIFECYCLE_POLICY_NOT_APPROVED: "ORDER_LIFECYCLE_POLICY_NOT_APPROVED"
});

class OrderError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "OrderError";
    this.code = code;
  }
}

class OrderRepository {
  constructor() {
    this.orders = new Map();
    this.nextOrderId = 1;
    this.nextItemId = 1;
  }

  nextItemIdValue() {
    return `oit_${this.nextItemId++}`;
  }

  create(order) {
    const id = `ord_${this.nextOrderId++}`;
    const now = new Date().toISOString();
    const record = deepFreeze({
      id,
      tenantId: order.tenantId,
      customerId: order.customerId,
      customerSnapshot: clone(order.customerSnapshot),
      items: [],
      saved: false,
      createdAt: now,
      updatedAt: now,
      savedAt: null
    });

    this.orders.set(id, record);
    return record;
  }

  get(id) {
    return this.orders.get(id) || null;
  }

  replace(id, order) {
    const record = deepFreeze({
      ...order,
      updatedAt: new Date().toISOString()
    });
    this.orders.set(id, record);
    return record;
  }

  list() {
    return Array.from(this.orders.values());
  }
}

class OrderService {
  constructor({ repository = new OrderRepository(), policy = {} } = {}) {
    this.repository = repository;
    this.policy = {
      lifecyclePolicyApproved: false,
      ...policy
    };
  }

  createOrder(context, input) {
    const tenantId = requireTenant(context);
    const customer = requireTenantScopedEntity(input.customer, tenantId, ERRORS.CUSTOMER_REQUIRED, "Customer is required.");

    return this.repository.create({
      tenantId,
      customerId: customer.id,
      customerSnapshot: input.customerSnapshot || createCustomerSnapshot(customer)
    });
  }

  addOrderItem(context, orderId, input) {
    const tenantId = requireTenant(context);
    const order = this.getOrder(context, orderId);
    ensureEditable(order);

    const product = requireTenantScopedEntity(input.product, tenantId, ERRORS.PRODUCT_REQUIRED, "Product is required.");
    requireQuantity(input.quantity);

    const item = deepFreeze({
      id: this.repository.nextItemIdValue(),
      productId: product.id,
      productSnapshot: input.productSnapshot || createProductSnapshot(product),
      quantity: input.quantity,
      pricingSnapshot: input.pricingSnapshot ? clone(input.pricingSnapshot) : null
    });

    const updated = {
      ...order,
      items: [...order.items.map(clone), item]
    };

    return this.repository.replace(order.id, updated);
  }

  saveOrder(context, orderId) {
    const order = this.getOrder(context, orderId);
    ensureEditable(order);

    if (order.items.length === 0) {
      throw new OrderError(ERRORS.ITEMS_REQUIRED, "A saved order must contain at least one item.");
    }

    const missingPricing = order.items.some((item) => !item.pricingSnapshot);
    if (missingPricing) {
      throw new OrderError(
        ERRORS.PRICING_SNAPSHOT_REQUIRED,
        "Every saved order item must include a pricing snapshot."
      );
    }

    const saved = deepFreeze({
      ...order,
      items: order.items.map(clone),
      saved: true,
      savedAt: new Date().toISOString()
    });

    return this.repository.replace(order.id, saved);
  }

  getOrder(context, orderId) {
    const tenantId = requireTenant(context);
    const order = this.repository.get(orderId);

    if (!order) {
      throw new OrderError(ERRORS.ORDER_NOT_FOUND, "Order was not found.");
    }

    if (order.tenantId !== tenantId) {
      throw new OrderError(ERRORS.CROSS_TENANT_ACCESS, "Cross-tenant order access is forbidden.");
    }

    return order;
  }

  listOrders(context) {
    const tenantId = requireTenant(context);
    return this.repository.list().filter((order) => order.tenantId === tenantId);
  }

  checkInvoiceReadiness(context, orderId) {
    const order = this.getOrder(context, orderId);
    return Object.freeze({
      orderId: order.id,
      invoiceReady: order.saved && order.items.length > 0 && order.items.every((item) => item.pricingSnapshot)
    });
  }

  requestLifecycleAction() {
    if (!this.policy.lifecyclePolicyApproved) {
      throw new OrderError(
        ERRORS.LIFECYCLE_POLICY_NOT_APPROVED,
        "Draft, edit, status, locking, and cancellation behavior is not approved."
      );
    }

    return Object.freeze({ allowed: true });
  }
}

function requireTenant(context) {
  if (!context || !context.tenantId) {
    throw new OrderError(ERRORS.MISSING_TENANT, "Tenant context is required.");
  }

  return context.tenantId;
}

function requireTenantScopedEntity(entity, tenantId, missingCode, missingMessage) {
  if (!entity || !entity.id) {
    throw new OrderError(missingCode, missingMessage);
  }

  if (entity.tenantId !== tenantId) {
    throw new OrderError(ERRORS.CROSS_TENANT_ACCESS, "Cross-tenant source data access is forbidden.");
  }

  return entity;
}

function requireQuantity(quantity) {
  if (quantity === undefined || quantity === null) {
    throw new OrderError(ERRORS.QUANTITY_REQUIRED, "Quantity is required.");
  }

  return quantity;
}

function ensureEditable(order) {
  if (order.saved) {
    throw new OrderError(ERRORS.ORDER_ALREADY_SAVED, "Saved order edit behavior is not approved.");
  }
}

function createCustomerSnapshot(customer) {
  return {
    customerId: customer.id,
    tenantId: customer.tenantId,
    displayName: customer.displayName
  };
}

function createProductSnapshot(product) {
  return {
    productId: product.id,
    tenantId: product.tenantId,
    displayName: product.displayName,
    unit: product.unit || null
  };
}

function clone(value) {
  return value === undefined ? value : JSON.parse(JSON.stringify(value));
}

function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    Object.values(value).forEach(deepFreeze);
  }

  return value;
}

module.exports = {
  OrderError,
  OrderRepository,
  OrderService,
  ERRORS
};
