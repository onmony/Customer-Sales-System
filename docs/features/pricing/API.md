# Pricing API

## Purpose

Define the Phase 1 pricing API surface at documentation level only.

This document is technical design after business rules, decision tables, and Gherkin. It must not redefine pricing business rules.

Business source: [Pricing V1](VERSIONS/V1.md).

## Resources

- Customer price
- Pricing version
- Pricing resolution
- Order item pricing snapshot

## Commands

### Create Customer Price

Creates the first pricing version for a customer-product pair in the current tenant.

Business rules: [PRI-1](VERSIONS/V1.md#pri-1-tenant-scope), [PRI-2](VERSIONS/V1.md#pri-2-customer-specific-price), [PRI-3](VERSIONS/V1.md#pri-3-customer-and-product-required).

### Change Customer Price

Creates a new pricing version and preserves previous versions.

Business rules: [PRI-4](VERSIONS/V1.md#pri-4-versioned-changes), [PRI-5](VERSIONS/V1.md#pri-5-history-preservation).

### Resolve Order Item Price

Resolves the current customer-specific price for a customer and product in the current tenant.

Business rules: [PRI-6](VERSIONS/V1.md#pri-6-current-price-resolution), [PRI-7](VERSIONS/V1.md#pri-7-missing-customer-price).

### Create Order Item Pricing Snapshot

Stores the resolved price for a saved order item.

Business rules: [PRI-8](VERSIONS/V1.md#pri-8-immutable-order-snapshot), [PRI-10](VERSIONS/V1.md#pri-10-traceability).

## Queries

### Get Current Customer Price

Returns the current customer-specific price for a customer-product pair in the current tenant.

### List Customer Price History

Returns preserved pricing versions for a customer-product pair.

### Get Pricing Resolution

Returns the resolved price outcome for an order item pricing attempt.

## Validation

- Tenant context is required.
- Cross-tenant access is forbidden.
- Missing customer-specific price behavior is pending business approval.
- Customer is required for price resolution.
- Product is required for price resolution.
- Saved order item pricing snapshot requires a resolved price.

## Error Categories

- Missing tenant context.
- Cross-tenant access.
- Missing customer.
- Missing product.
- Missing customer-specific price with no approved fallback.
- Invalid saved order item without pricing snapshot.

## Non-Goals

- No implementation code.
- No database schema.
- No framework selection.
- No tax calculation.
- No invoice numbering.

## Related Documents

- [README](README.md)
- [Skill](SKILL.md)
- [V1](VERSIONS/V1.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](pricing.feature)
- [UI](UI.md)
- [Checklist](CHECKLIST.md)
- [Test Cases](TEST_CASES.md)
- [Evolution](VERSIONS/EVOLUTION.md)
- [Order API](../order/API.md)
