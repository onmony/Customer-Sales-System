# Pricing UI

## Purpose

Define Phase 1 pricing user experience at documentation level only.

This document describes user-facing behavior after [business rules](VERSIONS/V1.md), [decision tables](DECISION_TABLES.md), and [Gherkin](pricing.feature).

## Screens

### Customer Pricing List

Shows customer-specific prices for a selected customer.

Expected information:

- Customer.
- Product.
- Current price.
- Current pricing version.
- Last changed timestamp.

### Customer Price Editor

Allows an approved user to create or change a customer-specific price after permission policy is approved.

Expected information:

- Customer.
- Product.
- Current price.
- New price.
- Version change confirmation.

### Order Item Pricing Display

Shows the resolved customer-specific price while creating an order.

Expected information:

- Product.
- Quantity.
- Resolved price.
- Pricing resolution state.
- Missing-price state when applicable.

### Pricing History View

Shows previous pricing versions for a customer-product pair.

Expected information:

- Version.
- Price.
- Active or historical state.
- Changed timestamp.

## States

### Price Resolved

A customer-specific price exists and can be used for the order item.

### Price Missing

No customer-specific price exists. V1 must not invent fallback behavior.

### Price Changed

A new pricing version has been created and prior history remains available.

### Cross-Tenant Access Forbidden

Pricing belongs to another tenant and must not be visible or usable.

### Snapshot Saved

The order item has stored the resolved price snapshot.

## Open Questions

- Missing-price action is pending approval.
- Pricing permission model is pending approval.
- Effective date display is pending approval.
- Currency and precision display are pending approval.

## UI Acceptance Criteria

- Users can see the resolved price before saving an order.
- Users can identify when pricing is missing.
- Users can see that pricing history exists after a change.
- Users cannot see pricing from another tenant.

## Related Documents

- [README](README.md)
- [Skill](SKILL.md)
- [V1](VERSIONS/V1.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](pricing.feature)
- [API](API.md)
- [Checklist](CHECKLIST.md)
- [Test Cases](TEST_CASES.md)
- [Evolution](VERSIONS/EVOLUTION.md)
- [Order UI](../order/UI.md)
