# Order UI

## Purpose

Define Phase 1 order user experience at documentation level only.

This document describes user-facing behavior after [business rules](VERSIONS/V1.md), [decision tables](DECISION_TABLES.md), and [Gherkin](order.feature).

## Screens

### Customer-First Order Creation

Starts order creation from a selected customer.

Expected information:

- Selected customer.
- Customer identity summary.
- Order creation state.

### Order Item Editor

Allows a user to add products and quantities to the order.

Expected information:

- Product search.
- Selected product.
- Quantity.
- Pricing resolution state.
- Item subtotal when pricing rules support it.

### Pricing Review

Shows whether every order item has resolved pricing and a snapshot-ready state.

Expected information:

- Product.
- Quantity.
- Resolved price.
- Pricing issue state.
- Snapshot readiness.

### Order Summary

Shows the order before save and after save.

Expected information:

- Customer summary.
- Order items.
- Pricing snapshot status.
- Invoice readiness state.

## States

### Customer Required

No customer has been selected, so order creation is blocked.

### Draft Policy Pending

Draft behavior has not been approved.

### Pricing Resolving

At least one order item is waiting for pricing resolution.

### Pricing Resolved

Every order item has resolved pricing.

### Pricing Missing

At least one order item has no approved pricing outcome.

### Ready To Save

The order has customer, items, and required pricing snapshots.

### Save Blocked

The order fails one or more save requirements.

### Invoice Ready

The saved order has required snapshots and can be used for invoice creation.

## Open Questions

- Draft order behavior is pending approval.
- Saved order editing behavior is pending approval.
- Order status display is pending approval.
- Cancellation behavior is pending approval.
- Quantity validation behavior is pending approval.
- Order numbering display is pending approval.

## UI Acceptance Criteria

- Users start orders from selected customers.
- Users can add current-tenant products as order items.
- Users can see whether pricing is resolved for every item.
- Users cannot save an order without required items and pricing snapshots.
- Users cannot see or use orders from another tenant.
- Users are not shown invented draft, edit, status, or cancellation behavior.

## Related Documents

- [README](README.md)
- [Skill](SKILL.md)
- [V1](VERSIONS/V1.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](order.feature)
- [API](API.md)
- [Checklist](CHECKLIST.md)
- [Test Cases](TEST_CASES.md)
- [Evolution](VERSIONS/EVOLUTION.md)
- [Customer UI](../customer/UI.md)
- [Product UI](../product/UI.md)
- [Pricing UI](../pricing/UI.md)
