# Product

## Purpose

Product represents an item that can be sold, priced, ordered, invoiced, and fulfilled.

The Product module exists so users can reliably identify what is being sold while allowing pricing, orders, invoices, and future warehouse workflows to reference stable product context.

## Scope

Product V1 covers product creation, product search, product selection during order creation, product identity snapshot safety, product unit context, and tenant isolation.

This package is documentation only. It does not contain implementation.

## Business Rules

Business rules are defined in [Product V1](VERSIONS/V1.md). They are summarized here for navigation:

- Each product belongs to exactly one tenant.
- Product identity must be clear enough for users to distinguish products.
- A product must be selectable before it can be added to an order.
- Product details needed by immutable documents must be snapshotted.
- Customer-specific pricing is handled by the Pricing module.
- Cross-tenant product access is forbidden.

## Entities

- Tenant
- Product
- Product unit
- Product snapshot

## Relationships

- A tenant has many products.
- A product can have many customer-specific prices.
- A product can appear on many orders and invoices.
- An order item or invoice item may contain an immutable product snapshot.

## User Journey

1. A user searches for a product.
2. If the product exists, the user selects it for an order.
3. If the product does not exist, an approved user creates it with approved required fields.
4. The product is added to an order item.
5. Pricing resolves through the Pricing module.
6. Downstream documents preserve product snapshots where required.

## Documentation Order

The package follows the required order:

1. [Business Rules](VERSIONS/V1.md)
2. [Decision Tables](DECISION_TABLES.md)
3. [Gherkin Scenarios](product.feature)
4. [API Specification](API.md)
5. [UI Specification](UI.md)
6. [Checklist](CHECKLIST.md)
7. [Test Cases](TEST_CASES.md)
8. [Evolution](VERSIONS/EVOLUTION.md)

## Open Questions

Open questions are tracked in [Product V1](VERSIONS/V1.md#open-questions). Do not invent answers during implementation.

## Package Contents

- [Skill](SKILL.md)
- [V1 Business Rules](VERSIONS/V1.md)
- [Evolution](VERSIONS/EVOLUTION.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](product.feature)
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
- [Customer](../customer/README.md)
- [Pricing](../pricing/README.md)
- [Order](../order/README.md)
- [Invoice](../invoice/README.md)
