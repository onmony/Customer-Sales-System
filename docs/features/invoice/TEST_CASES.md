# Invoice Test Cases

## Purpose

Test cases map to [Invoice Gherkin](invoice.feature), which is generated from [Invoice V1 business rules](VERSIONS/V1.md) and [Decision Tables](DECISION_TABLES.md).

## Unit Tests

- Invoice requires tenant.
- Invoice requires saved source order.
- Invoice requires source order pricing snapshots.
- Issued invoice cannot be edited.
- Invoice requires source order tenant match.
- Invoice issue requires invoice items.
- Invoice issue requires snapshots.
- Invoice lifecycle behavior waits for approved policy.

## Integration Tests

- Create invoice from saved order.
- Block invoice creation without pricing snapshots.
- Issue invoice and block edits.
- Change pricing after invoice and verify invoice remains unchanged.
- Prevent cross-tenant invoice access.
- Block invoice creation without saved order.
- Preserve issued invoice after customer, product, or order changes.
- Reject cross-tenant invoice issue.

## Acceptance Mapping

| Gherkin Scenario | Primary Test Focus |
| --- | --- |
| Create invoice from saved order | Invoice creation from invoice-ready order |
| Block invoice creation without saved order | Source order required |
| Block invoice creation from incomplete order | Order snapshots required |
| Issue invoice with required snapshots | Issue readiness and immutability |
| Prevent edits to issued invoice | Issued invoice cannot be edited |
| Preserve issued invoice after pricing changes | Pricing changes do not alter invoice |
| Preserve issued invoice after customer, product, or order changes | Historical safety |
| Prevent cross-tenant invoice access | Other tenant invoices are hidden |
| Reject cross-tenant invoice issue | Other tenant invoices cannot be issued |
| Do not invent invoice numbering, draft, cancellation, or credit-note behavior | Lifecycle behavior waits for approval |

## Regression Tests

- Issued invoice pricing does not change after pricing updates.
- Issued invoice customer context does not change after customer updates.
- Issued invoice product context does not change after product updates.
- Issued invoice source order context does not change after order updates.
- Cross-tenant invoice isolation remains enforced.
- Draft, numbering, cancellation, and credit-note behavior remains blocked until documented.

## Related Documents

- [README](README.md)
- [Skill](SKILL.md)
- [V1](VERSIONS/V1.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](invoice.feature)
- [API](API.md)
- [UI](UI.md)
- [Checklist](CHECKLIST.md)
- [Evolution](VERSIONS/EVOLUTION.md)
