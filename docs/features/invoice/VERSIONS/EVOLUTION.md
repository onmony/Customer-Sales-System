# Invoice Evolution

## Purpose

This document records how the Invoice module is expected to evolve over time. Future versions are planning markers, not approved business rules.

Approved business rules for the current version live in [V1](V1.md).

## Version Timeline

### V1: Order-To-Invoice Foundation

V1 supports invoice creation from saved invoice-ready orders, invoice snapshot preservation, invoice issue behavior, issued invoice immutability, and tenant isolation.

Status: documented.

Source: [V1](V1.md).

### V2: Invoice Lifecycle And Numbering

V2 may define invoice numbers, draft invoices, status transitions, issue preconditions, and numbering rules.

Status: not approved.

### V3: Corrections And Credit Notes

V3 may define cancellation, voiding, credit notes, reversals, and correction workflows.

Status: not approved.

### V4: Tax, Export, And Compliance

V4 may define tax display, invoice print format, PDF export, e-invoicing, and compliance workflows.

Status: not approved.

### V5: Payments And Collections Connection

V5 may connect invoices to payments, reminders, collections, outstanding balances, and settlement status.

Status: not approved.

## Evolution Rules

- New versions must not rewrite issued invoices.
- New versions must preserve tenant isolation.
- New versions must document business rules before decision tables.
- New versions must generate Gherkin from business rules and decision tables.
- New versions must not implement unclear business behavior.
- Invoice evolution must not redefine customer identity, product identity, pricing calculation, order creation, shipment, delivery, or payment rules.

## Related Documents

- [README](../README.md)
- [Skill](../SKILL.md)
- [V1](V1.md)
- [Decision Tables](../DECISION_TABLES.md)
- [Gherkin](../invoice.feature)
- [API](../API.md)
- [UI](../UI.md)
- [Checklist](../CHECKLIST.md)
- [Test Cases](../TEST_CASES.md)
