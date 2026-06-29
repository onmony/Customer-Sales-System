# Customer Test Cases

## Purpose

Test cases map to [Customer Gherkin](customer.feature), which is generated from [Customer V1 business rules](VERSIONS/V1.md) and [Decision Tables](DECISION_TABLES.md).

## Unit Tests

- Customer belongs to a tenant.
- Customer selection requires tenant match.
- Customer update does not alter historical snapshots.
- Customer search returns only current-tenant customers.
- Customer creation waits for required field policy.
- Duplicate handling waits for approved duplicate policy.
- Contact or address update requires customer tenant match.

## Integration Tests

- Search customer in current tenant.
- Create customer and start order.
- Prevent cross-tenant customer access.
- Reject cross-tenant customer selection.
- Update customer after invoice and verify invoice snapshot remains unchanged.

## Acceptance Mapping

| Gherkin Scenario | Primary Test Focus |
| --- | --- |
| Search for a customer in the current tenant | Current-tenant search only |
| Create customer when the customer does not exist | Customer creation after required fields are approved |
| Select a customer before creating an order | Customer selection enables order start |
| Prevent cross-tenant customer access | Other tenant customers are hidden |
| Reject cross-tenant customer selection | Other tenant customers cannot be selected |
| Preserve historical documents after customer change | Immutable snapshots remain unchanged |
| Do not invent duplicate customer policy | Duplicate behavior waits for approval |
| Do not invent required customer fields | Required fields wait for approval |

## Regression Tests

- Historical invoices do not change after customer updates.
- Historical orders do not change after customer updates.
- Cross-tenant customer isolation remains enforced.
- Duplicate policy remains blocked until documented.

## Related Documents

- [README](README.md)
- [Skill](SKILL.md)
- [V1](VERSIONS/V1.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](customer.feature)
- [API](API.md)
- [UI](UI.md)
- [Checklist](CHECKLIST.md)
- [Evolution](VERSIONS/EVOLUTION.md)
