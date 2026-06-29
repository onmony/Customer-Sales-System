# Product API

## Purpose

Define the Phase 1 product API surface at documentation level only.

This document is technical design after business rules, decision tables, and Gherkin. It must not redefine product business rules.

Business source: [Product V1](VERSIONS/V1.md).

## Resources

- Product
- Product unit
- Product snapshot

## Commands

### Create Product

Creates a product in the current tenant after required field policy is approved.

Business rules: [PRO-1](VERSIONS/V1.md#pro-1-tenant-scope), [PRO-2](VERSIONS/V1.md#pro-2-product-identity), [PRO-3](VERSIONS/V1.md#pro-3-product-creation).

### Update Product

Updates current product information without rewriting historical order or invoice snapshots.

Business rules: [PRO-1](VERSIONS/V1.md#pro-1-tenant-scope), [PRO-7](VERSIONS/V1.md#pro-7-snapshot-safety).

### Set Product Unit

Captures product unit information after unit policy is approved.

Business rule: [PRO-6](VERSIONS/V1.md#pro-6-product-unit).

## Queries

### Get Product

Returns one product in the current tenant.

### Search Products

Returns matching products in the current tenant.

### Get Product Snapshot Context

Returns the product identity fields needed by downstream snapshots after those fields are approved.

## Validation

- Tenant context is required.
- Cross-tenant access is forbidden.
- Required product field rules are pending business approval.
- Unit policy is pending business approval.
- Inactive product behavior is pending business approval.

## Error Categories

- Missing tenant context.
- Cross-tenant access.
- Missing product.
- Required field policy not approved.
- Unit policy not approved.
- Inactive product policy not approved.

## Non-Goals

- No implementation code.
- No database schema.
- No framework selection.
- No customer-specific pricing rules.
- No inventory quantity logic.
- No warehouse allocation.

## Related Documents

- [README](README.md)
- [Skill](SKILL.md)
- [V1](VERSIONS/V1.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](product.feature)
- [UI](UI.md)
- [Checklist](CHECKLIST.md)
- [Test Cases](TEST_CASES.md)
- [Evolution](VERSIONS/EVOLUTION.md)
- [Pricing API](../pricing/API.md)
