# Pricing

## Purpose

Pricing resolves the correct product price for a specific customer and product during order creation.

Customer-specific pricing is the primary business capability of the product. The module exists so a salesperson can create an accurate order quickly without manually remembering customer-level agreements.

## Scope

Pricing V1 covers manual customer-specific pricing, pricing versioning, price resolution during order creation, and immutable order item pricing snapshots.

This package is documentation only. It does not contain implementation.

## Business Rules

Business rules are defined in [Pricing V1](VERSIONS/V1.md). They are summarized here for navigation:

- Each customer may have a specific price for each product.
- Pricing changes create new versions.
- Pricing history must never be lost.
- Pricing resolution happens during order creation.
- Saved order items store immutable pricing snapshots.
- Later pricing changes do not alter saved orders.
- Pricing data is tenant-scoped.

## Entities

- Tenant
- Customer
- Product
- Customer price
- Pricing version
- Pricing resolution
- Order item pricing snapshot

## Relationships

- A customer can have many product prices.
- A product can have many customer prices.
- A pricing version belongs to one customer-product pair.
- An order item stores the resolved pricing snapshot.

## User Journey

1. A salesperson selects a customer.
2. The salesperson adds a product to an order.
3. The system resolves the current customer-specific price.
4. The salesperson reviews the resolved price.
5. The order is saved with an immutable pricing snapshot.
6. Later price changes preserve history and do not alter the saved order.

## Documentation Order

The package follows the required order:

1. [Business Rules](VERSIONS/V1.md)
2. [Decision Tables](DECISION_TABLES.md)
3. [Gherkin Scenarios](pricing.feature)
4. [API Specification](API.md)
5. [UI Specification](UI.md)
6. [Checklist](CHECKLIST.md)
7. [Test Cases](TEST_CASES.md)
8. [Evolution](VERSIONS/EVOLUTION.md)

## Open Questions

Open questions are tracked in [Pricing V1](VERSIONS/V1.md#open-questions). Do not invent answers during implementation.

## Package Contents

- [Skill](SKILL.md)
- [V1 Business Rules](VERSIONS/V1.md)
- [Evolution](VERSIONS/EVOLUTION.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](pricing.feature)
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
- [Product](../product/README.md)
- [Order](../order/README.md)
