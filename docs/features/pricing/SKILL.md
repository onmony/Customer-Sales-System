# Pricing Skill

## Purpose

Use this file as the entry point for pricing module context.

## Load Order

1. [README](README.md)
2. [V1](VERSIONS/V1.md)
3. [Decision Tables](DECISION_TABLES.md)
4. [Gherkin](pricing.feature)
5. [API](API.md)
6. [UI](UI.md)
7. [Test Cases](TEST_CASES.md)

## Invariants

- Customer-specific pricing is the primary business capability.
- Pricing history must never be lost.
- Orders store immutable pricing snapshots.
- Current pricing must never recalculate past orders.

## Related Documents

- [Rules](../../RULES.md)
- [Principles](../../PRINCIPLES.md)
- [Domain](../../DOMAIN.md)

