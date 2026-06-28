# Invoice

## Purpose

Invoice formalizes the amount charged for an order and preserves an immutable business record.

## Scope

Phase 1 documents invoice creation from saved orders, invoice immutability, invoice snapshots, and tenant isolation.

## Business Rules

- An invoice belongs to one tenant.
- An invoice is created from a saved order.
- An invoice must preserve customer, product, quantity, and pricing snapshots from the order.
- An issued invoice is immutable.
- Invoice history must not be rewritten by later customer, product, or pricing changes.

## Entities

- Invoice
- Invoice item
- Invoice snapshot
- Order
- Customer

## Relationships

- An invoice is created from one order.
- An invoice has many invoice items.
- Invoice items derive from order items.
- An invoice belongs to one customer through the source order.

## Open Questions

- What are the required invoice statuses in Phase 1?
- Can a draft invoice exist?
- What is the cancellation or credit-note policy?
- What invoice numbering rule is required?

## Package Contents

- [Skill](SKILL.md)
- [V1](VERSIONS/V1.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](invoice.feature)
- [API](API.md)
- [UI](UI.md)
- [Checklist](CHECKLIST.md)
- [Test Cases](TEST_CASES.md)

## Related Documents

- [Order](../order/README.md)
- [Pricing](../pricing/README.md)
- [Customer](../customer/README.md)
- [Product](../product/README.md)

