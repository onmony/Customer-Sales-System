# Pricing Skill

## Purpose

Use this file as the entry point for any future agent working on pricing.

Pricing is the product's primary business capability. It must be loaded carefully before any pricing documentation, design, or implementation work.

## Load Order

1. [README](README.md)
2. [V1 Business Rules](VERSIONS/V1.md)
3. [Decision Tables](DECISION_TABLES.md)
4. [Gherkin](pricing.feature)
5. [API](API.md)
6. [UI](UI.md)
7. [Test Cases](TEST_CASES.md)
8. [Checklist](CHECKLIST.md)
9. [Evolution](VERSIONS/EVOLUTION.md)

## Invariants

- Customer-specific pricing is the primary business capability.
- Pricing history must never be lost.
- Orders store immutable pricing snapshots.
- Current pricing must never recalculate past orders.
- Pricing is tenant-scoped.
- Missing business rules must be documented as open questions.

## Do Not Do

- Do not implement fallback pricing until approved in [V1 Open Questions](VERSIONS/V1.md#open-questions).
- Do not overwrite historical pricing versions.
- Do not calculate saved order totals from current prices.
- Do not mix product master data rules into pricing.

## Related Documents

- [README](README.md)
- [V1](VERSIONS/V1.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](pricing.feature)
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
