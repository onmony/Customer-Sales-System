# Customer Skill

## Purpose

Use this file as the entry point for any future agent working on the Customer module.

Customer is the product's primary organizing entity. Pricing, orders, invoices, fulfillment, delivery, and payment all depend on reliable customer context.

## Load Order

1. [README](README.md)
2. [V1 Business Rules](VERSIONS/V1.md)
3. [Decision Tables](DECISION_TABLES.md)
4. [Gherkin](customer.feature)
5. [API](API.md)
6. [UI](UI.md)
7. [Test Cases](TEST_CASES.md)
8. [Checklist](CHECKLIST.md)
9. [Evolution](VERSIONS/EVOLUTION.md)

## Invariants

- Customer is tenant-scoped.
- Customer is the starting point for order creation.
- Customer data must be reliable enough for pricing and invoicing workflows.
- Customer changes must not rewrite immutable order or invoice snapshots.
- Missing business rules must be documented as open questions.

## Do Not Do

- Do not define pricing rules in the Customer module.
- Do not define invoice numbering rules in the Customer module.
- Do not invent required customer fields until approved.
- Do not expose customers across tenant boundaries.

## Related Documents

- [README](README.md)
- [V1](VERSIONS/V1.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](customer.feature)
- [API](API.md)
- [UI](UI.md)
- [Checklist](CHECKLIST.md)
- [Test Cases](TEST_CASES.md)
- [Evolution](VERSIONS/EVOLUTION.md)
- [Rules](../../RULES.md)
- [Principles](../../PRINCIPLES.md)
- [Glossary](../../GLOSSARY.md)
