"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { createInvoiceReadyOrder } = require("../helpers/phase1-fixture");

test("integration: Customer to issued invoice preserves all snapshots", () => {
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

  customerService.updateCustomer(context, customer.id, { displayName: "Changed Customer" });
  productService.updateProduct(context, product.id, { displayName: "Changed Product" });
  pricingService.changeCustomerPrice(context, { customerId: customer.id, productId: product.id, price: 999 });

  assert.equal(issued.issued, true);
  assert.equal(issued.customerSnapshot.displayName, "Acme Retail");
  assert.equal(issued.items[0].productSnapshot.displayName, "Steel Bottle");
  assert.equal(issued.items[0].pricingSnapshot.price, 125);
});

test("integration: Tenant A cannot see Tenant B records across Phase 1 modules", () => {
  const { customerService, productService, pricingService, orderService, invoiceService } = createInvoiceReadyOrder();
  const tenantB = { tenantId: "tenant_b" };
  const customerB = customerService.createCustomer(tenantB, { displayName: "Tenant B Customer" });
  const productB = productService.createProduct(tenantB, { displayName: "Tenant B Product" });
  pricingService.createCustomerPrice(tenantB, { customerId: customerB.id, productId: productB.id, price: 500 });
  const resolutionB = pricingService.resolveOrderItemPrice(tenantB, {
    customerId: customerB.id,
    productId: productB.id
  });
  const snapshotB = pricingService.createOrderItemPricingSnapshot(tenantB, resolutionB);
  const orderB = orderService.createOrder(tenantB, { customer: customerB });
  const orderWithItemB = orderService.addOrderItem(tenantB, orderB.id, {
    product: productB,
    quantity: 1,
    pricingSnapshot: snapshotB
  });
  const savedOrderB = orderService.saveOrder(tenantB, orderWithItemB.id);
  invoiceService.createInvoiceFromOrder(tenantB, { order: savedOrderB });

  assert.deepEqual(customerService.searchCustomers({ tenantId: "tenant_a" }, "Tenant B"), []);
  assert.deepEqual(productService.searchProducts({ tenantId: "tenant_a" }, "Tenant B"), []);
  assert.deepEqual(orderService.listOrders({ tenantId: "tenant_a" }).filter((order) => order.id === savedOrderB.id), []);
  assert.deepEqual(invoiceService.listInvoices({ tenantId: "tenant_a" }), []);
});
