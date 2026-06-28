# Invoice Skill

## Purpose

Use this file as the entry point for invoice module context.

## Load Order

1. [README](README.md)
2. [V1](VERSIONS/V1.md)
3. [Decision Tables](DECISION_TABLES.md)
4. [Gherkin](invoice.feature)
5. [API](API.md)
6. [UI](UI.md)
7. [Test Cases](TEST_CASES.md)

## Invariants

- Invoice is tenant-scoped.
- Invoice is created from a saved order.
- Issued invoices are immutable.
- Later customer, product, or pricing changes must not rewrite issued invoices.

## Related Documents

- [Rules](../../RULES.md)
- [Principles](../../PRINCIPLES.md)
- [Domain](../../DOMAIN.md)

