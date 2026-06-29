# ADR-012 Multi-Tenant Strategy

## Status

Accepted for architecture hardening.

## Context

The product is a multi-tenant SaaS ERP. Multiple businesses (tenants) will use the same application instance while maintaining complete data isolation.

Multi-tenancy introduces several architectural challenges:
- Data isolation between tenants
- Tenant-specific configuration
- Tenant-aware authorization
- Tenant-scoped business logic
- Performance isolation
- Backup and restore per tenant

## Decision

The system will use a **shared database, shared schema** multi-tenancy strategy with row-level tenant isolation.

### Tenant Identification

**Methods:**
1. **Subdomain**: `tenant.example.com`
2. **Header**: `X-Tenant-Id` (for API clients)
3. **Authentication**: JWT token contains tenant claim

**Priority:**
1. Subdomain (primary for web UI)
2. Header (primary for API clients)
3. Authentication token (fallback)

### Data Isolation

**Database Strategy:**
- Single database instance
- Shared schema across tenants
- Every tenant-scoped table includes `tenant_id` column
- Row-level filtering enforced at application and database level

**Tenant-Scoped Tables:**
All business tables include `tenant_id`:
- customers
- products
- pricing
- orders
- invoices
- warehouse_requests
- shipments
- deliveries
- payments

**Shared Tables (No tenant_id):**
- tenants (tenant registry)
- system_config (system-wide configuration)
- roles (global roles, with tenant-specific overrides in future)
- permissions (global permissions)

### Query Enforcement

**Application-Level:**
- All queries must include `WHERE tenant_id = :tenantId`
- Tenant context extracted from request and passed to all data access
- Repository methods automatically filter by tenant

**Database-Level:**
- Row-level security (RLS) policies where supported
- Check constraints to prevent cross-tenant data access
- Foreign keys include tenant_id for referential integrity

**Example Schema:**
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  -- other fields
  CONSTRAINT fk_tenant FOREIGN KEY (tenant_id) REFERENCES tenants(id),
  CONSTRAINT uq_tenant_customer UNIQUE (tenant_id, id)
);

CREATE INDEX idx_customers_tenant ON customers(tenant_id);
```

### Tenant Context Propagation

**Request Context:**
- Tenant ID extracted from subdomain, header, or token
- Tenant ID validated against tenant registry
- Tenant ID stored in request context
- Tenant ID propagated to all downstream operations

**Event Context:**
- All business events include `tenant_id`
- Event consumers filter events by tenant
- Event store includes tenant_id for all events

**Background Jobs:**
- Jobs inherit tenant_id from triggering event
- Scheduled jobs include tenant_id in job context
- Job execution enforces tenant isolation

### Tenant Configuration

**Global Configuration:**
- System-wide settings (stored in system_config)
- Applies to all tenants
- Examples: feature flags, system defaults

**Tenant-Specific Configuration:**
- Tenant settings (stored in tenant_settings table)
- Overrides global configuration per tenant
- Examples: timezone, date format, currency

**Bootstrap Configuration:**
- YAML files provide default configuration
- Bootstrapped into database on first startup
- Database becomes source of truth
- Tenant-specific overrides stored in database

### Authorization

**Global Roles:**
- System administrator roles
- Apply across all tenants
- Bootstrapped from config/roles.yaml
- Managed through Role Management UI

**Tenant Roles:**
- Tenant-specific roles (future)
- Inherit from global roles
- Can add/remove permissions
- Managed per tenant

**Permission Evaluation:**
- Permissions evaluated within tenant context
- Users cannot access other tenants' data
- Tenant isolation enforced at authorization layer

### Performance Isolation

**Query Performance:**
- Tenant_id indexed on all tenant-scoped tables
- Query plans optimized for tenant filtering
- Connection pooling per tenant (optional for high-isolation needs)

**Resource Limits:**
- Per-tenant rate limits
- Per-tenant storage quotas (future)
- Per-tenant API quotas (future)

**Caching:**
- Cache keys include tenant_id
- Cache isolation per tenant
- Cache invalidation scoped to tenant

### Backup and Restore

**Backup Strategy:**
- Full database backup (includes all tenants)
- Per-tenant logical backup (export tenant-specific data)
- Point-in-time recovery per tenant

**Restore Strategy:**
- Restore entire database (all tenants)
- Restore single tenant (import tenant-specific data)
- Tenant isolation during restore

## Consequences

**Positive:**
- Complete data isolation between tenants
- Efficient resource utilization (shared infrastructure)
- Simplified deployment and maintenance
- Cost-effective for SaaS model
- Clear tenant boundaries in code

**Negative:**
- Requires strict discipline to maintain tenant filtering
- Potential for cross-tenant data leaks if not enforced
- Performance impact from tenant filtering
- More complex queries (always include tenant_id)
- Tenant-onboarding complexity

**Risks:**
- Accidental cross-tenant data access
- Performance degradation with many tenants
- Tenant data mixing in logs or monitoring
- Backup/restore complexity

## Implementation Guidelines

### Mandatory Rules

1. **Never omit tenant_id from queries** - All tenant-scoped queries must include tenant filter
2. **Never trust client-provided tenant_id** - Always validate against authenticated tenant
3. **Never expose tenant_id in URLs** - Use subdomain or authentication context
4. **Never mix tenant data in responses** - Ensure responses are tenant-scoped
5. **Never bypass tenant filtering for performance** - Use proper indexing instead

### Code Patterns

**Repository Pattern:**
```typescript
class CustomerRepository {
  async findByTenant(tenantId: string): Promise<Customer[]> {
    return this.db.query(
      "SELECT * FROM customers WHERE tenant_id = $1",
      [tenantId]
    );
  }

  async findById(tenantId: string, customerId: string): Promise<Customer> {
    return this.db.query(
      "SELECT * FROM customers WHERE tenant_id = $1 AND id = $2",
      [tenantId, customerId]
    );
  }
}
```

**Middleware Pattern:**
```typescript
function tenantMiddleware(req, res, next) {
  const tenantId = extractTenantId(req);
  if (!tenantId) {
    return res.status(400).json({ error: "Tenant context required" });
  }
  req.tenantId = tenantId;
  next();
}
```

**Event Pattern:**
```typescript
class EventPublisher {
  publish(event: DomainEvent) {
    const eventWithTenant = {
      ...event,
      tenantId: this.tenantContext.tenantId
    };
    this.eventStore.save(eventWithTenant);
  }
}
```

## Related Documentation

- [Data Ownership](../technical/DATA_OWNERSHIP.md) - Aggregate ownership with tenant context
- [Correlation ID](../technical/CORRELATION_ID.md) - Tenant context in correlation
- [API Standards](../technical/API_STANDARDS.md) - Tenant context in APIs
- [Authorization](../security/AUTHORIZATION.md) - Tenant-specific authorization
