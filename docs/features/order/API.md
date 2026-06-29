# Order API

## Purpose

Define the Phase 1 order API surface at documentation level only.

This document is technical design after business rules, decision tables, and Gherkin. It must not redefine order business rules.

Business source: [Order V1](VERSIONS/V1.md).

## Resources

- Order
- Order item
- Order item pricing snapshot
- Order customer snapshot
- Order product snapshot

## Commands

### Create Order

Creates an order in the current tenant for a selected customer.

Business rules: [ORD-1](VERSIONS/V1.md#ord-1-tenant-scope), [ORD-2](VERSIONS/V1.md#ord-2-customer-required), [ORD-3](VERSIONS/V1.md#ord-3-order-creation-from-customer).

### Add Order Item

Adds a product to an order as an order item.

Business rules: [ORD-5](VERSIONS/V1.md#ord-5-product-required), [ORD-6](VERSIONS/V1.md#ord-6-quantity-required), [ORD-7](VERSIONS/V1.md#ord-7-pricing-resolution-required).

### Remove Order Item

Removes an order item before saved-order edit policy applies.

Business rule: [ORD-12](VERSIONS/V1.md#ord-12-draft-edit-status-and-cancellation-policy).

### Save Order

Saves an order only when customer, item, pricing snapshot, and tenant validation pass.

Business rules: [ORD-4](VERSIONS/V1.md#ord-4-items-required), [ORD-8](VERSIONS/V1.md#ord-8-pricing-snapshot-required), [ORD-9](VERSIONS/V1.md#ord-9-customer-and-product-snapshot-safety), [ORD-10](VERSIONS/V1.md#ord-10-historical-safety).

### Create Invoice From Order

Requests invoice creation from a saved order that is invoice-ready.

Business rule: [ORD-11](VERSIONS/V1.md#ord-11-invoice-readiness).

## Queries

### Get Order

Returns one order in the current tenant.

### List Customer Orders

Returns orders for one customer in the current tenant.

### Check Invoice Readiness

Returns whether an order has the required saved state and snapshots for invoice creation.

## Validation

- Tenant context is required.
- Customer is required.
- At least one order item is required to save.
- Pricing snapshot is required for every saved order item.
- Order item product must belong to the same tenant.
- Order customer must belong to the same tenant.
- Quantity rules are pending business approval.
- Draft, edit, status, and cancellation behavior are pending business approval.

## Error Categories

- Missing tenant context.
- Cross-tenant access.
- Missing customer.
- Missing order item.
- Missing product.
- Missing pricing snapshot.
- Quantity policy not approved.
- Order lifecycle policy not approved.

## Non-Goals

- No implementation code.
- No database schema.
- No framework selection.
- No pricing calculation.
- No invoice immutability definition.
- No warehouse allocation.
- No shipment, delivery, or payment behavior.

## Related Documents

- [README](README.md)
- [Skill](SKILL.md)
- [V1](VERSIONS/V1.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](order.feature)
- [UI](UI.md)
- [Checklist](CHECKLIST.md)
- [Test Cases](TEST_CASES.md)
- [Evolution](VERSIONS/EVOLUTION.md)
- [Pricing API](../pricing/API.md)
- [Invoice API](../invoice/API.md)
