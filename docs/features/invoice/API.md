# Invoice API

## Purpose

Define the Phase 1 invoice API surface at documentation level only.

## Resources

- Invoice.
- Invoice item.
- Invoice snapshot.

## Commands

- Create invoice from order.
- Issue invoice.

## Queries

- Get invoice.
- List customer invoices.
- List order invoices.

## Validation

- Tenant context is required.
- Source order must be saved.
- Source order must contain pricing snapshots.
- Issued invoices cannot be edited.

## Related Documents

- [V1](VERSIONS/V1.md)
- [Order API](../order/API.md)

