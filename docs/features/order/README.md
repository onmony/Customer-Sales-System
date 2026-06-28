# Order

## Purpose

Order captures a customer request for products and connects customer, product, pricing, invoice, warehouse, shipment, delivery, and payment workflows.

## Scope

Phase 1 documents customer-based order creation, product line items, pricing snapshots, order save behavior, and tenant isolation.

## Business Rules

- An order belongs to one tenant.
- An order belongs to one customer.
- An order contains one or more order items.
- Each order item must reference a product.
- Each saved order item must contain an immutable pricing snapshot.
- Future product or pricing changes must not rewrite saved orders.

## Entities

- Order
- Order item
- Order pricing snapshot
- Customer
- Product

## Relationships

- A customer can have many orders.
- An order has many order items.
- An order item references one product.
- An order item stores one pricing snapshot.
- An order can produce an invoice.

## Open Questions

- Which order statuses are required in Phase 1?
- Can users edit saved orders?
- When does an order become locked?
- Can an order be cancelled in Phase 1?

## Package Contents

- [Skill](SKILL.md)
- [V1](VERSIONS/V1.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](order.feature)
- [API](API.md)
- [UI](UI.md)
- [Checklist](CHECKLIST.md)
- [Test Cases](TEST_CASES.md)

## Related Documents

- [Customer](../customer/README.md)
- [Product](../product/README.md)
- [Pricing](../pricing/README.md)
- [Invoice](../invoice/README.md)

