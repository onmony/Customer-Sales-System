# Data Ownership

## Purpose

This document defines aggregate ownership boundaries before database implementation. It does not define tables or persistence technology.

Related documents:

- [Vision](../VISION.md)
- [Domain](../DOMAIN.md)
- [Dependencies](DEPENDENCIES.md)
- [Events](EVENTS.md)
- [Customer Workspace ADR](../decisions/ADR-010-Customer-Workspace.md)

## Ownership Principles

- Every aggregate is tenant-scoped unless explicitly documented otherwise.
- Aggregates own their own mutable state.
- Aggregates may reference other aggregates by identity.
- Historical business documents preserve snapshots instead of reading current state.
- Immutable records must not be changed to reflect later source changes.

## Aggregate Ownership Matrix

| Aggregate | Owns | References | Cannot Modify | Snapshot Rules | Immutability Rules |
| --- | --- | --- | --- | --- | --- |
| Customer | Customer identity, contacts, addresses, customer operational context | Orders, invoices, pricing by ID or customer-scoped query | Product, Pricing, Order, Invoice, Warehouse, Shipment | Orders and invoices copy customer display context when required | Current customer may change; historical snapshots do not |
| Product | Product identity, active state, unit context after approval | Pricing, order items, invoice items by ID | Customer, Pricing, Order, Invoice, Warehouse, Shipment | Orders and invoices copy product display context when required | Current product may change; historical snapshots do not |
| Pricing | Customer-product price versions, current pricing resolution, pricing history | Customer ID, Product ID | Customer identity, Product identity, Order, Invoice | Order items copy resolved price and pricingVersionId | Pricing versions are append-only; order snapshots do not change |
| Order | Order header, order items, customer snapshot, product snapshots, pricing snapshots, invoice readiness | Customer ID, Product ID, Pricing version ID | Customer current data, Product current data, Pricing history, Invoice immutability | Saved orders preserve required snapshots | Saved order snapshot values must not be rewritten by source changes |
| Invoice | Invoice header, invoice items, invoice snapshots, issued state | Source order ID, customer snapshot, product snapshots, pricing snapshots | Customer, Product, Pricing, Order source data, Payment | Invoice copies from saved order snapshots | Issued invoice is immutable |
| Warehouse | Warehouse request, picking context, readiness state when implemented | Order ID, Product ID, Customer ID | Order pricing, Invoice, Payment | Warehouse may copy fulfillment-relevant order context | Warehouse events should not rewrite order or invoice snapshots |
| Shipment | Shipment plan, dispatch state, carrier or transport context when implemented | Order ID, Warehouse request ID, Customer delivery context | Order, Invoice, Payment, Product master | Shipment may copy delivery destination context | Dispatch history should be append-only |
| Delivery | Delivery confirmation, proof context when implemented | Shipment ID, Order ID, Customer ID | Shipment history, Invoice, Payment | Delivery may copy recipient or destination details | Delivery confirmation should be append-only |
| Payment | Payment receipt and settlement context when implemented | Invoice ID, Customer ID | Invoice amount, Invoice issued state, Order | Payment may copy invoice reference and amount due | Payment receipts should be append-only or corrected by reversal |

## Boundary Rules

- Customer cannot update order or invoice snapshots.
- Product cannot update order or invoice snapshots.
- Pricing cannot update saved order or issued invoice prices.
- Order cannot change current customer, product, or pricing records.
- Invoice cannot modify source order after creation.
- Warehouse, Shipment, Delivery, and Payment must not rewrite issued invoices.

## Database Implications Later

When persistence begins:

- Tenant-owned records need `tenant_id`.
- Snapshot columns should store copied values, not only foreign keys.
- Pricing versions should be append-only.
- Issued invoices should be protected by application and database-level immutability rules.
- Foreign keys should support traceability, but historical truth should live in snapshots.

