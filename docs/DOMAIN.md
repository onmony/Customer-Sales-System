# Domain

## Domain Summary

The product domain is customer relationship ERP for order-to-delivery operations.

The domain prioritizes customer management, order creation, customer-specific pricing, invoicing, warehouse handoff, shipment, delivery, and payment tracking.

## Primary Domain Flow

Customer -> Order -> Pricing Resolution -> Invoice -> Warehouse -> Shipment -> Delivery -> Payment

## Domain Boundaries

Accounting is part of the domain, but it is not the center of the product.

Customer-specific pricing is central to the domain and must be treated as a first-class business capability.

## Domain Constraints

- Multi-tenancy is required.
- Pricing is versioned.
- Pricing history must be preserved.
- Orders store immutable snapshots.
- Invoices are immutable.

## Related Documents

- [MASTER_SKILL](MASTER_SKILL.md)
- [VISION](VISION.md)
- [RULES](RULES.md)
- [PRINCIPLES](PRINCIPLES.md)
- [GLOSSARY](GLOSSARY.md)
- [ROADMAP](ROADMAP.md)
- [RELEASES](RELEASES.md)

