# Correlation ID

## Purpose

Correlation IDs provide traceability across the system by linking requests, events, and operations together. This enables debugging, auditing, and operational monitoring without implementing full distributed tracing.

Related documents:

- [Vision](../VISION.md)
- [Business Events](EVENTS.md)
- [Data Ownership](DATA_OWNERSHIP.md)
- [Dependencies](DEPENDENCIES.md)
- [API Standards](API_STANDARDS.md)

## Philosophy

Correlation IDs are a lightweight traceability mechanism. They are not distributed tracing with spans, latency tracking, or service maps. They are simple identifiers that allow us to:

- Trace a user request through the system
- Link events to the request that caused them
- Debug issues by following the correlation chain
- Audit operations by tracking causality
- Monitor system behavior without complex instrumentation

## Request Context

Every HTTP request should carry the following context:

### RequestId

A unique identifier for the current HTTP request.

**Format:** UUID v4

**Purpose:** Uniquely identify this specific request for logging and debugging.

**Generation:** Generated at API gateway or first entry point.

**Propagation:** Propagated to all downstream services and operations.

**Lifetime:** Single HTTP request.

### CorrelationId

A unique identifier that links related operations together.

**Format:** UUID v4

**Purpose:** Trace a user-initiated operation across multiple requests, events, and background jobs.

**Generation:**
- If present in incoming request (from client), use it
- If not present, generate new UUID at entry point

**Propagation:** Propagated to all downstream services, events, and background jobs.

**Lifetime:** Entire user operation (may span multiple requests).

**Example:** A user creates an order, which triggers pricing resolution, invoice generation, and warehouse request. All share the same CorrelationId.

### TenantId

The tenant identifier for multi-tenant isolation.

**Format:** UUID v4 or string (depending on tenant ID format)

**Purpose:** Ensure all operations are tenant-scoped and isolated.

**Generation:** Extracted from authentication context or subdomain.

**Propagation:** Propagated to all database queries, events, and operations.

**Lifetime:** Entire user session.

### UserId

The user identifier when authenticated.

**Format:** UUID v4 or string (depending on user ID format)

**Purpose:** Track which user initiated the operation for audit and authorization.

**Generation:** Extracted from authentication context.

**Propagation:** Propagated to all authorization checks, audit logs, and events.

**Lifetime:** Entire user session.

## Event Context

Every business event should contain the following context:

### EventId

A unique identifier for the event itself.

**Format:** UUID v4

**Purpose:** Uniquely identify this event for deduplication and idempotency.

**Generation:** Generated when event is created.

**Lifetime:** Permanent (stored in event store).

### CorrelationId

The correlation ID from the request that caused this event.

**Format:** UUID v4

**Purpose:** Link this event to the user operation that caused it.

**Generation:** Inherited from request context.

**Lifetime:** Permanent (stored in event store).

### CausationId

The ID of the event or request that directly caused this event.

**Format:** UUID v4 (could be EventId or RequestId)

**Purpose:** Track the causal chain of events.

**Generation:** Set to the EventId of the triggering event, or RequestId if triggered directly by request.

**Lifetime:** Permanent (stored in event store).

**Causation Chain Example:**
```
Request (RequestId: R1, CorrelationId: C1)
  → OrderCreated Event (EventId: E1, CorrelationId: C1, CausationId: R1)
    → InvoiceGenerated Event (EventId: E2, CorrelationId: C1, CausationId: E1)
      → WarehouseRequestCreated Event (EventId: E3, CorrelationId: C1, CausationId: E2)
```

### TenantId

The tenant identifier for multi-tenant isolation.

**Format:** UUID v4 or string

**Purpose:** Ensure events are tenant-scoped.

**Generation:** Inherited from request context.

**Lifetime:** Permanent (stored in event store).

### Timestamp

When the event occurred.

**Format:** ISO 8601 UTC (e.g., 2026-06-29T08:30:00Z)

**Purpose:** Track when the event happened for ordering and audit.

**Generation:** Set when event is created.

**Lifetime:** Permanent (stored in event store).

### ActorId

The user or system that caused the event.

**Format:** UUID v4 (user ID) or string (system name)

**Purpose:** Track who or what initiated the event.

**Generation:** Extracted from UserId in request context, or set to "system" for background jobs.

**Lifetime:** Permanent (stored in event store).

### Source

The service or component that produced the event.

**Format:** String (e.g., "order-service", "pricing-service")

**Purpose:** Identify the source of the event for debugging and monitoring.

**Generation:** Set by the service producing the event.

**Lifetime:** Permanent (stored in event store).

## HTTP Headers

### Incoming Request Headers

Clients may include correlation context in HTTP headers:

```
X-Request-Id: <uuid>
X-Correlation-Id: <uuid>
X-Tenant-Id: <uuid>
```

**Behavior:**
- If client provides RequestId, use it
- If client provides CorrelationId, use it
- If client provides TenantId, validate it against authenticated tenant
- If headers are missing, generate appropriate values

### Outgoing Request Headers

When making downstream HTTP requests, include correlation context:

```
X-Request-Id: <new-uuid-for-this-request>
X-Correlation-Id: <inherited-correlation-id>
X-Tenant-Id: <inherited-tenant-id>
X-User-Id: <inherited-user-id>
```

**Behavior:**
- Generate new RequestId for each downstream request
- Inherit CorrelationId from current request
- Inherit TenantId from current request
- Inherit UserId from current request if authenticated

## Logging

### Log Format

All log entries should include correlation context:

```json
{
  "timestamp": "2026-06-29T08:30:00Z",
  "level": "info",
  "message": "Order created",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "correlationId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "tenantId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "userId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "service": "order-service",
  "context": {
    "orderId": "12345",
    "customerId": "67890"
  }
}
```

### Log Levels

**Error:** Include full correlation context
**Warning:** Include full correlation context
**Info:** Include CorrelationId and RequestId
**Debug:** Include full correlation context

### Structured Logging

Use structured logging (JSON) to enable correlation-based log aggregation and filtering.

## Database Context

### Query Context

All database queries should include tenant context:

```sql
-- Implicit tenant filtering via WHERE clause
SELECT * FROM customers
WHERE tenant_id = :tenantId
  AND customer_id = :customerId;
```

**Never rely on application-level filtering alone for tenant isolation.**

### Audit Fields

All database tables should include audit fields:

```sql
created_at TIMESTAMP
created_by VARCHAR(100) -- user ID or system
updated_at TIMESTAMP
updated_by VARCHAR(100) -- user ID or system
tenant_id UUID -- for multi-tenant tables
```

### Transaction Context

Within a database transaction, maintain correlation context:

- Set application-level context variables for the transaction
- Include correlation context in trigger logs
- Include correlation context in constraint violation messages

## Background Jobs

### Job Context

Background jobs should inherit correlation context from the triggering event:

```json
{
  "jobId": "job-12345",
  "correlationId": "inherited-from-event",
  "tenantId": "inherited-from-event",
  "actorId": "system",
  "triggerEventId": "event-that-triggered-job"
}
```

**Behavior:**
- Jobs triggered by events inherit CorrelationId from event
- Jobs triggered by schedule use new CorrelationId
- Jobs triggered by API request inherit CorrelationId from request
- ActorId is set to "system" for background jobs

### Job Logging

Background job logs should include correlation context:

```json
{
  "timestamp": "2026-06-29T08:30:00Z",
  "level": "info",
  "message": "Invoice generation job started",
  "jobId": "job-12345",
  "correlationId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "tenantId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "triggerEventId": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Error Handling

### Error Context

All errors should include correlation context:

```json
{
  "error": "Order creation failed",
  "errorCode": "ORDER_CREATE_FAILED",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "correlationId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "tenantId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "userId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "timestamp": "2026-06-29T08:30:00Z"
}
```

### Error Tracking

When tracking errors in monitoring systems:
- Group by CorrelationId to see related errors
- Group by RequestId to see request-specific errors
- Include correlation context in error alerts

## Monitoring

### Metrics

Correlation-based metrics to track:

- Requests per CorrelationId (to detect request storms)
- Events per CorrelationId (to detect event storms)
- Error rate per CorrelationId (to detect problematic operations)
- Latency per CorrelationId (to detect slow operations)

### Dashboards

Create dashboards that show:
- Active correlation chains
- Correlation chains with errors
- Long-running correlation chains
- High-volume correlation chains

## Security Considerations

### Tenant Isolation

- Never allow CorrelationId to bypass tenant isolation
- Always validate TenantId in correlation context
- Never expose CorrelationId across tenant boundaries

### Privacy

- Correlation IDs are not personally identifiable
- Correlation IDs can be exposed in logs and monitoring
- Do not include sensitive data in correlation context

### Injection

- Validate CorrelationId format (UUID)
- Reject malformed correlation IDs
- Generate new CorrelationId if validation fails

## Implementation Guidelines

### Middleware

Create middleware to:
- Extract correlation context from incoming requests
- Generate missing correlation IDs
- Propagate correlation context to outgoing requests
- Add correlation context to logs
- Add correlation context to error responses

### Event Publishing

When publishing events:
- Include full event context (EventId, CorrelationId, CausationId, etc.)
- Inherit CorrelationId from current request
- Set CausationId to triggering event or request
- Set ActorId from current user or "system"

### Database Access

When accessing database:
- Always include TenantId in queries
- Include correlation context in audit logs
- Use application-level context for transaction tracking

## Testing

### Unit Tests

Test that:
- Correlation IDs are generated when missing
- Correlation IDs are propagated correctly
- Tenant context is validated
- Event context is complete

### Integration Tests

Test that:
- Correlation chains span multiple services
- Background jobs inherit correlation context
- Logs include correlation context
- Errors include correlation context

### Manual Testing

Manual test scenarios:
- Trace a user operation through the system using CorrelationId
- Verify logs are correlated correctly
- Verify events are linked correctly
- Verify errors are correlated correctly

## Cross References

- [Business Events](EVENTS.md) - Event context structure
- [API Standards](API_STANDARDS.md) - API header propagation
- [Data Ownership](DATA_OWNERSHIP.md) - Tenant isolation
