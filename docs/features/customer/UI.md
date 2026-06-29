# Customer UI

## Purpose

Define Phase 1 customer user experience at documentation level only.

This document describes user-facing behavior after [business rules](VERSIONS/V1.md), [decision tables](DECISION_TABLES.md), and [Gherkin](customer.feature).

## Screens

### Customer Search

Allows a user to find customers in the current tenant before order creation.

Expected information:

- Customer display name.
- Customer identifier when approved.
- Primary contact summary when approved.
- Primary address summary when approved.

### Customer Detail

Shows customer identity, contacts, addresses, and related workflow entry points.

Expected information:

- Customer identity.
- Contacts.
- Addresses.
- Orders entry point.
- Pricing entry point.
- Invoices entry point.

### Customer Create

Allows a user to create a customer after required fields are approved.

Expected information:

- Required customer fields.
- Optional customer fields.
- Duplicate warning or blocking state after duplicate policy is approved.

### Customer Selector In Order Creation

Allows a salesperson to select a customer before creating an order.

Expected information:

- Search input.
- Matching customers.
- Selected customer state.

## States

### Empty Search

No search input has been entered.

### Search Results

Matching current-tenant customers are shown.

### No Matching Customer

No matching current-tenant customer exists.

### Customer Selected

A customer has been selected and an order can start from customer context.

### Duplicate Policy Pending

A possible duplicate exists but duplicate behavior has not been approved.

### Required Fields Pending

Required customer fields have not been approved.

### Cross-Tenant Access Forbidden

Customers from another tenant must not be visible or selectable.

## Open Questions

- Required fields for customer creation are pending approval.
- Duplicate customer warning behavior is pending approval.
- Customer identifier display is pending approval.
- Customer status display is pending approval.
- Contact and address required fields are pending approval.

## UI Acceptance Criteria

- Users can search customers before order creation.
- Users can identify and select a current-tenant customer.
- Users cannot see customers from another tenant.
- Users are not shown invented required-field or duplicate behavior.

## Related Documents

- [README](README.md)
- [Skill](SKILL.md)
- [V1](VERSIONS/V1.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](customer.feature)
- [API](API.md)
- [Checklist](CHECKLIST.md)
- [Test Cases](TEST_CASES.md)
- [Evolution](VERSIONS/EVOLUTION.md)
- [Order UI](../order/UI.md)
