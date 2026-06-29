# Customer

## Purpose

Customer is the center of the product. Every primary workflow starts from a customer and moves toward order, pricing resolution, invoice, warehouse, shipment, delivery, and payment.

The Customer module exists so sales and operations can reliably identify who is buying, select that customer quickly, and preserve customer context across downstream business documents.

## Scope

Customer V1 covers customer creation, customer search, customer selection for order creation, contact information, address information, historical snapshot safety, and tenant isolation.

This package is documentation only. It does not contain implementation.

## Business Rules

Business rules are defined in [Customer V1](VERSIONS/V1.md). They are summarized here for navigation:

- Each customer belongs to exactly one tenant.
- Customer identity must be clear enough for users to distinguish customers.
- A customer must be selected before an order can be created.
- Customer contact and address information may be captured for operational use.
- Customer changes must not rewrite immutable order or invoice snapshots.
- Cross-tenant customer access is forbidden.

## Entities

- Tenant
- Customer
- Customer contact
- Customer address
- Customer snapshot

## Relationships

- A tenant has many customers.
- A customer can have many contacts.
- A customer can have many addresses.
- A customer can have many orders.
- A customer can have customer-specific pricing.
- An order or invoice may contain an immutable customer snapshot.

## User Journey

1. A salesperson searches for a customer.
2. If the customer exists, the salesperson selects the customer.
3. If the customer does not exist, the salesperson creates a customer with approved required fields.
4. The salesperson confirms the customer identity.
5. The salesperson starts an order from the customer context.
6. Downstream documents preserve customer snapshots where required.

## Documentation Order

The package follows the required order:

1. [Business Rules](VERSIONS/V1.md)
2. [Decision Tables](DECISION_TABLES.md)
3. [Gherkin Scenarios](customer.feature)
4. [API Specification](API.md)
5. [UI Specification](UI.md)
6. [Checklist](CHECKLIST.md)
7. [Test Cases](TEST_CASES.md)
8. [Evolution](VERSIONS/EVOLUTION.md)

## Open Questions

Open questions are tracked in [Customer V1](VERSIONS/V1.md#open-questions). Do not invent answers during implementation.

## Package Contents

- [Skill](SKILL.md)
- [V1 Business Rules](VERSIONS/V1.md)
- [Evolution](VERSIONS/EVOLUTION.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](customer.feature)
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
- [Product](../product/README.md)
- [Pricing](../pricing/README.md)
- [Order](../order/README.md)
- [Invoice](../invoice/README.md)
