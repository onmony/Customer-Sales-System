# Customer Workspace

## Purpose

The Customer Workspace describes the ideal customer-centered operating experience.

This is not analytics. It is operational context for fast, accurate order creation.

Related documents:

- [Vision](../VISION.md)
- [Customer Workspace ADR](../decisions/ADR-010-Customer-Workspace.md)
- [Navigation](../product/NAVIGATION.md)
- [Data Ownership](../technical/DATA_OWNERSHIP.md)
- [Role Matrix](../security/ROLE_MATRIX.md)

## Experience Goal

When opening a customer, an experienced salesperson should immediately know enough to create an accurate order in under one minute.

## What The Salesperson Should See

### Outstanding

Shows unpaid or open commercial exposure when Payment and Finance modules exist.

Purpose: prevents order creation without awareness of pending money.

### Credit Limit

Shows approved customer credit context when credit policy exists.

Purpose: supports responsible ordering without turning the product into accounting-first software.

### Last Order

Shows the most recent customer order.

Purpose: lets the salesperson quickly repeat or adapt a previous order.

### Frequently Ordered Products

Shows products the customer commonly buys.

Purpose: reduces search time and supports fast order creation.

### Current Pricing

Shows whether customer-specific pricing exists for commonly ordered products.

Purpose: makes price confidence visible before order save.

### Preferred Warehouse

Shows the warehouse usually used for this customer when the warehouse module exists.

Purpose: reduces operational handoff friction.

### Preferred Transport

Shows preferred carrier or transport method when shipment rules exist.

Purpose: helps avoid delivery mistakes.

### Quick Create Order

Primary action in the workspace.

Purpose: keeps the product optimized for order creation rather than invoice-first navigation.

### Recent Activity

Shows recent customer events:

- Customer updated.
- Pricing changed.
- Order created.
- Invoice issued.
- Shipment dispatched.
- Delivery confirmed.
- Payment received.

Purpose: gives operational awareness before action.

## What This Is Not

The Customer Workspace is not:

- A generic analytics dashboard.
- An accounting ledger.
- A report center.
- A replacement for module-specific screens.

It is an operational command center for one customer.

## Future AI Context

Future AI should use Customer Workspace context to explain:

- Why a price was selected.
- What the customer usually orders.
- Whether a similar order should be suggested.
- Whether operational risk exists.
- What action should happen next.

AI output must cite events, snapshots, and module-owned data.

