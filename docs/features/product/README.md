# Product

## Purpose

Product represents an item that can be sold, priced, ordered, invoiced, and fulfilled.

## Scope

Phase 1 documents product identity, product selection for orders, tenant isolation, and the relationship between product and pricing.

## Business Rules

- A product belongs to exactly one tenant.
- A product must be selectable before it can be added to an order.
- Product identity must be stable enough for order and invoice snapshots.
- Product pricing is handled by the Pricing module.

## Entities

- Product
- Tenant
- Product unit

## Relationships

- A tenant has many products.
- A product can have many customer-specific prices.
- A product can appear on many orders and invoices.

## Open Questions

- Which product fields are mandatory in Phase 1?
- Are product units fixed or tenant-configurable?
- Should inactive products remain visible in historical documents?

## Package Contents

- [Skill](SKILL.md)
- [V1](VERSIONS/V1.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](product.feature)
- [API](API.md)
- [UI](UI.md)
- [Checklist](CHECKLIST.md)
- [Test Cases](TEST_CASES.md)

## Related Documents

- [Domain](../../DOMAIN.md)
- [Pricing](../pricing/README.md)
- [Order](../order/README.md)

