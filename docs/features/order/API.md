# Order API

## Purpose

Define the Phase 1 order API surface at documentation level only.

## Resources

- Order.
- Order item.
- Order item pricing snapshot.

## Commands

- Create order.
- Add order item.
- Remove order item.
- Save order.
- Create invoice from order.

## Queries

- Get order.
- List customer orders.

## Validation

- Tenant context is required.
- Customer is required.
- At least one order item is required to save.
- Pricing snapshot is required for every saved order item.

## Related Documents

- [V1](VERSIONS/V1.md)
- [Pricing API](../pricing/API.md)
- [Invoice API](../invoice/API.md)

