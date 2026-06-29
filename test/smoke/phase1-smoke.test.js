"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const { createInvoiceReadyOrder } = require("../helpers/phase1-fixture");

test("smoke: Phase 1 happy path reaches issued immutable invoice", () => {
  const { context, invoiceService, savedOrder } = createInvoiceReadyOrder();

  const invoice = invoiceService.createInvoiceFromOrder(context, { order: savedOrder });
  const issued = invoiceService.issueInvoice(context, invoice.id);

  assert.equal(savedOrder.saved, true);
  assert.equal(invoice.items.length, 1);
  assert.equal(issued.issued, true);
  assert.equal(issued.immutable, true);
});
