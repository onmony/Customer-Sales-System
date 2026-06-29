# Invoice API

## Purpose

Define the Phase 1 invoice API surface at documentation level only.

This document is technical design after business rules, decision tables, and Gherkin. It must not redefine invoice business rules.

Business source: [Invoice V1](VERSIONS/V1.md).

## Resources

- Invoice
- Invoice item
- Invoice customer snapshot
- Invoice product snapshot
- Invoice pricing snapshot
- Invoice source order reference

## Commands

### Create Invoice From Order

Creates an invoice from a saved, invoice-ready order in the current tenant.

Business rules: [INV-1](VERSIONS/V1.md#inv-1-tenant-scope), [INV-2](VERSIONS/V1.md#inv-2-source-order-required), [INV-3](VERSIONS/V1.md#inv-3-order-invoice-readiness), [INV-4](VERSIONS/V1.md#inv-4-invoice-items-required), [INV-5](VERSIONS/V1.md#inv-5-snapshot-required).

### Issue Invoice

Marks an invoice as issued when required invoice data and snapshots exist.

Business rules: [INV-6](VERSIONS/V1.md#inv-6-issue-invoice), [INV-7](VERSIONS/V1.md#inv-7-issued-invoice-immutability).

## Queries

### Get Invoice

Returns one invoice in the current tenant.

### List Customer Invoices

Returns invoices associated with one customer in the current tenant.

### List Order Invoices

Returns invoices created from one order in the current tenant.

### Check Invoice Issue Readiness

Returns whether an invoice has the required items and snapshots for issue.

## Validation

- Tenant context is required.
- Source order must be saved.
- Source order must contain pricing snapshots.
- Issued invoices cannot be edited.
- Source order must belong to the same tenant.
- Invoice items are required before issue.
- Required snapshots are required before issue.
- Draft, numbering, cancellation, and credit-note behavior are pending business approval.

## Error Categories

- Missing tenant context.
- Cross-tenant access.
- Missing source order.
- Source order not saved.
- Source order not invoice-ready.
- Missing invoice items.
- Missing invoice snapshots.
- Issued invoice is immutable.
- Invoice lifecycle policy not approved.

## Non-Goals

- No implementation code.
- No database schema.
- No framework selection.
- No payment collection.
- No tax filing.
- No accounting ledger posting.
- No e-invoicing.

## Related Documents

- [README](README.md)
- [Skill](SKILL.md)
- [V1](VERSIONS/V1.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](invoice.feature)
- [UI](UI.md)
- [Checklist](CHECKLIST.md)
- [Test Cases](TEST_CASES.md)
- [Evolution](VERSIONS/EVOLUTION.md)
- [Order API](../order/API.md)
