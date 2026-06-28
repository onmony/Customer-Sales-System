# Order Test Cases

## Unit Tests

- Order requires tenant.
- Order requires customer.
- Saved order requires at least one item.
- Saved order item requires pricing snapshot.

## Integration Tests

- Create order from customer.
- Add product to order.
- Resolve pricing and save order.
- Block save without pricing snapshot.
- Prevent cross-tenant order access.

## Acceptance Mapping

- See [Gherkin](order.feature).

