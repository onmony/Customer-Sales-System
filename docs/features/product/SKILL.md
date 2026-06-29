# Product Skill

## Purpose

Use this file as the entry point for any future agent working on the Product module.

Product defines what can be sold. Pricing, order, invoice, and future warehouse workflows depend on stable product identity.

## Load Order

1. [README](README.md)
2. [V1 Business Rules](VERSIONS/V1.md)
3. [Decision Tables](DECISION_TABLES.md)
4. [Gherkin](product.feature)
5. [API](API.md)
6. [UI](UI.md)
7. [Test Cases](TEST_CASES.md)
8. [Checklist](CHECKLIST.md)
9. [Evolution](VERSIONS/EVOLUTION.md)

## Invariants

- Product is tenant-scoped.
- Product identity must be safe for order and invoice snapshots.
- Pricing rules live in the Pricing module.
- Product changes must not rewrite immutable order or invoice snapshots.
- Missing business rules must be documented as open questions.

## Do Not Do

- Do not define customer-specific pricing rules in Product.
- Do not define inventory quantity or warehouse allocation rules in Product V1.
- Do not invent required product fields until approved.
- Do not expose products across tenant boundaries.

## Related Documents

- [README](README.md)
- [V1](VERSIONS/V1.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](product.feature)
- [API](API.md)
- [UI](UI.md)
- [Checklist](CHECKLIST.md)
- [Test Cases](TEST_CASES.md)
- [Evolution](VERSIONS/EVOLUTION.md)
- [Rules](../../RULES.md)
- [Principles](../../PRINCIPLES.md)
- [Glossary](../../GLOSSARY.md)
