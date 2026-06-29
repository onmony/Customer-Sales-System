"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { CustomerError, ERRORS: CUSTOMER_ERRORS } = require("../../src/customer/customer");
const { ProductError, ERRORS: PRODUCT_ERRORS } = require("../../src/product/product");
const { PricingError, ERRORS: PRICING_ERRORS } = require("../../src/pricing/pricing");
const { OrderError, ERRORS: ORDER_ERRORS } = require("../../src/order/order");
const { InvoiceError, ERRORS: INVOICE_ERRORS } = require("../../src/invoice/invoice");
const { createInvoiceReadyOrder, createPhase1Services } = require("../helpers/phase1-fixture");

test("regression: unresolved policies remain explicit gates", () => {
  const { customerService, productService, pricingService, orderService, invoiceService } = createPhase1Services();

  customerService.createCustomer({ tenantId: "tenant_a" }, { displayName: "Repeat Buyer" });
  assert.throws(
    () => customerService.createCustomer({ tenantId: "tenant_a" }, { displayName: "repeat buyer" }),
    (error) => error instanceof CustomerError && error.code === CUSTOMER_ERRORS.DUPLICATE_POLICY_NOT_APPROVED
  );

  assert.throws(
    () => productService.createProduct({ tenantId: "tenant_a" }, { displayName: "Box", unit: "box" }),
    (error) => error instanceof ProductError && error.code === PRODUCT_ERRORS.UNIT_POLICY_NOT_APPROVED
  );

  assert.throws(
    () => pricingService.resolveOrderItemPrice({ tenantId: "tenant_a" }, { customerId: "cus_x", productId: "pro_x" }),
    (error) => error instanceof PricingError && error.code === PRICING_ERRORS.MISSING_PRICE_POLICY_NOT_APPROVED
  );

  assert.throws(
    () => orderService.requestLifecycleAction("cancel"),
    (error) => error instanceof OrderError && error.code === ORDER_ERRORS.LIFECYCLE_POLICY_NOT_APPROVED
  );

  assert.throws(
    () => invoiceService.requestLifecycleAction("credit-note"),
    (error) => error instanceof InvoiceError && error.code === INVOICE_ERRORS.LIFECYCLE_POLICY_NOT_APPROVED
  );
});

test("regression: issued invoice remains unchanged after all upstream source changes", () => {
  const {
    context,
    customerService,
    productService,
    pricingService,
    invoiceService,
    customer,
    product,
    savedOrder
  } = createInvoiceReadyOrder();
  const invoice = invoiceService.createInvoiceFromOrder(context, { order: savedOrder });
  const issued = invoiceService.issueInvoice(context, invoice.id);

  customerService.updateCustomer(context, customer.id, { displayName: "New Customer Name" });
  productService.updateProduct(context, product.id, { displayName: "New Product Name" });
  pricingService.changeCustomerPrice(context, { customerId: customer.id, productId: product.id, price: 777 });

  assert.equal(issued.customerSnapshot.displayName, "Acme Retail");
  assert.equal(issued.items[0].productSnapshot.displayName, "Steel Bottle");
  assert.equal(issued.items[0].pricingSnapshot.price, 125);
});
