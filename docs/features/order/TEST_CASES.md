# Order Test Cases

## Purpose

Test cases map to [Order Gherkin](order.feature), which is generated from [Order V1 business rules](VERSIONS/V1.md) and [Decision Tables](DECISION_TABLES.md).

## Unit Tests

- Order requires tenant.
- Order requires customer.
- Saved order requires at least one item.
- Saved order item requires pricing snapshot.
- Order item requires product.
- Order item pricing must resolve before save.
- Invoice readiness requires saved order and pricing snapshots.
- Lifecycle behavior waits for approved policy.

## Integration Tests

- Create order from customer.
- Add product to order.
- Resolve pricing and save order.
- Block save without pricing snapshot.
- Prevent cross-tenant order access.
- Block order creation without customer.
- Block save without items.
- Preserve saved order after customer, product, or pricing changes.
- Reject cross-tenant order save.

## Acceptance Mapping

| Gherkin Scenario | Primary Test Focus |
| --- | --- |
| Create order for selected customer | Customer-first order creation |
| Block order creation without customer | Customer required |
| Add product to order | Product becomes order item |
| Block order save without items | Item required |
| Save order with pricing snapshots | Immutable pricing snapshots are stored |
| Block order save without pricing snapshot | Pricing snapshot required |
| Prepare saved order for invoice creation | Invoice readiness |
| Preserve saved order after source changes | Historical safety |
| Prevent cross-tenant order access | Other tenant orders are hidden |
| Reject cross-tenant order save | Other tenant orders cannot be modified |
| Do not invent draft, edit, status, or cancellation behavior | Lifecycle behavior waits for approval |

## Regression Tests

- Saved order prices do not change after pricing updates.
- Saved order customer context does not change after customer updates.
- Saved order product context does not change after product updates.
- Cross-tenant order isolation remains enforced.
- Draft, edit, status, and cancellation behavior remains blocked until documented.

## Related Documents

- [README](README.md)
- [Skill](SKILL.md)
- [V1](VERSIONS/V1.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](order.feature)
- [API](API.md)
- [UI](UI.md)
- [Checklist](CHECKLIST.md)
- [Evolution](VERSIONS/EVOLUTION.md)
