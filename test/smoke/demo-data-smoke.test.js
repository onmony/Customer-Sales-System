"use strict";

const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const demoDataPath = path.join(__dirname, "..", "..", "data", "demo", "phase1-demo-data.json");

test("smoke: Phase 1 demo data has required counts and immutable invoice snapshots", () => {
  const demo = JSON.parse(readFileSync(demoDataPath, "utf8"));

  assert.equal(demo.customers.length, 10);
  assert.equal(demo.products.length, 10);
  assert.ok(demo.pricing.length >= 10);
  assert.ok(demo.orders.length >= 1);
  assert.ok(demo.invoices.length >= 1);

  for (const order of demo.orders) {
    assert.equal(order.tenantId, demo.metadata.tenantId);
    assert.equal(order.saved, true);
    assert.ok(order.customerSnapshot);
    assert.ok(order.items.length > 0);
    for (const item of order.items) {
      assert.ok(item.productSnapshot);
      assert.ok(item.pricingSnapshot);
      assert.ok(item.pricingSnapshot.pricingVersionId);
    }
  }

  for (const invoice of demo.invoices) {
    assert.equal(invoice.tenantId, demo.metadata.tenantId);
    assert.equal(invoice.issued, true);
    assert.equal(invoice.immutable, true);
    assert.ok(invoice.customerSnapshot);
    assert.ok(invoice.items.length > 0);
    for (const item of invoice.items) {
      assert.ok(item.productSnapshot);
      assert.ok(item.pricingSnapshot);
      assert.ok(item.sourceOrderItemId);
    }
  }
});
