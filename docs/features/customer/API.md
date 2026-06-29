# Customer API

## Purpose

Define the Phase 1 customer API surface at documentation level only.

This document is technical design after business rules, decision tables, and Gherkin. It must not redefine customer business rules.

Business source: [Customer V1](VERSIONS/V1.md).

## Resources

- Customer
- Customer contact
- Customer address
- Customer snapshot

## Commands

### Create Customer

Creates a customer in the current tenant after required field policy is approved.

Business rules: [CUS-1](VERSIONS/V1.md#cus-1-tenant-scope), [CUS-2](VERSIONS/V1.md#cus-2-customer-identity), [CUS-3](VERSIONS/V1.md#cus-3-customer-creation), [CUS-9](VERSIONS/V1.md#cus-9-duplicate-customer-handling).

### Update Customer

Updates current customer information without rewriting historical order or invoice snapshots.

Business rules: [CUS-1](VERSIONS/V1.md#cus-1-tenant-scope), [CUS-8](VERSIONS/V1.md#cus-8-historical-snapshot-safety).

### Add Or Update Customer Contact

Captures customer contact information after required contact field policy is approved.

Business rule: [CUS-6](VERSIONS/V1.md#cus-6-customer-contacts).

### Add Or Update Customer Address

Captures customer address information after required address field policy is approved.

Business rule: [CUS-7](VERSIONS/V1.md#cus-7-customer-addresses).

## Queries

### Get Customer

Returns one customer in the current tenant.

### Search Customers

Returns matching customers in the current tenant.

### List Customer Contacts

Returns contacts for one customer in the current tenant.

### List Customer Addresses

Returns addresses for one customer in the current tenant.

## Validation

- Tenant context is required.
- Cross-tenant access is forbidden.
- Required field rules are pending business approval.
- Duplicate handling is pending business approval.
- Customer must exist before contact or address records can be maintained.

## Error Categories

- Missing tenant context.
- Cross-tenant access.
- Missing customer.
- Required field policy not approved.
- Duplicate policy not approved.

## Non-Goals

- No implementation code.
- No database schema.
- No framework selection.
- No pricing rules.
- No invoice numbering.
- No payment terms.

## Related Documents

- [README](README.md)
- [Skill](SKILL.md)
- [V1](VERSIONS/V1.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](customer.feature)
- [UI](UI.md)
- [Checklist](CHECKLIST.md)
- [Test Cases](TEST_CASES.md)
- [Evolution](VERSIONS/EVOLUTION.md)
