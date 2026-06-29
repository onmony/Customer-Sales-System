# Navigation

## Purpose

Navigation should optimize customer-centered order creation, not accounting-first workflows.

Related documents:

- [Vision](../VISION.md)
- [Customer Workspace ADR](../decisions/ADR-010-Customer-Workspace.md)
- [Customer Workspace Business Context](../business/CUSTOMER_WORKSPACE.md)
- [Role Matrix](../security/ROLE_MATRIX.md)

## Navigation Hierarchy

```text
Dashboard
  Customers
    Customer Workspace
      Overview
      Orders
      Pricing
      Invoices
      Warehouse
      Documents
      Notes
      Future AI
```

## Navigation Principles

- Customer is the primary operational entry point.
- Navigation should reduce time to accurate order creation.
- Accounting should not dominate the primary workflow.
- Operational context should be available before the salesperson creates an order.
- Module pages may exist, but customer-scoped views are the main working surface.
- Breadcrumbs must preserve customer context.

## Breadcrumbs

Examples:

- `Dashboard / Customers`
- `Dashboard / Customers / Aarav Retail Mart / Overview`
- `Dashboard / Customers / Aarav Retail Mart / Orders / New Order`
- `Dashboard / Customers / Aarav Retail Mart / Pricing`
- `Dashboard / Customers / Aarav Retail Mart / Invoices / Invoice Detail`
- `Dashboard / Customers / Aarav Retail Mart / Warehouse`

## Page Responsibilities

### Dashboard

Shows operational priorities and entry points. It should direct users to customer work, not accounting ledgers.

### Customers

Search, filter, and select customers. This is the doorway into operational work.

### Customer Workspace

Customer-scoped command center. It contains overview signals, tabs, and quick actions.

### Overview

Shows operational context:

- Outstanding.
- Credit limit.
- Last order.
- Frequently ordered products.
- Current pricing status.
- Preferred warehouse.
- Preferred transport.
- Recent activity.
- Quick create order.

### Orders

Create and view customer orders. Orders must preserve customer, product, and pricing snapshots.

### Pricing

View customer-specific prices and pricing history for the selected customer.

### Invoices

View invoices generated from the customer's orders. Invoice-first navigation should not replace customer-first navigation.

### Warehouse

Future customer-scoped warehouse readiness and handoff view.

### Documents

Customer-related documents, including future order and invoice attachments.

### Notes

Operational notes for sales and service context.

### Future AI

Future AI suggestions, risks, and next-best actions. This tab must explain recommendations using event and snapshot provenance.

## Future Extensibility

Future modules should extend the Customer Workspace with customer-scoped panels or tabs:

- Shipment
- Delivery
- Payment
- Returns
- Service cases
- AI suggestions

Global module navigation may exist for administrators and managers, but daily sales workflow should remain customer-first.

