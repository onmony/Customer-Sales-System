# Order Skill

## Purpose

Use this file as the entry point for order module context.

## Load Order

1. [README](README.md)
2. [V1](VERSIONS/V1.md)
3. [Decision Tables](DECISION_TABLES.md)
4. [Gherkin](order.feature)
5. [API](API.md)
6. [UI](UI.md)
7. [Test Cases](TEST_CASES.md)

## Invariants

- Order starts from a customer.
- Saved order items contain immutable pricing snapshots.
- Current pricing must not rewrite saved orders.
- Order is tenant-scoped.

## Related Documents

- [Rules](../../RULES.md)
- [Principles](../../PRINCIPLES.md)
- [Domain](../../DOMAIN.md)

