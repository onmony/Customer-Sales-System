# Order Evolution

## Purpose

This document records how the Order module is expected to evolve over time. Future versions are planning markers, not approved business rules.

Approved business rules for the current version live in [V1](V1.md).

## Version Timeline

### V1: Customer-First Order Foundation

V1 supports creating an order from a customer, adding products, resolving pricing, saving immutable pricing snapshots, and preparing saved orders for invoice creation.

Status: documented.

Source: [V1](V1.md).

### V2: Order Lifecycle

V2 may define draft, saved, locked, cancelled, and converted-to-invoice states.

Status: not approved.

### V3: Order Editing And Revision History

V3 may define whether saved orders can be edited, how revisions are stored, and when orders become locked.

Status: not approved.

### V4: Fulfillment Readiness

V4 may connect orders to warehouse allocation, shipment planning, partial fulfillment, and delivery preparation.

Status: not approved.

### V5: AI Order Assistance

V5 may suggest products, quantities, repeat orders, missing items, customer buying patterns, or order-risk warnings.

Status: not approved.

## Evolution Rules

- New versions must not rewrite saved order snapshots.
- New versions must preserve tenant isolation.
- New versions must document business rules before decision tables.
- New versions must generate Gherkin from business rules and decision tables.
- New versions must not implement unclear business behavior.
- Order evolution must not redefine customer identity, product identity, pricing calculation, invoice immutability, shipment, delivery, or payment rules.

## Related Documents

- [README](../README.md)
- [Skill](../SKILL.md)
- [V1](V1.md)
- [Decision Tables](../DECISION_TABLES.md)
- [Gherkin](../order.feature)
- [API](../API.md)
- [UI](../UI.md)
- [Checklist](../CHECKLIST.md)
- [Test Cases](../TEST_CASES.md)
