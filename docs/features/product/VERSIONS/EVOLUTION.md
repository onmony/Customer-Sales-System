# Product Evolution

## Purpose

This document records how the Product module is expected to evolve over time. Future versions are planning markers, not approved business rules.

Approved business rules for the current version live in [V1](V1.md).

## Version Timeline

### V1: Product Foundation

V1 supports product creation, product search, product selection for order creation, product unit context, tenant isolation, and historical snapshot safety.

Status: documented.

Source: [V1](V1.md).

### V2: Product Status And Lifecycle

V2 may define active or inactive behavior, product lifecycle transitions, and operational restrictions.

Status: not approved.

### V3: Product Classification

V3 may define categories, product groups, brands, tags, and reporting classifications.

Status: not approved.

### V4: Inventory And Warehouse Context

V4 may connect products to stock quantities, warehouse locations, batch tracking, serial tracking, and fulfillment constraints.

Status: not approved.

### V5: AI Product Assistance

V5 may suggest product matches, detect duplicate products, recommend substitutes, or identify frequently ordered products.

Status: not approved.

## Evolution Rules

- New versions must not rewrite historical product snapshots.
- New versions must preserve tenant isolation.
- New versions must document business rules before decision tables.
- New versions must generate Gherkin from business rules and decision tables.
- New versions must not implement unclear business behavior.
- Product evolution must not redefine customer-specific pricing, order, invoice, shipment, delivery, or payment rules.

## Related Documents

- [README](../README.md)
- [Skill](../SKILL.md)
- [V1](V1.md)
- [Decision Tables](../DECISION_TABLES.md)
- [Gherkin](../product.feature)
- [API](../API.md)
- [UI](../UI.md)
- [Checklist](../CHECKLIST.md)
- [Test Cases](../TEST_CASES.md)
