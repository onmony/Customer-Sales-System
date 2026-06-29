"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { CustomerError, CustomerService, ERRORS: CUSTOMER_ERRORS } = require("../../src/customer/customer");
const { ProductError, ProductService, ERRORS: PRODUCT_ERRORS } = require("../../src/product/product");
const { PricingError, PricingService, ERRORS: PRICING_ERRORS } = require("../../src/pricing/pricing");
const { OrderError, OrderService, ERRORS: ORDER_ERRORS } = require("../../src/order/order");
const { InvoiceError, InvoiceService, ERRORS: INVOICE_ERRORS } = require("../../src/invoice/invoice");
const { createInvoiceReadyOrder, createPhase1Services } = require("../helpers/phase1-fixture");

test("unit: Customer creation is blocked until required fields policy is approved", () => {
  const service = new CustomerService();

  assert.throws(
    () => service.createCustomer({ tenantId: "tenant_a" }, { displayName: "Customer" }),
    (error) => error instanceof CustomerError && error.code === CUSTOMER_ERRORS.REQUIRED_FIELD_POLICY_NOT_APPROVED
  );
});

test("unit: Product selection blocks inactive products until inactive policy is approved", () => {
  const { productService } = createPhase1Services();
  const product = productService.createProduct({ tenantId: "tenant_a" }, { displayName: "Inactive", active: false });

  assert.throws(
    () => productService.selectProductForOrder({ tenantId: "tenant_a" }, product.id),
    (error) => error instanceof ProductError && error.code === PRODUCT_ERRORS.INACTIVE_PRODUCT_POLICY_NOT_APPROVED
  );
});

test("unit: Pricing resolution requires customer and product", () => {
  const service = new PricingService();

  assert.throws(
    () => service.resolveOrderItemPrice({ tenantId: "tenant_a" }, { productId: "pro_1" }),
    (error) => error instanceof PricingError && error.code === PRICING_ERRORS.CUSTOMER_REQUIRED
  );
  assert.throws(
    () => service.resolveOrderItemPrice({ tenantId: "tenant_a" }, { customerId: "cus_1" }),
    (error) => error instanceof PricingError && error.code === PRICING_ERRORS.PRODUCT_REQUIRED
  );
});

test("unit: Order save requires at least one item and pricing snapshots", () => {
  const { context, customer, product, orderService } = createInvoiceReadyOrder();
  const emptyOrder = orderService.createOrder(context, { customer });

  assert.throws(
    () => orderService.saveOrder(context, emptyOrder.id),
    (error) => error instanceof OrderError && error.code === ORDER_ERRORS.ITEMS_REQUIRED
  );

  const noPricing = orderService.createOrder(context, { customer });
  const withItem = orderService.addOrderItem(context, noPricing.id, { product, quantity: 1 });
  assert.throws(
    () => orderService.saveOrder(context, withItem.id),
    (error) => error instanceof OrderError && error.code === ORDER_ERRORS.PRICING_SNAPSHOT_REQUIRED
  );
});

test("unit: Invoice issue requires invoice items and snapshots", () => {
  const service = new InvoiceService();
  const invoice = service.repository.create({
    tenantId: "tenant_a",
    sourceOrderId: "ord_1",
    customerSnapshot: { customerId: "cus_1", tenantId: "tenant_a", displayName: "Customer" },
    items: []
  });

  assert.throws(
    () => service.issueInvoice({ tenantId: "tenant_a" }, invoice.id),
    (error) => error instanceof InvoiceError && error.code === INVOICE_ERRORS.INVOICE_ITEMS_REQUIRED
  );
});
