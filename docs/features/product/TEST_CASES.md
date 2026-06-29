# Product Test Cases

## Purpose

Test cases map to [Product Gherkin](product.feature), which is generated from [Product V1 business rules](VERSIONS/V1.md) and [Decision Tables](DECISION_TABLES.md).

## Unit Tests

- Product belongs to a tenant.
- Product selection requires tenant match.
- Product changes do not alter historical snapshots.
- Product search returns only current-tenant products.
- Product creation waits for required field policy.
- Unit behavior waits for approved unit policy.
- Inactive product behavior waits for approved inactive policy.

## Integration Tests

- Search product in current tenant.
- Add product to order.
- Prevent cross-tenant product access.
- Reject cross-tenant product selection.
- Update product after invoice and verify invoice snapshot remains unchanged.

## Acceptance Mapping

| Gherkin Scenario | Primary Test Focus |
| --- | --- |
| Search products in the current tenant | Current-tenant search only |
| Create product when the product does not exist | Product creation after required fields are approved |
| Add a product to an order | Product selection creates order item |
| Prevent cross-tenant product access | Other tenant products are hidden |
| Reject cross-tenant product selection | Other tenant products cannot be selected |
| Preserve historical documents after product change | Immutable snapshots remain unchanged |
| Do not invent inactive product behavior | Inactive behavior waits for approval |
| Do not invent required product fields | Required fields wait for approval |

## Regression Tests

- Historical invoices do not change after product updates.
- Historical orders do not change after product updates.
- Cross-tenant product isolation remains enforced.
- Inactive product policy remains blocked until documented.

## Related Documents

- [README](README.md)
- [Skill](SKILL.md)
- [V1](VERSIONS/V1.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](product.feature)
- [API](API.md)
- [UI](UI.md)
- [Checklist](CHECKLIST.md)
- [Evolution](VERSIONS/EVOLUTION.md)
