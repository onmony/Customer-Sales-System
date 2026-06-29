"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { ProductError, ProductRepository, ProductService, ERRORS } = require("../src/product/product");

function serviceWithApprovedRequiredFields(policy = {}) {
  return new ProductService({
    repository: new ProductRepository(),
    policy: { requiredFieldsApproved: true, ...policy }
  });
}

test("product.feature: Search products in the current tenant", () => {
  const service = serviceWithApprovedRequiredFields();
  service.createProduct({ tenantId: "tenant_a" }, { displayName: "Steel Bottle" });
  service.createProduct({ tenantId: "tenant_b" }, { displayName: "Steel Cup" });

  const results = service.searchProducts({ tenantId: "tenant_a" }, "steel");

  assert.equal(results.length, 1);
  assert.equal(results[0].displayName, "Steel Bottle");
  assert.equal(results[0].tenantId, "tenant_a");
});

test("product.feature: Create product when the product does not exist", () => {
  const service = serviceWithApprovedRequiredFields();

  const product = service.createProduct({ tenantId: "tenant_a" }, { displayName: "Blue Notebook" });

  assert.equal(product.tenantId, "tenant_a");
  assert.equal(product.displayName, "Blue Notebook");
});

test("product.feature: Add a product to an order", () => {
  const service = serviceWithApprovedRequiredFields();
  const product = service.createProduct({ tenantId: "tenant_a" }, { displayName: "Desk Lamp" });

  const selection = service.selectProductForOrder({ tenantId: "tenant_a" }, product.id);

  assert.equal(selection.product.id, product.id);
  assert.equal(selection.canCreateOrderItem, true);
});

test("product.feature: Prevent cross-tenant product access", () => {
  const service = serviceWithApprovedRequiredFields();
  service.createProduct({ tenantId: "tenant_b" }, { displayName: "Hidden Product" });

  const results = service.searchProducts({ tenantId: "tenant_a" }, "hidden");

  assert.deepEqual(results, []);
});

test("product.feature: Reject cross-tenant product selection", () => {
  const service = serviceWithApprovedRequiredFields();
  const product = service.createProduct({ tenantId: "tenant_b" }, { displayName: "Other Tenant Product" });

  assert.throws(
    () => service.selectProductForOrder({ tenantId: "tenant_a" }, product.id),
    (error) => error instanceof ProductError && error.code === ERRORS.CROSS_TENANT_ACCESS
  );
});

test("product.feature: Preserve historical documents after product change", () => {
  const service = serviceWithApprovedRequiredFields();
  const product = service.createProduct({ tenantId: "tenant_a" }, { displayName: "Original Product" });
  const invoiceProductSnapshot = service.createSnapshot({ tenantId: "tenant_a" }, product.id);

  service.updateProduct({ tenantId: "tenant_a" }, product.id, { displayName: "Updated Product" });

  assert.equal(invoiceProductSnapshot.displayName, "Original Product");
  assert.equal(service.getProduct({ tenantId: "tenant_a" }, product.id).displayName, "Updated Product");
});

test("product.feature: Do not invent inactive product behavior", () => {
  const service = serviceWithApprovedRequiredFields();
  const product = service.createProduct({ tenantId: "tenant_a" }, { displayName: "Inactive Product", active: false });

  assert.throws(
    () => service.selectProductForOrder({ tenantId: "tenant_a" }, product.id),
    (error) => error instanceof ProductError && error.code === ERRORS.INACTIVE_PRODUCT_POLICY_NOT_APPROVED
  );
});

test("product.feature: Do not invent required product fields", () => {
  const service = new ProductService();

  assert.throws(
    () => service.createProduct({ tenantId: "tenant_a" }, { displayName: "Pending Fields Product" }),
    (error) => error instanceof ProductError && error.code === ERRORS.REQUIRED_FIELD_POLICY_NOT_APPROVED
  );
});

test("product policy: unit behavior waits for approval", () => {
  const service = serviceWithApprovedRequiredFields();

  assert.throws(
    () => service.createProduct({ tenantId: "tenant_a" }, { displayName: "Measured Product", unit: "box" }),
    (error) => error instanceof ProductError && error.code === ERRORS.UNIT_POLICY_NOT_APPROVED
  );
});

test("product api: tenant context is required", () => {
  const service = serviceWithApprovedRequiredFields();

  assert.throws(
    () => service.searchProducts({}, "anything"),
    (error) => error instanceof ProductError && error.code === ERRORS.MISSING_TENANT
  );
});
