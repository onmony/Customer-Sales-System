"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { PricingError, PricingRepository, PricingService, ERRORS } = require("../src/pricing/pricing");

function createService() {
  return new PricingService({ repository: new PricingRepository() });
}

test("pricing.feature: Resolve customer-specific price", () => {
  const service = createService();
  service.createCustomerPrice(
    { tenantId: "tenant_a" },
    { customerId: "cus_1", productId: "pro_1", price: 125 }
  );

  const resolution = service.resolveOrderItemPrice(
    { tenantId: "tenant_a" },
    { customerId: "cus_1", productId: "pro_1" }
  );

  assert.equal(resolution.price, 125);
  assert.equal(resolution.customerId, "cus_1");
  assert.equal(resolution.productId, "pro_1");
  assert.ok(resolution.pricingVersionId);
});

test("pricing.feature: Preserve pricing history", () => {
  const service = createService();
  const first = service.createCustomerPrice(
    { tenantId: "tenant_a" },
    { customerId: "cus_1", productId: "pro_1", price: 100 }
  );

  const change = service.changeCustomerPrice(
    { tenantId: "tenant_a" },
    { customerId: "cus_1", productId: "pro_1", price: 150 }
  );
  const history = service.listCustomerPriceHistory(
    { tenantId: "tenant_a" },
    { customerId: "cus_1", productId: "pro_1" }
  );

  assert.equal(change.changed, true);
  assert.equal(change.previousVersion.id, first.id);
  assert.equal(history.length, 2);
  assert.equal(history[0].price, 100);
  assert.equal(history[1].price, 150);
});

test("pricing.feature: Preserve saved order price after pricing changes", () => {
  const service = createService();
  service.createCustomerPrice(
    { tenantId: "tenant_a" },
    { customerId: "cus_1", productId: "pro_1", price: 100 }
  );
  const resolution = service.resolveOrderItemPrice(
    { tenantId: "tenant_a" },
    { customerId: "cus_1", productId: "pro_1" }
  );
  const snapshot = service.createOrderItemPricingSnapshot({ tenantId: "tenant_a" }, resolution);

  service.changeCustomerPrice(
    { tenantId: "tenant_a" },
    { customerId: "cus_1", productId: "pro_1", price: 175 }
  );

  assert.equal(snapshot.price, 100);
  assert.equal(snapshot.pricingVersionId, resolution.pricingVersionId);
});

test("pricing.feature: Save order item with pricing snapshot", () => {
  const service = createService();
  service.createCustomerPrice(
    { tenantId: "tenant_a" },
    { customerId: "cus_1", productId: "pro_1", price: 200 }
  );
  const resolution = service.resolveOrderItemPrice(
    { tenantId: "tenant_a" },
    { customerId: "cus_1", productId: "pro_1" }
  );

  const snapshot = service.createOrderItemPricingSnapshot({ tenantId: "tenant_a" }, resolution);

  assert.equal(snapshot.price, 200);
  assert.equal(snapshot.pricingVersionId, resolution.pricingVersionId);
  assert.equal(snapshot.versionNumber, 1);
});

test("pricing.feature: Prevent cross-tenant pricing access", () => {
  const service = createService();
  service.createCustomerPrice(
    { tenantId: "tenant_b" },
    { customerId: "cus_1", productId: "pro_1", price: 300 }
  );

  assert.throws(
    () =>
      service.resolveOrderItemPrice(
        { tenantId: "tenant_a" },
        { customerId: "cus_1", productId: "pro_1" }
      ),
    (error) => error instanceof PricingError && error.code === ERRORS.MISSING_PRICE_POLICY_NOT_APPROVED
  );
});

test("pricing.feature: Do not invent missing-price fallback", () => {
  const service = createService();

  assert.throws(
    () =>
      service.resolveOrderItemPrice(
        { tenantId: "tenant_a" },
        { customerId: "cus_1", productId: "pro_1" }
      ),
    (error) => error instanceof PricingError && error.code === ERRORS.MISSING_PRICE_POLICY_NOT_APPROVED
  );
});

test("pricing.feature: Reject pricing resolution without customer", () => {
  const service = createService();

  assert.throws(
    () => service.resolveOrderItemPrice({ tenantId: "tenant_a" }, { productId: "pro_1" }),
    (error) => error instanceof PricingError && error.code === ERRORS.CUSTOMER_REQUIRED
  );
});

test("pricing.feature: Reject pricing resolution without product", () => {
  const service = createService();

  assert.throws(
    () => service.resolveOrderItemPrice({ tenantId: "tenant_a" }, { customerId: "cus_1" }),
    (error) => error instanceof PricingError && error.code === ERRORS.PRODUCT_REQUIRED
  );
});

test("pricing api: pricing snapshot requires version traceability", () => {
  const service = createService();

  assert.throws(
    () =>
      service.createOrderItemPricingSnapshot(
        { tenantId: "tenant_a" },
        { tenantId: "tenant_a", customerId: "cus_1", productId: "pro_1", price: 100 }
      ),
    (error) => error instanceof PricingError && error.code === ERRORS.PRICING_VERSION_REQUIRED
  );
});

test("pricing api: tenant context is required", () => {
  const service = createService();

  assert.throws(
    () => service.listCustomerPriceHistory({}, { customerId: "cus_1", productId: "pro_1" }),
    (error) => error instanceof PricingError && error.code === ERRORS.MISSING_TENANT
  );
});
