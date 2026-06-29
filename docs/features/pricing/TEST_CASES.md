# Pricing Test Cases

## Purpose

Test cases map to [Pricing Gherkin](pricing.feature), which is generated from [Pricing V1 business rules](VERSIONS/V1.md) and [Decision Tables](DECISION_TABLES.md).

## Unit Tests

- Resolve customer-specific price.
- Create first pricing version.
- Create new pricing version when price changes.
- Preserve previous pricing version.
- Reject cross-tenant pricing access.
- Reject resolution without customer.
- Reject resolution without product.
- Block missing-price fallback until approved.
- Require pricing snapshot for saved order item.
- Preserve pricing version traceability.

## Integration Tests

- Add product to order and resolve pricing.
- Save order item pricing snapshot.
- Change price and verify saved order price is unchanged.
- List pricing history after multiple price changes.
- Verify tenant A cannot resolve tenant B pricing.

## Acceptance Mapping

| Gherkin Scenario | Primary Test Focus |
| --- | --- |
| Resolve customer-specific price | Current customer-product price resolves |
| Preserve pricing history | New version is created and previous version remains |
| Preserve saved order price after pricing changes | Saved order snapshot remains unchanged |
| Save order item with pricing snapshot | Saved item contains resolved price and version reference |
| Prevent cross-tenant pricing access | Other tenant prices are not visible or usable |
| Do not invent missing-price fallback | Missing-price behavior is blocked |
| Reject pricing resolution without customer | Customer is required |
| Reject pricing resolution without product | Product is required |

## Regression Tests

- Historical order item prices do not change after pricing updates.
- Pricing history remains available after repeated changes.
- Cross-tenant pricing isolation remains enforced.
- Missing-price fallback remains blocked until a documented rule exists.

## Related Documents

- [README](README.md)
- [Skill](SKILL.md)
- [V1](VERSIONS/V1.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](pricing.feature)
- [API](API.md)
- [UI](UI.md)
- [Checklist](CHECKLIST.md)
- [Evolution](VERSIONS/EVOLUTION.md)
