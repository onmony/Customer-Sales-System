# Invoice UI

## Purpose

Define Phase 1 invoice user experience at documentation level only.

This document describes user-facing behavior after [business rules](VERSIONS/V1.md), [decision tables](DECISION_TABLES.md), and [Gherkin](invoice.feature).

## Screens

### Invoice Creation From Order

Allows a user to create an invoice from a saved, invoice-ready order.

Expected information:

- Source order summary.
- Customer snapshot summary.
- Order item snapshot summary.
- Invoice readiness state.

### Invoice Preview

Allows a user to review invoice information before issue when preview behavior is approved.

Expected information:

- Customer snapshot.
- Invoice items.
- Product snapshots.
- Quantity.
- Pricing snapshots.
- Issue readiness state.

### Invoice Detail

Shows invoice state and immutable invoice information after issue.

Expected information:

- Invoice identity.
- Source order reference.
- Customer snapshot.
- Invoice items.
- Issue state.
- Immutability state.

### Invoice List

Shows invoices in the current tenant.

Expected information:

- Invoice identity when numbering policy is approved.
- Customer.
- Source order.
- Issue state.

## States

### Ready To Create

The source order is saved, invoice-ready, and belongs to the current tenant.

### Creation Blocked

The source order is missing, incomplete, not invoice-ready, or belongs to another tenant.

### Draft Behavior Pending

Draft invoice behavior has not been approved.

### Ready To Issue

The invoice has required items and snapshots.

### Issued

The invoice has been issued.

### Immutable

The issued invoice cannot be edited.

### Lifecycle Policy Pending

Numbering, cancellation, credit-note, or draft behavior has not been approved.

## Open Questions

- Draft invoice behavior is pending approval.
- Invoice numbering presentation is pending approval.
- Cancellation or credit-note workflow is pending approval.
- Invoice status display is pending approval.
- Invoice print or export display is pending approval.
- Tax display behavior is pending approval.

## UI Acceptance Criteria

- Users can create invoices only from saved, invoice-ready orders.
- Users can see when invoice creation is blocked.
- Users can issue an invoice only when required snapshots exist.
- Users cannot edit issued invoices.
- Users cannot see or use invoices from another tenant.
- Users are not shown invented draft, numbering, cancellation, or credit-note behavior.

## Related Documents

- [README](README.md)
- [Skill](SKILL.md)
- [V1](VERSIONS/V1.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](invoice.feature)
- [API](API.md)
- [Checklist](CHECKLIST.md)
- [Test Cases](TEST_CASES.md)
- [Evolution](VERSIONS/EVOLUTION.md)
- [Order UI](../order/UI.md)
