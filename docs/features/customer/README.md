# Customer

## Purpose

Customer is the center of the product. Every primary workflow starts from a customer and moves toward order, pricing, invoice, fulfillment, delivery, and payment.

## Scope

Phase 1 documents customer identity, customer status, customer selection during order creation, and tenant isolation.

## Business Rules

- A customer belongs to exactly one tenant.
- A customer must be selectable before an order can be created.
- Customer records must support future pricing, order, invoice, delivery, and payment relationships.
- Customer history must be preserved when it affects past business documents.

## Entities

- Customer
- Tenant
- Customer contact
- Customer address

## Relationships

- A tenant has many customers.
- A customer can have many contacts.
- A customer can have many addresses.
- A customer can have many orders.
- A customer can have customer-specific pricing.

## User Journey

1. A user searches or creates a customer.
2. The user confirms customer identity.
3. The user starts an order from the customer context.

## Open Questions

- Which fields are mandatory for creating a customer in Phase 1?
- Should duplicate customer detection block creation or only warn?
- Which customer statuses are required in Phase 1?

## Package Contents

- [Skill](SKILL.md)
- [V1](VERSIONS/V1.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](customer.feature)
- [API](API.md)
- [UI](UI.md)
- [Checklist](CHECKLIST.md)
- [Test Cases](TEST_CASES.md)

## Related Documents

- [Master Skill](../../MASTER_SKILL.md)
- [Vision](../../VISION.md)
- [Domain](../../DOMAIN.md)
- [Pricing](../pricing/README.md)
- [Order](../order/README.md)

