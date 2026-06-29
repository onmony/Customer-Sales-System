# Performance Budgets

## Purpose

This document defines measurable performance targets for critical operations. These are architectural targets to guide implementation and optimization.

Related documents:

- [API Standards](API_STANDARDS.md)
- [Customer Workspace Read Model ADR](../decisions/ADR-013-Customer-Workspace-Read-Model.md)
- [Multi-Tenant Strategy](../decisions/ADR-012-Multi-Tenant-Strategy.md)

## Performance Targets

### Customer Search

**Target:** < 500ms (p95)

**Scope:** Search customers by name, GST, mobile, or customer code

**Measurement:** From API request to response

**Assumptions:**
- Database indexed on name, GST, mobile
- Tenant filtering applied
- Pagination limited to 50 results per page
- Cache not used (fresh data required)

**Optimization Strategies:**
- Database indexes on search fields
- Full-text search for name search
- Tenant-scoped query optimization

### Pricing Resolution

**Target:** < 100ms (p95)

**Scope:** Resolve price for a single customer-product pair

**Measurement:** From pricing request to resolved price response

**Assumptions:**
- Pricing version lookup by customer ID and product ID
- Effective date filtering
- Tenant filtering applied
- Cache may be used for frequently accessed prices

**Optimization Strategies:**
- Composite index on (tenant_id, customer_id, product_id, effective_date)
- In-memory cache for current active prices
- Read model for frequently accessed customer-product pairs

### Customer Workspace Load

**Target:** < 1 second (p95)

**Scope:** Load Customer Workspace overview for a single customer

**Measurement:** From workspace request to complete overview response

**Assumptions:**
- Customer identity loaded immediately (critical path)
- Overview data loaded in parallel (non-blocking)
- Cached data used where acceptable
- READ MODEL may be used for composed data

**Optimization Strategies:**
- READ MODEL for composed workspace data
- Multi-level caching with appropriate TTLs
- Parallel loading of non-critical data
- Lazy loading of detailed tab data

### Create Order

**Target:** < 2 seconds (p95)

**Scope:** Create and save a new order with pricing resolution

**Measurement:** From order creation request to order saved response

**Assumptions:**
- Order includes up to 20 line items
- Pricing resolution for each line item
- Customer validation
- Product validation
- Order snapshot creation

**Optimization Strategies:**
- Batch pricing resolution for multiple line items
- Cached pricing data
- Optimized snapshot creation
- Transaction optimization

### Invoice Generation

**Target:** < 5 seconds (p95)

**Scope:** Generate invoice from confirmed order

**Measurement:** From invoice generation request to invoice saved response

**Assumptions:**
- Order includes up to 50 line items
- Invoice number generation
- Tax calculation
- Invoice snapshot creation
- Invoice issuance

**Optimization Strategies:**
- Optimized snapshot copying from order
- Cached tax rules
- Efficient invoice number generation
- Transaction optimization

### Import Validation

**Target:** < 30 seconds for 10,000 rows (p95)

**Scope:** Validate import data (customers, products, or pricing)

**Measurement:** From import upload to validation complete response

**Assumptions:**
- Asynchronous validation for large imports
- Progress reporting for long-running imports
- Row-level validation
- Duplicate detection

**Optimization Strategies:**
- Batch validation
- Parallel processing where safe
- Cached reference data (customers, products)
- Efficient duplicate detection

### Global Search

**Target:** < 500ms (p95)

**Scope:** Search across customers, products, orders, invoices

**Measurement:** From search request to search results response

**Assumptions:**
- Search limited to 100 results
- Tenant filtering applied
- Permission filtering applied
- Relevance ranking applied

**Optimization Strategies:**
- Full-text search indexes
- Search-specific read models
- Cached frequent searches
- Result pagination

### Order List

**Target:** < 500ms (p95)

**Scope:** List orders with filters and pagination

**Measurement:** From order list request to response

**Assumptions:**
- Pagination limited to 50 results per page
- Filters: customer, status, date range
- Tenant filtering applied
- Sorting applied

**Optimization Strategies:**
- Database indexes on filter fields
- Composite indexes for common filter combinations
- Cached recent order lists
- Optimized query plans

### Invoice List

**Target:** < 500ms (p95)

**Scope:** List invoices with filters and pagination

**Measurement:** From invoice list request to response

**Assumptions:**
- Pagination limited to 50 results per page
- Filters: customer, status, date range
- Tenant filtering applied
- Sorting applied

**Optimization Strategies:**
- Database indexes on filter fields
- Composite indexes for common filter combinations
- Cached recent invoice lists
- Optimized query plans

### Pricing History

**Target:** < 500ms (p95)

**Scope:** Retrieve pricing history for a customer-product pair

**Measurement:** From pricing history request to response

**Assumptions:**
- Up to 100 pricing versions
- Tenant filtering applied
- Chronological ordering

**Optimization Strategies:**
- Index on (tenant_id, customer_id, product_id, effective_date)
- Pagination for large history
- Cached recent pricing history

## Performance Monitoring

### Metrics to Track

- Request latency (p50, p95, p99)
- Database query duration
- Cache hit rate
- Error rate
- Timeout rate

### Performance Budget Enforcement

- Automated performance tests in CI/CD
- Performance regression detection
- Alerting when budgets exceeded
- Performance dashboards for monitoring

## Performance Testing Strategy

### Load Testing

- Simulate expected load patterns
- Test with 100, 1,000, 10,000 customers
- Test with 10,000, 100,000 orders
- Identify bottlenecks before production

### Stress Testing

- Test beyond expected load
- Identify failure points
- Test graceful degradation

### Performance Regression Testing

- Baseline performance measurements
- Automated performance tests
- Regression detection in CI/CD

## Related Documents

- [Database Indexing](DATABASE_INDEXING.md) - Indexing strategy to support performance targets
- [API Standards](API_STANDARDS.md) - API performance conventions
- [Customer Workspace Read Model ADR](../decisions/ADR-013-Customer-Workspace-Read-Model.md) - Workspace performance strategy
