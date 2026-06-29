"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { CustomerService, CustomerRepository } = require("../src/customer/customer");
const { ProductService, ProductRepository } = require("../src/product/product");
const { PricingService, PricingRepository } = require("../src/pricing/pricing");
const { OrderError, OrderRepository, OrderService, ERRORS } = require("../src/order/order");

function setup() {
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
  const context = { tenantId: "tenant_a" };
  const customer = customerService.createCustomer(context, { displayName: "Acme Retail" });
  const product = productService.createProduct(context, { displayName: "Steel Bottle" });
  pricingService.createCustomerPrice(context, { customerId: customer.id, productId: product.id, price: 125 });
  const pricingResolution = pricingService.resolveOrderItemPrice(context, {
    customerId: customer.id,
    productId: product.id
  });
  const pricingSnapshot = pricingService.createOrderItemPricingSnapshot(context, pricingResolution);

  return { context, customerService, productService, pricingService, orderService, customer, product, pricingSnapshot };
}

test("order.feature: Create order for selected customer", () => {
  const { context, orderService, customer } = setup();

  const order = orderService.createOrder(context, { customer });

  assert.equal(order.customerId, customer.id);
  assert.equal(order.tenantId, context.tenantId);
});

test("order.feature: Block order creation without customer", () => {
  const { context, orderService } = setup();

  assert.throws(
    () => orderService.createOrder(context, {}),
    (error) => error instanceof OrderError && error.code === ERRORS.CUSTOMER_REQUIRED
  );
});

test("order.feature: Add product to order", () => {
  const { context, orderService, customer, product } = setup();
  const order = orderService.createOrder(context, { customer });

  const updated = orderService.addOrderItem(context, order.id, { product, quantity: 2 });

  assert.equal(updated.items.length, 1);
  assert.equal(updated.items[0].productId, product.id);
  assert.equal(updated.items[0].quantity, 2);
});

test("order.feature: Block order save without items", () => {
  const { context, orderService, customer } = setup();
  const order = orderService.createOrder(context, { customer });

  assert.throws(
    () => orderService.saveOrder(context, order.id),
    (error) => error instanceof OrderError && error.code === ERRORS.ITEMS_REQUIRED
  );
});

test("order.feature: Save order with pricing snapshots", () => {
  const { context, orderService, customer, product, pricingSnapshot } = setup();
  const order = orderService.createOrder(context, { customer });
  const withItem = orderService.addOrderItem(context, order.id, { product, quantity: 2, pricingSnapshot });

  const saved = orderService.saveOrder(context, withItem.id);

  assert.equal(saved.saved, true);
  assert.equal(saved.items[0].pricingSnapshot.price, 125);
  assert.equal(saved.items[0].pricingSnapshot.pricingVersionId, pricingSnapshot.pricingVersionId);
});

test("order.feature: Block order save without pricing snapshot", () => {
  const { context, orderService, customer, product } = setup();
  const order = orderService.createOrder(context, { customer });
  const withItem = orderService.addOrderItem(context, order.id, { product, quantity: 1 });

  assert.throws(
    () => orderService.saveOrder(context, withItem.id),
    (error) => error instanceof OrderError && error.code === ERRORS.PRICING_SNAPSHOT_REQUIRED
  );
});

test("order.feature: Prepare saved order for invoice creation", () => {
  const { context, orderService, customer, product, pricingSnapshot } = setup();
  const order = orderService.createOrder(context, { customer });
  const withItem = orderService.addOrderItem(context, order.id, { product, quantity: 1, pricingSnapshot });
  const saved = orderService.saveOrder(context, withItem.id);

  const readiness = orderService.checkInvoiceReadiness(context, saved.id);

  assert.equal(readiness.invoiceReady, true);
});

test("order.feature: Preserve saved order after source changes", () => {
  const { context, customerService, productService, pricingService, orderService, customer, product, pricingSnapshot } =
    setup();
  const order = orderService.createOrder(context, { customer });
  const withItem = orderService.addOrderItem(context, order.id, { product, quantity: 1, pricingSnapshot });
  const saved = orderService.saveOrder(context, withItem.id);

  customerService.updateCustomer(context, customer.id, { displayName: "Changed Customer" });
  productService.updateProduct(context, product.id, { displayName: "Changed Product" });
  pricingService.changeCustomerPrice(context, { customerId: customer.id, productId: product.id, price: 999 });

  assert.equal(saved.customerSnapshot.displayName, "Acme Retail");
  assert.equal(saved.items[0].productSnapshot.displayName, "Steel Bottle");
  assert.equal(saved.items[0].pricingSnapshot.price, 125);
});

test("order.feature: Prevent cross-tenant order access", () => {
  const { orderService } = setup();
  const otherCustomer = { id: "cus_other", tenantId: "tenant_b", displayName: "Other Customer" };
  const order = orderService.createOrder({ tenantId: "tenant_b" }, { customer: otherCustomer });

  const visible = orderService.listOrders({ tenantId: "tenant_a" });

  assert.deepEqual(visible, []);
  assert.throws(
    () => orderService.getOrder({ tenantId: "tenant_a" }, order.id),
    (error) => error instanceof OrderError && error.code === ERRORS.CROSS_TENANT_ACCESS
  );
});

test("order.feature: Reject cross-tenant order save", () => {
  const { orderService } = setup();
  const otherCustomer = { id: "cus_other", tenantId: "tenant_b", displayName: "Other Customer" };
  const order = orderService.createOrder({ tenantId: "tenant_b" }, { customer: otherCustomer });

  assert.throws(
    () => orderService.saveOrder({ tenantId: "tenant_a" }, order.id),
    (error) => error instanceof OrderError && error.code === ERRORS.CROSS_TENANT_ACCESS
  );
});

test("order.feature: Do not invent draft, edit, status, or cancellation behavior", () => {
  const { orderService } = setup();

  assert.throws(
    () => orderService.requestLifecycleAction("cancel"),
    (error) => error instanceof OrderError && error.code === ERRORS.LIFECYCLE_POLICY_NOT_APPROVED
  );
});

test("order api: tenant context is required", () => {
  const { orderService } = setup();

  assert.throws(
    () => orderService.listOrders({}),
    (error) => error instanceof OrderError && error.code === ERRORS.MISSING_TENANT
  );
});
