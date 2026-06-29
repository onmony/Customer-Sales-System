# Invoice Skill

## Purpose

Use this file as the entry point for any future agent working on the Invoice module.

Invoice turns a saved order into an immutable commercial record. It depends on Order readiness and preserved snapshots.

## Load Order

1. [README](README.md)
2. [V1 Business Rules](VERSIONS/V1.md)
3. [Decision Tables](DECISION_TABLES.md)
4. [Gherkin](invoice.feature)
5. [API](API.md)
6. [UI](UI.md)
7. [Test Cases](TEST_CASES.md)
8. [Checklist](CHECKLIST.md)
9. [Evolution](VERSIONS/EVOLUTION.md)

## Invariants

- Invoice is tenant-scoped.
- Invoice is created from a saved order.
- Issued invoices are immutable.
- Later customer, product, or pricing changes must not rewrite issued invoices.
- Missing business rules must be documented as open questions.

## Do Not Do

- Do not define payment collection behavior in Invoice V1.
- Do not define tax filing, e-invoicing, or ledger posting behavior in Invoice V1.
- Do not invent invoice numbering, draft, cancellation, or credit-note policy until approved.
- Do not allow cross-tenant order or invoice access.

## Related Documents

- [README](README.md)
- [V1](VERSIONS/V1.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](invoice.feature)
- [API](API.md)
- [UI](UI.md)
- [Checklist](CHECKLIST.md)
- [Test Cases](TEST_CASES.md)
- [Evolution](VERSIONS/EVOLUTION.md)
- [Rules](../../RULES.md)
- [Principles](../../PRINCIPLES.md)
- [Domain](../../DOMAIN.md)
