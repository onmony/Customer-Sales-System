# Product UI

## Purpose

Define Phase 1 product user experience at documentation level only.

This document describes user-facing behavior after [business rules](VERSIONS/V1.md), [decision tables](DECISION_TABLES.md), and [Gherkin](product.feature).

## Screens

### Product Search

Allows a user to find products in the current tenant before adding them to an order.

Expected information:

- Product display name.
- Product identifier when approved.
- Product unit when approved.
- Product status when approved.

### Product Detail

Shows product identity and workflow entry points.

Expected information:

- Product identity.
- Unit context.
- Pricing entry point.
- Order usage context.

### Product Create

Allows an approved user to create a product after required fields are approved.

Expected information:

- Required product fields.
- Optional product fields.
- Unit field after unit policy is approved.
- Duplicate warning or blocking state after duplicate policy is approved.

### Product Selector In Order Creation

Allows a salesperson to select a product after selecting a customer.

Expected information:

- Search input.
- Matching products.
- Selected product state.
- Product unit where approved.

## States

### Empty Search

No search input has been entered.

### Search Results

Matching current-tenant products are shown.

### No Matching Product

No matching current-tenant product exists.

### Product Selected

A product has been selected and can become an order item.

### Required Fields Pending

Required product fields have not been approved.

### Unit Policy Pending

Unit behavior has not been approved.

### Inactive Policy Pending

Inactive product behavior has not been approved.

### Cross-Tenant Access Forbidden

Products from another tenant must not be visible or selectable.

## Open Questions

- Required product creation fields are pending approval.
- Inactive product behavior is pending approval.
- Unit display and validation behavior are pending approval.
- Product identifier display is pending approval.
- Product duplicate behavior is pending approval.

## UI Acceptance Criteria

- Users can search products before adding them to an order.
- Users can identify and select a current-tenant product.
- Users cannot see products from another tenant.
- Users are not shown invented required-field, unit, or inactive-product behavior.

## Related Documents

- [README](README.md)
- [Skill](SKILL.md)
- [V1](VERSIONS/V1.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](product.feature)
- [API](API.md)
- [Checklist](CHECKLIST.md)
- [Test Cases](TEST_CASES.md)
- [Evolution](VERSIONS/EVOLUTION.md)
- [Order UI](../order/UI.md)
