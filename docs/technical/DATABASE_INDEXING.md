# Database Indexing Strategy

## Purpose

This document defines the logical indexing strategy for database tables. This is documentation only - no SQL, migrations, or DDL.

Related documents:

- [Performance Budgets](PERFORMANCE_BUDGETS.md)
- [Multi-Tenant Strategy](../decisions/ADR-012-Multi-Tenant-Strategy.md)
- [Data Ownership](DATA_OWNERSHIP.md)

## Indexing Principles

- Every tenant-scoped table must have an index on `tenant_id`
- Foreign keys must be indexed
- Frequently queried fields must be indexed
- Composite indexes for common query patterns
- Avoid over-indexing (indexes have write overhead)

## Customer Table

### Primary Index

- `id` (primary key)

### Tenant Index

- `tenant_id` (for tenant isolation)

### Search Indexes

- `tenant_id + name` (composite, for name search)
- `tenant_id + gst` (composite, for GST search)
- `tenant_id + mobile` (composite, for mobile search)
- `tenant_id + customer_code` (composite, for customer code search)

### Foreign Key Indexes

- `tenant_id` (references tenants table)

## Product Table

### Primary Index

- `id` (primary key)

### Tenant Index

- `tenant_id` (for tenant isolation)

### Search Indexes

- `tenant_id + sku` (composite, for SKU search)
- `tenant_id + name` (composite, for name search)

### Foreign Key Indexes

- `tenant_id` (references tenants table)

## Pricing Table

### Primary Index

- `id` (primary key)

### Tenant Index

- `tenant_id` (for tenant isolation)

### Resolution Indexes

- `tenant_id + customer_id + product_id + effective_date` (composite, for pricing resolution)
- `tenant_id + customer_id + product_id` (composite, for customer-product pricing list)
- `tenant_id + product_id + effective_date` (composite, for product pricing list)

### Foreign Key Indexes

- `tenant_id` (references tenants table)
- `customer_id` (references customers table)
- `product_id` (references products table)

## Order Table

### Primary Index

- `id` (primary key)

### Tenant Index

- `tenant_id` (for tenant isolation)

### Query Indexes

- `tenant_id + customer_id + created_at` (composite, for customer order list)
- `tenant_id + status + created_at` (composite, for status-based order list)
- `tenant_id + created_at` (composite, for chronological order list)

### Foreign Key Indexes

- `tenant_id` (references tenants table)
- `customer_id` (references customers table)

## Order Item Table

### Primary Index

- `id` (primary key)

### Tenant Index

- `tenant_id` (for tenant isolation)

### Query Indexes

- `tenant_id + order_id` (composite, for order item lookup)
- `tenant_id + product_id` (composite, for product order history)

### Foreign Key Indexes

- `tenant_id` (references tenants table)
- `order_id` (references orders table)
- `product_id` (references products table)

## Invoice Table

### Primary Index

- `id` (primary key)

### Tenant Index

- `tenant_id` (for tenant isolation)

### Query Indexes

- `tenant_id + invoice_number` (composite, for invoice number lookup)
- `tenant_id + customer_id + issued_at` (composite, for customer invoice list)
- `tenant_id + status + issued_at` (composite, for status-based invoice list)

### Foreign Key Indexes

- `tenant_id` (references tenants table)
- `customer_id` (references customers table)
- `order_id` (references orders table)

## Invoice Item Table

### Primary Index

- `id` (primary key)

### Tenant Index

- `tenant_id` (for tenant isolation)

### Query Indexes

- `tenant_id + invoice_id` (composite, for invoice item lookup)

### Foreign Key Indexes

- `tenant_id` (references tenants table)
- `invoice_id` (references invoices table)

## Warehouse Request Table

### Primary Index

- `id` (primary key)

### Tenant Index

- `tenant_id` (for tenant isolation)

### Query Indexes

- `tenant_id + order_id` (composite, for order warehouse request lookup)
- `tenant_id + status + created_at` (composite, for status-based warehouse request list)

### Foreign Key Indexes

- `tenant_id` (references tenants table)
- `order_id` (references orders table)

## Shipment Table

### Primary Index

- `id` (primary key)

### Tenant Index

- `tenant_id` (for tenant isolation)

### Query Indexes

- `tenant_id + order_id` (composite, for order shipment lookup)
- `tenant_id + status + created_at` (composite, for status-based shipment list)

### Foreign Key Indexes

- `tenant_id` (references tenants table)
- `order_id` (references orders table)
- `warehouse_request_id` (references warehouse_requests table)

## Delivery Table

### Primary Index

- `id` (primary key)

### Tenant Index

- `tenant_id` (for tenant isolation)

### Query Indexes

- `tenant_id + shipment_id` (composite, for shipment delivery lookup)
- `tenant_id + status + created_at` (composite, for status-based delivery list)

### Foreign Key Indexes

- `tenant_id` (references tenants table)
- `shipment_id` (references shipments table)

## Payment Table

### Primary Index

- `id` (primary key)

### Tenant Index

- `tenant_id` (for tenant isolation)

### Query Indexes

- `tenant_id + invoice_id + received_at` (composite, for invoice payment history)
- `tenant_id + customer_id + received_at` (composite, for customer payment history)

### Foreign Key Indexes

- `tenant_id` (references tenants table)
- `invoice_id` (references invoices table)
- `customer_id` (references customers table)

## Event Store Table (Future)

### Primary Index

- `id` (primary key)

### Tenant Index

- `tenant_id` (for tenant isolation)

### Query Indexes

- `tenant_id + aggregate_type + aggregate_id + timestamp` (composite, for aggregate event history)
- `tenant_id + event_type + timestamp` (composite, for event type filtering)
- `tenant_id + correlation_id` (composite, for correlation-based event lookup)

### Foreign Key Indexes

- `tenant_id` (references tenants table)

## Customer Workspace Read Model Table (Future)

### Primary Index

- `id` (primary key)

### Tenant Index

- `tenant_id` (for tenant isolation)

### Query Indexes

- `tenant_id + customer_id` (composite, for workspace lookup)
- `tenant_id + last_activity` (composite, for active customer sorting)

### Foreign Key Indexes

- `tenant_id` (references tenants table)
- `customer_id` (references customers table)

## Index Maintenance

### Index Monitoring

- Monitor index usage statistics
- Identify unused indexes
- Identify missing indexes from slow queries

### Index Optimization

- Rebuild indexes when fragmentation high
- Consider partial indexes for selective queries
- Consider expression indexes for computed fields

## Related Documents

- [Performance Budgets](PERFORMANCE_BUDGETS.md) - Performance targets supported by indexing
- [Multi-Tenant Strategy](../decisions/ADR-012-Multi-Tenant-Strategy.md) - Tenant isolation requirements
- [Data Ownership](DATA_OWNERSHIP.md) - Aggregate ownership boundaries
