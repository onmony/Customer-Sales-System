# Pricing

## Purpose

Pricing resolves the correct product price for a specific customer during order creation.

Customer-specific pricing is the primary business capability of the product.

## Scope

Phase 1 documents manual customer-specific pricing, pricing resolution for order items, versioned pricing history, and immutable order pricing snapshots.

## Business Rules

- Every customer may have a different price for every product.
- Pricing is versioned.
- Pricing history must never be lost.
- Orders contain immutable pricing snapshots.
- Future price changes must not alter past orders.
- Pricing belongs to one tenant.

## Entities

- Customer price
- Pricing version
- Pricing resolution
- Order item pricing snapshot

## Relationships

- A customer can have many product prices.
- A product can have many customer prices.
- A price version belongs to one customer-product pair.
- An order item stores the resolved pricing snapshot.

## Open Questions

- What happens when no customer-specific price exists?
- Who can change customer-specific pricing?
- Are effective dates required in Phase 1?
- Must a pricing change include a reason?

## Package Contents

- [Skill](SKILL.md)
- [V1](VERSIONS/V1.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](pricing.feature)
- [API](API.md)
- [UI](UI.md)
- [Checklist](CHECKLIST.md)
- [Test Cases](TEST_CASES.md)

## Related Documents

- [Vision](../../VISION.md)
- [Customer](../customer/README.md)
- [Product](../product/README.md)
- [Order](../order/README.md)

