# Order Skill

## Purpose

Use this file as the entry point for any future agent working on the Order module.

Order is the working center of the customer-to-invoice flow. It coordinates customer selection, product selection, pricing resolution, snapshot preservation, and invoice readiness.

## Load Order

1. [README](README.md)
2. [V1 Business Rules](VERSIONS/V1.md)
3. [Decision Tables](DECISION_TABLES.md)
4. [Gherkin](order.feature)
5. [API](API.md)
6. [UI](UI.md)
7. [Test Cases](TEST_CASES.md)
8. [Checklist](CHECKLIST.md)
9. [Evolution](VERSIONS/EVOLUTION.md)

## Invariants

- Order starts from a customer.
- Saved order items contain immutable pricing snapshots.
- Current pricing must not rewrite saved orders.
- Order is tenant-scoped.
- A saved order must have at least one item.
- Missing business rules must be documented as open questions.

## Do Not Do

- Do not define customer-specific price calculation in Order.
- Do not define invoice immutability rules in Order beyond invoice readiness.
- Do not invent draft, edit, cancellation, or status behavior until approved.
- Do not allow cross-tenant customer, product, pricing, or order access.

## Related Documents

- [README](README.md)
- [V1](VERSIONS/V1.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](order.feature)
- [API](API.md)
- [UI](UI.md)
- [Checklist](CHECKLIST.md)
- [Test Cases](TEST_CASES.md)
- [Evolution](VERSIONS/EVOLUTION.md)
- [Customer Workspace ADR](../../decisions/ADR-010-Customer-Workspace.md)
- [Customer Workspace Business Context](../../business/CUSTOMER_WORKSPACE.md)
- [Navigation](../../product/NAVIGATION.md)
- [Data Ownership](../../technical/DATA_OWNERSHIP.md)
- [Business Events](../../technical/EVENTS.md)
- [Module Dependencies](../../technical/DEPENDENCIES.md)
- [Role Matrix](../../security/ROLE_MATRIX.md)
- [Rules](../../RULES.md)
- [Principles](../../PRINCIPLES.md)
- [Domain](../../DOMAIN.md)
