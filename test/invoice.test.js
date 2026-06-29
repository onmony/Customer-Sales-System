"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { CustomerRepository, CustomerService } = require("../src/customer/customer");
const { ProductRepository, ProductService } = require("../src/product/product");
const { PricingRepository, PricingService } = require("../src/pricing/pricing");
const { OrderRepository, OrderService } = require("../src/order/order");
const { InvoiceError, InvoiceRepository, InvoiceService, ERRORS } = require("../src/invoice/invoice");

function setup() {
  const context = { tenantId: "tenant_a" };
  const customerService = new CustomerService({
    repository: new CustomerRepository(),
    policy: { requiredFieldsApproved: true }
  });
  const productService = new ProductService({
    repository: new ProductRepository(),
    policy: { requiredFieldsApproved: true }
  });
  const pricingService = new PricingService({ repository: new PricingRepository() });
  const orderService = new OrderService({ repository: new OrderRepository() });
  const invoiceService = new InvoiceService({ repository: new InvoiceRepository() });

  const customer = customerService.createCustomer(context, { displayName: "Acme Retail" });
  const product = productService.createProduct(context, { displayName: "Steel Bottle" });
  pricingService.createCustomerPrice(context, { customerId: customer.id, productId: product.id, price: 125 });
  const resolution = pricingService.resolveOrderItemPrice(context, { customerId: customer.id, productId: product.id });
  const pricingSnapshot = pricingService.createOrderItemPricingSnapshot(context, resolution);
  const order = orderService.createOrder(context, { customer });
  const withItem = orderService.addOrderItem(context, order.id, { product, quantity: 2, pricingSnapshot });
  const savedOrder = orderService.saveOrder(context, withItem.id);

  return {
    context,
    customerService,
    productService,
    pricingService,
    orderService,
    invoiceService,
    customer,
    product,
    savedOrder
  };
}

test("invoice.feature: Create invoice from saved order", () => {
  const { context, invoiceService, savedOrder } = setup();

  const invoice = invoiceService.createInvoiceFromOrder(context, { order: savedOrder });

  assert.equal(invoice.sourceOrderId, savedOrder.id);
  assert.equal(invoice.items.length, 1);
  assert.equal(invoice.items[0].pricingSnapshot.price, 125);
});

test("invoice.feature: Block invoice creation without saved order", () => {
  const { context, invoiceService } = setup();

  assert.throws(
    () => invoiceService.createInvoiceFromOrder(context, {}),
    (error) => error instanceof InvoiceError && error.code === ERRORS.SOURCE_ORDER_REQUIRED
  );
});

test("invoice.feature: Block invoice creation from incomplete order", () => {
  const { context, customer, invoiceService } = setup();
  const orderService = new OrderService({ repository: new OrderRepository() });
  const incompleteOrder = orderService.createOrder(context, { customer });

  assert.throws(
    () => invoiceService.createInvoiceFromOrder(context, { order: incompleteOrder }),
    (error) => error instanceof InvoiceError && error.code === ERRORS.SOURCE_ORDER_NOT_SAVED
  );
});

test("invoice.feature: Issue invoice with required snapshots", () => {
  const { context, invoiceService, savedOrder } = setup();
  const invoice = invoiceService.createInvoiceFromOrder(context, { order: savedOrder });

  const issued = invoiceService.issueInvoice(context, invoice.id);

  assert.equal(issued.issued, true);
  assert.equal(issued.immutable, true);
  assert.ok(issued.issuedAt);
});

test("invoice.feature: Prevent edits to issued invoice", () => {
  const { context, invoiceService, savedOrder } = setup();
  const invoice = invoiceService.createInvoiceFromOrder(context, { order: savedOrder });
  const issued = invoiceService.issueInvoice(context, invoice.id);

  assert.throws(
    () => invoiceService.attemptEditIssuedInvoice(context, issued.id),
    (error) => error instanceof InvoiceError && error.code === ERRORS.ISSUED_INVOICE_IMMUTABLE
  );
});

test("invoice.feature: Preserve issued invoice after pricing changes", () => {
  const { context, pricingService, invoiceService, customer, product, savedOrder } = setup();
  const invoice = invoiceService.createInvoiceFromOrder(context, { order: savedOrder });
  const issued = invoiceService.issueInvoice(context, invoice.id);

  pricingService.changeCustomerPrice(context, { customerId: customer.id, productId: product.id, price: 999 });

  assert.equal(issued.items[0].pricingSnapshot.price, 125);
});

test("invoice.feature: Preserve issued invoice after customer, product, or order changes", () => {
  const { context, customerService, productService, invoiceService, customer, product, savedOrder } = setup();
  const invoice = invoiceService.createInvoiceFromOrder(context, { order: savedOrder });
  const issued = invoiceService.issueInvoice(context, invoice.id);

  customerService.updateCustomer(context, customer.id, { displayName: "Changed Customer" });
  productService.updateProduct(context, product.id, { displayName: "Changed Product" });

  assert.equal(issued.customerSnapshot.displayName, "Acme Retail");
  assert.equal(issued.items[0].productSnapshot.displayName, "Steel Bottle");
  assert.equal(issued.sourceOrderId, savedOrder.id);
});

test("invoice.feature: Prevent cross-tenant invoice access", () => {
  const { invoiceService, savedOrder } = setup();
  const otherTenantOrder = { ...savedOrder, tenantId: "tenant_b" };
  const invoice = invoiceService.createInvoiceFromOrder({ tenantId: "tenant_b" }, { order: otherTenantOrder });

  const visible = invoiceService.listInvoices({ tenantId: "tenant_a" });

  assert.deepEqual(visible, []);
  assert.throws(
    () => invoiceService.getInvoice({ tenantId: "tenant_a" }, invoice.id),
    (error) => error instanceof InvoiceError && error.code === ERRORS.CROSS_TENANT_ACCESS
  );
});

test("invoice.feature: Reject cross-tenant invoice issue", () => {
  const { invoiceService, savedOrder } = setup();
  const otherTenantOrder = { ...savedOrder, tenantId: "tenant_b" };
  const invoice = invoiceService.createInvoiceFromOrder({ tenantId: "tenant_b" }, { order: otherTenantOrder });

  assert.throws(
    () => invoiceService.issueInvoice({ tenantId: "tenant_a" }, invoice.id),
    (error) => error instanceof InvoiceError && error.code === ERRORS.CROSS_TENANT_ACCESS
  );
});

test("invoice.feature: Do not invent invoice numbering, draft, cancellation, or credit-note behavior", () => {
  const { invoiceService } = setup();

  assert.throws(
    () => invoiceService.requestLifecycleAction("cancel"),
    (error) => error instanceof InvoiceError && error.code === ERRORS.LIFECYCLE_POLICY_NOT_APPROVED
  );
});

test("invoice api: tenant context is required", () => {
  const { invoiceService } = setup();

  assert.throws(
    () => invoiceService.listInvoices({}),
    (error) => error instanceof InvoiceError && error.code === ERRORS.MISSING_TENANT
  );
});
