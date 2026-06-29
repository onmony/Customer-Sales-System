# ADR-010 Customer Workspace

## Status

Accepted for architecture hardening.

## Context

The product is a Customer Relationship ERP. The customer is the center of the system, and the primary workflow is:

Customer -> Order -> Pricing Resolution -> Invoice -> Warehouse -> Shipment -> Delivery

Accounting is only one module. Navigation must optimize operational order creation rather than invoice-first or accounting-first work.

## Decision

The Customer Workspace is the primary operational entry point for sales and service workflows.

When a user opens a customer, the workspace should expose the operational context and actions needed to create an accurate order quickly.

## Purpose

The Customer Workspace gives a salesperson one place to understand the customer, resolve pricing context, create orders, review invoices, coordinate warehouse handoff, and see recent operational activity.

The target experience is that an experienced salesperson can create an accurate order in under one minute.

## Navigation

Primary navigation should lead users toward:

Dashboard -> Customers -> Customer Workspace

The Customer Workspace then organizes operational modules around the selected customer.

## Overview

The workspace overview should show operational context, not analytics-first dashboards.

Expected overview signals:

- Outstanding amount.
- Credit limit.
- Last order.
- Frequently ordered products.
- Current pricing status.
- Preferred warehouse.
- Preferred transport.
- Quick create order.
- Recent activity.

## Tabs

The initial Customer Workspace tab model is:

- Overview
- Orders
- Pricing
- Invoices
- Warehouse
- Documents
- Notes
- Future AI

Tabs must remain customer-scoped. A tab should not become a global module screen hidden inside the customer page.

## Actions

Primary actions:

- Quick create order.
- Add product to order.
- View current customer pricing.
- View pricing history.
- Generate invoice from eligible order.
- View warehouse readiness when the warehouse module exists.
- View recent activity.

Secondary actions:

- Update customer.
- Add contact.
- Add address.
- Attach document.
- Add note.

Actions that depend on unresolved policy must remain gated until the policy is documented.

## Why This Is Better Than Invoice-First Navigation

Invoice-first navigation starts after the commercial decision has already happened.

Customer-first navigation starts where the salesperson works:

- Who is buying?
- What do they usually buy?
- What price applies to this customer?
- What was their last order?
- Are there outstanding issues?
- Can the order be created accurately now?

This reduces context switching and supports the product goal of fast, accurate order creation.

## Future Extensibility

The Customer Workspace can absorb future modules without changing the product center:

- Warehouse readiness.
- Shipment tracking.
- Delivery confirmations.
- Payments.
- Customer documents.
- AI suggestions.
- Risk signals.
- Next-best action.

Future modules should add customer-scoped tabs or panels rather than replacing the customer workspace with module-first navigation.

## Consequences

- Customer becomes the main workflow anchor.
- Operational modules should support customer-scoped views.
- API and frontend design should preserve customer context.
- Future database models should support efficient customer-scoped queries.
- Permissions must be evaluated both by module and by customer-scoped action.

## Related Documentation

- [Vision](../VISION.md)
- [Customer Workspace Business Context](../business/CUSTOMER_WORKSPACE.md)
- [Navigation](../product/NAVIGATION.md)
- [Data Ownership](../technical/DATA_OWNERSHIP.md)
- [Dependencies](../technical/DEPENDENCIES.md)
- [Role Matrix](../security/ROLE_MATRIX.md)

