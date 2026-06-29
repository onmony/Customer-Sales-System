"use strict";

const ERRORS = Object.freeze({
  MISSING_TENANT: "MISSING_TENANT_CONTEXT",
  CROSS_TENANT_ACCESS: "CROSS_TENANT_ACCESS",
  SOURCE_ORDER_REQUIRED: "SOURCE_ORDER_REQUIRED",
  SOURCE_ORDER_NOT_SAVED: "SOURCE_ORDER_NOT_SAVED",
  SOURCE_ORDER_NOT_INVOICE_READY: "SOURCE_ORDER_NOT_INVOICE_READY",
  INVOICE_NOT_FOUND: "INVOICE_NOT_FOUND",
  INVOICE_ITEMS_REQUIRED: "INVOICE_ITEMS_REQUIRED",
  INVOICE_SNAPSHOTS_REQUIRED: "INVOICE_SNAPSHOTS_REQUIRED",
  ISSUED_INVOICE_IMMUTABLE: "ISSUED_INVOICE_IMMUTABLE",
  LIFECYCLE_POLICY_NOT_APPROVED: "INVOICE_LIFECYCLE_POLICY_NOT_APPROVED"
});

class InvoiceError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "InvoiceError";
    this.code = code;
  }
}

class InvoiceRepository {
  constructor() {
    this.invoices = new Map();
    this.nextInvoiceId = 1;
    this.nextItemId = 1;
  }

  nextItemIdValue() {
    return `iiv_${this.nextItemId++}`;
  }

  create(invoice) {
    const id = `inv_${this.nextInvoiceId++}`;
    const now = new Date().toISOString();
    const record = deepFreeze({
      id,
      tenantId: invoice.tenantId,
      sourceOrderId: invoice.sourceOrderId,
      customerSnapshot: clone(invoice.customerSnapshot),
      items: invoice.items.map((item) => ({
        ...item,
        id: this.nextItemIdValue()
      })),
      issued: false,
      immutable: false,
      createdAt: now,
      updatedAt: now,
      issuedAt: null
    });

    this.invoices.set(id, record);
    return record;
  }

  get(id) {
    return this.invoices.get(id) || null;
  }

  replace(id, invoice) {
    const record = deepFreeze({
      ...invoice,
      updatedAt: new Date().toISOString()
    });
    this.invoices.set(id, record);
    return record;
  }

  list() {
    return Array.from(this.invoices.values());
  }
}

class InvoiceService {
  constructor({ repository = new InvoiceRepository(), policy = {} } = {}) {
    this.repository = repository;
    this.policy = {
      lifecyclePolicyApproved: false,
      ...policy
    };
  }

  createInvoiceFromOrder(context, input) {
    const tenantId = requireTenant(context);
    const order = requireSourceOrder(input && input.order);

    if (order.tenantId !== tenantId) {
      throw new InvoiceError(ERRORS.CROSS_TENANT_ACCESS, "Cross-tenant source order access is forbidden.");
    }

    if (!order.saved) {
      throw new InvoiceError(ERRORS.SOURCE_ORDER_NOT_SAVED, "Source order must be saved before invoicing.");
    }

    if (!isInvoiceReady(order)) {
      throw new InvoiceError(
        ERRORS.SOURCE_ORDER_NOT_INVOICE_READY,
        "Source order must be invoice-ready before invoicing."
      );
    }

    const items = order.items.map((orderItem) => ({
      sourceOrderItemId: orderItem.id,
      productSnapshot: clone(orderItem.productSnapshot),
      quantity: orderItem.quantity,
      pricingSnapshot: clone(orderItem.pricingSnapshot)
    }));

    return this.repository.create({
      tenantId,
      sourceOrderId: order.id,
      customerSnapshot: clone(order.customerSnapshot),
      items
    });
  }

  issueInvoice(context, invoiceId) {
    const invoice = this.getInvoice(context, invoiceId);

    if (invoice.items.length === 0) {
      throw new InvoiceError(ERRORS.INVOICE_ITEMS_REQUIRED, "Invoice requires invoice items before issue.");
    }

    if (!invoice.items.every(hasRequiredSnapshots)) {
      throw new InvoiceError(ERRORS.INVOICE_SNAPSHOTS_REQUIRED, "Invoice requires snapshots before issue.");
    }

    return this.repository.replace(invoice.id, {
      ...invoice,
      issued: true,
      immutable: true,
      issuedAt: new Date().toISOString()
    });
  }

  getInvoice(context, invoiceId) {
    const tenantId = requireTenant(context);
    const invoice = this.repository.get(invoiceId);

    if (!invoice) {
      throw new InvoiceError(ERRORS.INVOICE_NOT_FOUND, "Invoice was not found.");
    }

    if (invoice.tenantId !== tenantId) {
      throw new InvoiceError(ERRORS.CROSS_TENANT_ACCESS, "Cross-tenant invoice access is forbidden.");
    }

    return invoice;
  }

  listInvoices(context) {
    const tenantId = requireTenant(context);
    return this.repository.list().filter((invoice) => invoice.tenantId === tenantId);
  }

  listCustomerInvoices(context, customerId) {
    return this.listInvoices(context).filter((invoice) => invoice.customerSnapshot.customerId === customerId);
  }

  listOrderInvoices(context, orderId) {
    return this.listInvoices(context).filter((invoice) => invoice.sourceOrderId === orderId);
  }

  attemptEditIssuedInvoice(context, invoiceId) {
    const invoice = this.getInvoice(context, invoiceId);

    if (invoice.issued) {
      throw new InvoiceError(ERRORS.ISSUED_INVOICE_IMMUTABLE, "Issued invoice cannot be edited.");
    }

    return this.requestLifecycleAction("edit-draft");
  }

  requestLifecycleAction() {
    if (!this.policy.lifecyclePolicyApproved) {
      throw new InvoiceError(
        ERRORS.LIFECYCLE_POLICY_NOT_APPROVED,
        "Draft, numbering, cancellation, and credit-note behavior is not approved."
      );
    }

    return Object.freeze({ allowed: true });
  }
}

function requireTenant(context) {
  if (!context || !context.tenantId) {
    throw new InvoiceError(ERRORS.MISSING_TENANT, "Tenant context is required.");
  }

  return context.tenantId;
}

function requireSourceOrder(order) {
  if (!order || !order.id) {
    throw new InvoiceError(ERRORS.SOURCE_ORDER_REQUIRED, "A saved source order is required.");
  }

  return order;
}

function isInvoiceReady(order) {
  return order.saved && order.items.length > 0 && order.items.every((item) => item.pricingSnapshot);
}

function hasRequiredSnapshots(item) {
  return Boolean(item.productSnapshot && item.pricingSnapshot && item.quantity !== undefined && item.quantity !== null);
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
  InvoiceError,
  InvoiceRepository,
  InvoiceService,
  ERRORS
};
