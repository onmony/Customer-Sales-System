"use strict";

const { CustomerRepository, CustomerService } = require("../../src/customer/customer");
const { ProductRepository, ProductService } = require("../../src/product/product");
const { PricingRepository, PricingService } = require("../../src/pricing/pricing");
const { OrderRepository, OrderService } = require("../../src/order/order");
const { InvoiceRepository, InvoiceService } = require("../../src/invoice/invoice");

function createPhase1Services() {
  return {
    customerService: new CustomerService({
      repository: new CustomerRepository(),
      policy: { requiredFieldsApproved: true }
    }),
    productService: new ProductService({
      repository: new ProductRepository(),
      policy: { requiredFieldsApproved: true }
    }),
    pricingService: new PricingService({ repository: new PricingRepository() }),
    orderService: new OrderService({ repository: new OrderRepository() }),
    invoiceService: new InvoiceService({ repository: new InvoiceRepository() })
  };
}

function createInvoiceReadyOrder() {
  const context = { tenantId: "tenant_a" };
  const services = createPhase1Services();
  const customer = services.customerService.createCustomer(context, { displayName: "Acme Retail" });
  const product = services.productService.createProduct(context, { displayName: "Steel Bottle" });
  services.pricingService.createCustomerPrice(context, {
    customerId: customer.id,
    productId: product.id,
    price: 125
  });
  const pricingResolution = services.pricingService.resolveOrderItemPrice(context, {
    customerId: customer.id,
    productId: product.id
  });
  const pricingSnapshot = services.pricingService.createOrderItemPricingSnapshot(context, pricingResolution);
  const order = services.orderService.createOrder(context, { customer });
  const orderWithItem = services.orderService.addOrderItem(context, order.id, {
    product,
    quantity: 2,
    pricingSnapshot
  });
  const savedOrder = services.orderService.saveOrder(context, orderWithItem.id);

  return {
    ...services,
    context,
    customer,
    product,
    pricingSnapshot,
    savedOrder
  };
}

module.exports = {
  createPhase1Services,
  createInvoiceReadyOrder
};
