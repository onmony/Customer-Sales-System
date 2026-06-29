# Customer Workspace

## Purpose

The Customer Workspace describes the ideal customer-centered operating experience.

This is not analytics. It is operational context for fast, accurate order creation.

**The Customer Workspace is a READ MODEL.** It composes data from multiple aggregates but does not own any of it. It provides a unified operational view without violating aggregate boundaries.

Related documents:

- [Vision](../VISION.md)
- [Customer Workspace ADR](../decisions/ADR-010-Customer-Workspace.md)
- [Navigation](../product/NAVIGATION.md)
- [Data Ownership](../technical/DATA_OWNERSHIP.md)
- [Dependencies](../technical/DEPENDENCIES.md)
- [Authorization](../security/AUTHORIZATION.md)

## Experience Goal

When opening a customer, an experienced salesperson should immediately know enough to create an accurate order in under one minute.

## READ MODEL Architecture

The Customer Workspace is a composition surface that reads from multiple aggregates:

- **Customer Aggregate**: Customer identity, contacts, addresses, operational preferences
- **Order Aggregate**: Recent orders, order status, order snapshots
- **Pricing Aggregate**: Current pricing status, pricing history, frequently ordered products
- **Invoice Aggregate**: Outstanding balance, recent invoices, invoice status (future)
- **Warehouse Aggregate**: Preferred warehouse, warehouse readiness (future)
- **Shipment Aggregate**: Preferred transport, shipment status (future)

### Data Ownership Rules

The Customer Workspace:
- **READS** from Customer, Order, Pricing, Invoice, Warehouse, Shipment aggregates
- **NEVER WRITES** to any aggregate
- **NEVER OWNS** data from other aggregates
- **MAY CACHE** composed views for performance
- **MAY REFRESH** cache when source aggregates change

### Cache Invalidation

The workspace cache should be invalidated when:
- Customer aggregate is updated
- Order is created or status changes
- Pricing is created or changed
- Invoice is issued or status changes
- Warehouse readiness changes
- Shipment status changes

## Workspace Components

### Overview Section

The overview section is the primary operational dashboard for the customer. It displays:

- Outstanding balance (from Invoice aggregate)
- Credit status (from Customer aggregate)
- Last order (from Order aggregate)
- Current pricing status (from Pricing aggregate)
- Preferred warehouse (from Customer aggregate)
- Preferred transport (from Customer aggregate)
- Frequently ordered products (derived from Order aggregate)
- Recent activity timeline (composed from multiple aggregates)
- Quick actions (navigation to other modules)

### Data Freshness Strategy

The workspace must balance performance with data accuracy:

**Real-Time Data (always fresh):**
- Customer identity and contact information
- Current pricing status
- Outstanding balance
- Credit status

**Near Real-Time Data (cached with short TTL):**
- Recent orders (cache TTL: 5 minutes)
- Frequently ordered products (cache TTL: 15 minutes)
- Preferred warehouse/transport (cache TTL: 30 minutes)

**Periodic Data (cached with longer TTL):**
- Historical pricing (cache TTL: 1 hour)
- Activity timeline (cache TTL: 10 minutes)

**Loading Strategy:**
1. Load customer identity immediately (critical path)
2. Load overview data in parallel (non-blocking)
3. Load detailed data on tab switch (lazy loading)
4. Refresh cache on user action or explicit refresh

### Empty States

When data is not available, show helpful empty states:

**No Orders:**
- "No orders yet for this customer"
- Quick action: "Create first order"

**No Pricing:**
- "No customer-specific pricing configured"
- Quick action: "Set up pricing"
- Fallback: Show standard catalog pricing

**No Outstanding Balance:**
- "No outstanding invoices"
- Positive reinforcement: "Customer is in good standing"

**No Recent Activity:**
- "No recent activity"
- Context: "Activity will appear here as orders, invoices, and shipments are created"

### Quick Actions

Primary quick actions in the workspace:

**Order Actions:**
- Create new order (primary action)
- Repeat last order
- Add product to new order

**Pricing Actions:**
- View current pricing
- View pricing history
- Request pricing change

**Invoice Actions:**
- View outstanding invoices (future)
- Generate invoice from order (future)

**Customer Actions:**
- Edit customer details
- Add contact
- Add address
- Attach document

**Communication Actions:**
- Send email (future)
- Log call (future)
- Schedule follow-up (future)

### Recent Activity Timeline

The activity timeline shows a chronological feed of customer-related events:

**Event Types:**
- Customer created/updated
- Pricing created/changed
- Order created/confirmed
- Invoice issued
- Warehouse request created
- Shipment dispatched
- Delivery confirmed
- Payment received
- Document attached
- Note added

**Timeline Display:**
- Group by day
- Show most recent first
- Limit to last 50 events
- Show event type icon
- Show event description
- Show timestamp
- Link to source record where applicable

**Data Source:**
- Composed from events in [Business Events](../technical/EVENTS.md)
- Read from event store or materialized view
- Cached with 10-minute TTL

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
- A data owner for any aggregate.

It is an operational command center for one customer that READS from multiple aggregates but WRITES to none.

## Future AI Context

Future AI should use Customer Workspace context to explain:

- Why a price was selected.
- What the customer usually orders.
- Whether a similar order should be suggested.
- Whether operational risk exists.
- What action should happen next.

AI output must cite events, snapshots, and module-owned data.

