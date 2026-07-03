# Order

## Purpose

Order captures a customer request for products and connects customer, product, pricing, invoice, warehouse, shipment, delivery, and payment workflows.

The Order module exists so a salesperson can create an accurate customer order quickly while preserving the exact customer, product, quantity, and pricing context used at the time of order save.

## Scope

Order V1 covers customer-first order creation, product line items, pricing resolution dependency, immutable order item pricing snapshots, complete order document payload preservation, save validation, invoice readiness, and tenant isolation.

This package is documentation only. It does not contain implementation.

## Business Rules

Business rules are defined in [Order V1](VERSIONS/V1.md). They are summarized here for navigation:

- Each order belongs to exactly one tenant.
- Each order belongs to one customer.
- A saved order must contain at least one order item.
- Each order item references one product.
- Each saved order item contains an immutable pricing snapshot.
- Each order owns an `orderDocumentPayload` JSONB business document payload.
- Draft orders may regenerate the payload whenever the order changes.
- Confirmed orders freeze the payload forever.
- Order rendering must use `orderDocumentPayload`.
- Future customer, product, or pricing changes must not rewrite saved orders.
- Cross-tenant order access is forbidden.

## Entities

- Tenant
- Order
- Order item
- Order pricing snapshot
- Order document payload
- Order customer snapshot
- Order product snapshot
- Customer
- Product

## Relationships

- A customer can have many orders.
- An order has many order items.
- An order item references one product.
- An order item stores one pricing snapshot.
- An order item may store product snapshot context.
- An order may store customer snapshot context.
- An order stores the complete commercial representation in `orderDocumentPayload`.
- An order can produce an invoice.

## User Journey

1. A salesperson selects a customer.
2. The salesperson creates an order for that customer.
3. The salesperson searches and adds products.
4. Pricing resolves for each order item through the Pricing module.
5. The salesperson reviews order items and resolved prices.
6. The salesperson saves the order.
7. The saved order preserves immutable snapshots and a complete document payload.
8. When confirmed, the order payload is frozen and the order becomes eligible for invoice creation.

## Documentation Order

The package follows the required order:

1. [Business Rules](VERSIONS/V1.md)
2. [Decision Tables](DECISION_TABLES.md)
3. [Gherkin Scenarios](order.feature)
4. [API Specification](API.md)
5. [UI Specification](UI.md)
6. [Checklist](CHECKLIST.md)
7. [Test Cases](TEST_CASES.md)
8. [Evolution](VERSIONS/EVOLUTION.md)

## Open Questions

Open questions are tracked in [Order V1](VERSIONS/V1.md#open-questions). Do not invent answers during implementation.

## Package Contents

- [Skill](SKILL.md)
- [V1 Business Rules](VERSIONS/V1.md)
- [Evolution](VERSIONS/EVOLUTION.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](order.feature)
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
- [Pricing](../pricing/README.md)
- [Invoice](../invoice/README.md)
