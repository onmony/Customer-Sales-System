# Pricing Evolution

## Purpose

This document records how pricing is expected to evolve over time. Future versions are planning markers, not approved business rules.

Approved business rules for the current version live in [V1](V1.md).

## Version Timeline

### V1: Manual Customer-Specific Pricing

V1 supports manual customer-specific prices, pricing versions, pricing resolution during order creation, and immutable order item pricing snapshots.

Status: documented.

Source: [V1](V1.md).

### V2: Pricing History Experience

V2 may improve user-facing pricing history, comparison, filtering, and audit visibility.

Status: not approved.

### V3: Bulk Import

V3 may allow importing customer-specific prices in bulk.

Status: not approved.

### V4: Pricing Templates

V4 may allow reusable pricing templates for customer groups or repeated pricing patterns.

Status: not approved.

### V5: AI Pricing Suggestions

V5 may suggest prices based on historical sales, customer patterns, margins, or business goals.

Status: not approved.

## Evolution Rules

- New versions must not rewrite historical pricing meaning.
- New versions must preserve order item pricing snapshots.
- New versions must preserve tenant isolation.
- New versions must document business rules before decision tables.
- New versions must generate Gherkin from business rules and decision tables.
- New versions must not implement unclear business behavior.

## Related Documents

- [README](../README.md)
- [Skill](../SKILL.md)
- [V1](V1.md)
- [Decision Tables](../DECISION_TABLES.md)
- [Gherkin](../pricing.feature)
- [API](../API.md)
- [UI](../UI.md)
- [Checklist](../CHECKLIST.md)
- [Test Cases](../TEST_CASES.md)
