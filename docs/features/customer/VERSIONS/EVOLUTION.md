# Customer Evolution

## Purpose

This document records how the Customer module is expected to evolve over time. Future versions are planning markers, not approved business rules.

Approved business rules for the current version live in [V1](V1.md).

## Version Timeline

### V1: Customer Foundation

V1 supports customer creation, customer search, customer selection for order creation, contact and address context, tenant isolation, and historical snapshot safety.

Status: documented.

Source: [V1](V1.md).

### V2: Customer Status And Lifecycle

V2 may define customer statuses, lifecycle transitions, active or inactive behavior, and operational restrictions.

Status: not approved.

### V3: Duplicate Detection

V3 may define duplicate warnings, duplicate blocking, merge flows, and AI-assisted duplicate detection.

Status: not approved.

### V4: Customer Commercial Profile

V4 may define credit context, payment terms, delivery preferences, and customer-specific commercial settings.

Status: not approved.

### V5: AI Customer Insights

V5 may suggest next-best actions, customer risk indicators, order patterns, and relationship insights.

Status: not approved.

## Evolution Rules

- New versions must not rewrite historical customer snapshots.
- New versions must preserve tenant isolation.
- New versions must document business rules before decision tables.
- New versions must generate Gherkin from business rules and decision tables.
- New versions must not implement unclear business behavior.
- Customer evolution must not redefine pricing, order, invoice, shipment, delivery, or payment rules.

## Related Documents

- [README](../README.md)
- [Skill](../SKILL.md)
- [V1](V1.md)
- [Decision Tables](../DECISION_TABLES.md)
- [Gherkin](../customer.feature)
- [API](../API.md)
- [UI](../UI.md)
- [Checklist](../CHECKLIST.md)
- [Test Cases](../TEST_CASES.md)
