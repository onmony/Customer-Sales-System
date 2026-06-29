# Module Dependencies

## Purpose

This document defines allowed and forbidden module dependencies before database, API, and frontend implementation.

Related documents:

- [Domain](../DOMAIN.md)
- [Data Ownership](DATA_OWNERSHIP.md)
- [Events](EVENTS.md)
- [Customer Workspace ADR](../decisions/ADR-010-Customer-Workspace.md)

## Dependency Principle

Dependencies must follow the operational flow:

Customer -> Pricing -> Order -> Invoice -> Warehouse -> Shipment -> Delivery

Product is a referenced catalog module used by Pricing, Order, Warehouse, and Shipment.

## Allowed Dependencies

| Module | May Depend On | Reason |
| --- | --- | --- |
| Customer | Tenant, shared identity, shared audit | Customer is workflow center |
| Product | Tenant, shared identity, shared audit | Product is catalog context |
| Pricing | Customer ID, Product ID, Tenant | Pricing is customer-product specific |
| Order | Customer, Product, Pricing resolution, Tenant | Order composes selected customer, products, and pricing snapshots |
| Invoice | Saved Order snapshots, Tenant | Invoice is generated from order truth |
| Warehouse | Confirmed or saved Order, Product, Tenant | Warehouse prepares fulfillment |
| Shipment | Warehouse handoff, Order, Customer delivery context, Tenant | Shipment moves goods |
| Delivery | Shipment, Order, Customer context, Tenant | Delivery confirms receipt |
| Payment | Issued Invoice, Customer, Tenant | Payment settles invoice |

## Forbidden Dependencies

| Module | Must Not Depend On | Reason |
| --- | --- | --- |
| Customer | Invoice numbering, pricing calculation, warehouse allocation | Customer owns identity, not downstream policy |
| Product | Customer-specific pricing, invoice state, shipment state | Product owns catalog identity |
| Pricing | Order state, invoice state, warehouse state | Pricing should resolve price, not mutate workflows |
| Order | Invoice internals, warehouse internals, payment state | Order prepares handoff but does not own downstream modules |
| Invoice | Current pricing calculation, current product changes, current customer changes | Invoice must use snapshots |
| Warehouse | Pricing calculation, invoice mutation, payment collection | Warehouse owns fulfillment preparation |
| Shipment | Pricing calculation, invoice mutation, payment collection | Shipment owns movement |
| Delivery | Pricing calculation, invoice mutation | Delivery owns confirmation |
| Payment | Order mutation, shipment mutation | Payment owns settlement |

## Future Dependency Rules

- Use events for downstream reactions.
- Use snapshots for historical records.
- Do not reach across modules to mutate another aggregate.
- Do not let accounting become the root dependency of operational workflows.
- Customer Workspace may read from multiple modules but should not own their data.
- AI modules should consume events, snapshots, and read models rather than mutating source aggregates directly.

## Dependency Direction

```text
Customer
  -> Pricing
  -> Order
  -> Invoice
  -> Warehouse
  -> Shipment
  -> Delivery
  -> Payment

Product
  -> Pricing
  -> Order
  -> Warehouse
  -> Shipment
```

Customer Workspace is a read-and-action composition surface over customer-scoped modules.

## Dependency Graph

```text
                    ┌─────────────┐
                    │   Tenant    │
                    │   Shared    │
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │  Customer   │ │   Product   │ │  Identity   │
    │   Module    │ │   Module    │ │   Shared    │
    └──────┬──────┘ └──────┬──────┘ └─────────────┘
           │               │
           │               │
           ▼               ▼
    ┌─────────────┐ ┌─────────────┐
    │   Pricing   │◄─────────────┤
    │   Module    │               │
    └──────┬──────┘               │
           │                       │
           ▼                       │
    ┌─────────────┐               │
    │    Order    │◄──────────────┘
    │   Module    │
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐
    │   Invoice   │
    │   Module    │
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐
    │  Warehouse  │
    │   Module    │
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐
    │  Shipment   │
    │   Module    │
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐
    │  Delivery   │
    │   Module    │
    └──────┬──────┘
           │
           ▼
    ┌─────────────┐
    │   Payment   │
    │   Module    │
    └─────────────┘

Customer Workspace (Read Model)
    ├── Reads from: Customer, Order, Pricing, Invoice, Warehouse, Shipment
    └── Never writes to any module
```

## Circular Dependency Check

**Status:** No circular dependencies detected.

**Verification:**
- Customer → Pricing → Order → Invoice → Warehouse → Shipment → Delivery → Payment (linear flow)
- Product → Pricing → Order → Warehouse → Shipment (linear flow)
- Customer Workspace reads from multiple modules but does not write back
- All forbidden dependencies are respected

## Future Dependencies

### Phase 2: Warehouse & Shipment

**New Dependencies:**
- Warehouse → Product (for inventory checks)
- Shipment → Transport Types (for carrier selection)

**Still Forbidden:**
- Warehouse → Pricing (pricing calculation)
- Shipment → Invoice (invoice mutation)

### Phase 3: Finance & Accounting

**New Dependencies:**
- Payment → Bank Integration (external)
- Accounting → Invoice (read-only for reporting)

**Still Forbidden:**
- Accounting → Order (order mutation)
- Accounting → Pricing (pricing calculation)

### Phase 4: AI & Analytics

**New Dependencies:**
- AI Module → Events (read-only)
- AI Module → Read Models (read-only)
- Analytics Module → Events (read-only)
- Analytics Module → Read Models (read-only)

**Still Forbidden:**
- AI Module → Aggregates (direct mutation)
- Analytics Module → Aggregates (direct mutation)

### Phase 5: Integrations

**New Dependencies:**
- Integration Module → Events (read-only)
- Integration Module → API (external systems)

**Still Forbidden:**
- Integration Module → Aggregates (direct mutation without events)

