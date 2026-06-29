"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { CustomerError, CustomerRepository, CustomerService, ERRORS } = require("../src/customer/customer");

function serviceWithApprovedRequiredFields() {
  return new CustomerService({
    repository: new CustomerRepository(),
    policy: { requiredFieldsApproved: true }
  });
}

test("customer.feature: Search for a customer in the current tenant", () => {
  const service = serviceWithApprovedRequiredFields();
  service.createCustomer({ tenantId: "tenant_a" }, { displayName: "Acme Retail" });
  service.createCustomer({ tenantId: "tenant_b" }, { displayName: "Acme Wholesale" });

  const results = service.searchCustomers({ tenantId: "tenant_a" }, "acme");

  assert.equal(results.length, 1);
  assert.equal(results[0].displayName, "Acme Retail");
  assert.equal(results[0].tenantId, "tenant_a");
});

test("customer.feature: Create customer when the customer does not exist", () => {
  const service = serviceWithApprovedRequiredFields();

  const customer = service.createCustomer({ tenantId: "tenant_a" }, { displayName: "North Star Traders" });

  assert.equal(customer.tenantId, "tenant_a");
  assert.equal(customer.displayName, "North Star Traders");
});

test("customer.feature: Select a customer before creating an order", () => {
  const service = serviceWithApprovedRequiredFields();
  const customer = service.createCustomer({ tenantId: "tenant_a" }, { displayName: "Bright Stores" });

  const selection = service.selectCustomerForOrder({ tenantId: "tenant_a" }, customer.id);

  assert.equal(selection.customer.id, customer.id);
  assert.equal(selection.canStartOrder, true);
});

test("customer.feature: Prevent cross-tenant customer access", () => {
  const service = serviceWithApprovedRequiredFields();
  service.createCustomer({ tenantId: "tenant_b" }, { displayName: "Other Tenant Buyer" });

  const results = service.searchCustomers({ tenantId: "tenant_a" }, "buyer");

  assert.deepEqual(results, []);
});

test("customer.feature: Reject cross-tenant customer selection", () => {
  const service = serviceWithApprovedRequiredFields();
  const customer = service.createCustomer({ tenantId: "tenant_b" }, { displayName: "Hidden Buyer" });

  assert.throws(
    () => service.selectCustomerForOrder({ tenantId: "tenant_a" }, customer.id),
    (error) => error instanceof CustomerError && error.code === ERRORS.CROSS_TENANT_ACCESS
  );
});

test("customer.feature: Preserve historical documents after customer change", () => {
  const service = serviceWithApprovedRequiredFields();
  const customer = service.createCustomer({ tenantId: "tenant_a" }, { displayName: "Original Name" });
  const invoiceCustomerSnapshot = service.createSnapshot({ tenantId: "tenant_a" }, customer.id);

  service.updateCustomer({ tenantId: "tenant_a" }, customer.id, { displayName: "Updated Name" });

  assert.equal(invoiceCustomerSnapshot.displayName, "Original Name");
  assert.equal(service.getCustomer({ tenantId: "tenant_a" }, customer.id).displayName, "Updated Name");
});

test("customer.feature: Do not invent duplicate customer policy", () => {
  const service = serviceWithApprovedRequiredFields();
  service.createCustomer({ tenantId: "tenant_a" }, { displayName: "Repeated Customer" });

  assert.throws(
    () => service.createCustomer({ tenantId: "tenant_a" }, { displayName: " repeated customer " }),
    (error) => error instanceof CustomerError && error.code === ERRORS.DUPLICATE_POLICY_NOT_APPROVED
  );
});

test("customer.feature: Do not invent required customer fields", () => {
  const service = new CustomerService();

  assert.throws(
    () => service.createCustomer({ tenantId: "tenant_a" }, { displayName: "Pending Fields Customer" }),
    (error) => error instanceof CustomerError && error.code === ERRORS.REQUIRED_FIELD_POLICY_NOT_APPROVED
  );
});

test("customer api: tenant context is required", () => {
  const service = serviceWithApprovedRequiredFields();

  assert.throws(
    () => service.searchCustomers({}, "anything"),
    (error) => error instanceof CustomerError && error.code === ERRORS.MISSING_TENANT
  );
});
