# Invoice

## Purpose

Invoice formalizes the amount charged for an order and preserves an immutable business record.

The Invoice module exists so a saved order can become a durable commercial document without losing the customer, product, quantity, and pricing context used at the time of issue.

## Scope

Invoice V1 covers invoice creation from saved orders, invoice item snapshot preservation, invoice issue behavior, issued invoice immutability, invoice readiness dependency on Order, and tenant isolation.

This package is documentation only. It does not contain implementation.

## Business Rules

Business rules are defined in [Invoice V1](VERSIONS/V1.md). They are summarized here for navigation:

- Each invoice belongs to exactly one tenant.
- An invoice is created from a saved order.
- The source order must be invoice-ready.
- Invoice items preserve required customer, product, quantity, and pricing snapshots.
- Invoice must be completely self-contained and independently reproducible.
- Invoice is generated from Order snapshot once and becomes completely independent.
- Invoice rendering must use Invoice snapshot only.
- Invoice must never depend on live Customer, Product, Pricing, or Order data.
- An issued invoice is immutable.
- Later customer, product, pricing, or order changes must not rewrite an issued invoice.
- Cross-tenant invoice access is forbidden.

## Entities

- Tenant
- Invoice
- Invoice item
- Invoice snapshot
- Invoice customer snapshot
- Invoice product snapshot
- Invoice pricing snapshot
- Order
- Customer

## Relationships

- An invoice is created from one order.
- An invoice has many invoice items.
- Invoice items derive from order items.
- An invoice belongs to one customer through the source order.
- An invoice item preserves order item snapshot context.

## User Journey

1. A user opens a saved order.
2. The system checks whether the order is invoice-ready.
3. The user creates an invoice from the saved order.
4. Invoice items preserve required order snapshots.
5. The user reviews the invoice.
6. The invoice is issued.
7. The issued invoice becomes immutable.

## Documentation Order

The package follows the required order:

1. [Business Rules](VERSIONS/V1.md)
2. [Decision Tables](DECISION_TABLES.md)
3. [Gherkin Scenarios](invoice.feature)
4. [API Specification](API.md)
5. [UI Specification](UI.md)
6. [Checklist](CHECKLIST.md)
7. [Test Cases](TEST_CASES.md)
8. [Evolution](VERSIONS/EVOLUTION.md)

## Open Questions

Open questions are tracked in [Invoice V1](VERSIONS/V1.md#open-questions). Do not invent answers during implementation.

## Package Contents

- [Skill](SKILL.md)
- [V1 Business Rules](VERSIONS/V1.md)
- [Evolution](VERSIONS/EVOLUTION.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](invoice.feature)
- [API](API.md)
- [UI](UI.md)
- [Checklist](CHECKLIST.md)
- [Test Cases](TEST_CASES.md)

## Related Documents

- [Master Skill](../../MASTER_SKILL.md)
- [Vision](../../VISION.md)
- [Rules](../../RULES.md)
- [Principles](../../PRINCIPLES.md)
- [Domain](../../DOMAIN.md)
- [Order](../order/README.md)
- [Pricing](../pricing/README.md)
- [Customer](../customer/README.md)
- [Product](../product/README.md)
