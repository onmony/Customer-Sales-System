# ADR-017 Correlation ID Strategy

## Status

Accepted for architecture hardening.

## Context

The system needs traceability across requests, events, and operations for debugging, auditing, and monitoring. Without correlation IDs:

- Difficult to trace a user operation through the system
- Hard to debug issues across multiple services
- No way to link events to the request that caused them
- Limited audit trail for operations
- Difficult to monitor system behavior

Full distributed tracing (e.g., OpenTelemetry, Jaeger) is complex and may be overkill for the initial implementation.

## Decision

The system will use a **lightweight correlation ID strategy** that provides traceability without implementing full distributed tracing.

### Request Context

Every HTTP request carries:

**RequestId:**
- Unique identifier for the current HTTP request
- Format: UUID v4
- Generated at API gateway or first entry point
- Propagated to all downstream services
- Lifetime: Single HTTP request

**CorrelationId:**
- Unique identifier linking related operations
- Format: UUID v4
- Inherited from incoming request or generated new
- Propagated to all downstream services, events, background jobs
- Lifetime: Entire user operation (may span multiple requests)

**TenantId:**
- Tenant identifier for multi-tenant isolation
- Format: UUID v4 or string
- Extracted from authentication context or subdomain
- Propagated to all database queries, events, operations
- Lifetime: Entire user session

**UserId:**
- User identifier when authenticated
- Format: UUID v4 or string
- Extracted from authentication context
- Propagated to authorization checks, audit logs, events
- Lifetime: Entire user session

### Event Context

Every business event contains:

**EventId:**
- Unique identifier for the event itself
- Format: UUID v4
- Generated when event is created
- Lifetime: Permanent (stored in event store)

**CorrelationId:**
- Correlation ID from the request that caused this event
- Format: UUID v4
- Inherited from request context
- Lifetime: Permanent (stored in event store)

**CausationId:**
- ID of the event or request that directly caused this event
- Format: UUID v4
- Set to triggering EventId or RequestId
- Lifetime: Permanent (stored in event store)

**TenantId:**
- Tenant identifier for multi-tenant isolation
- Format: UUID v4 or string
- Inherited from request context
- Lifetime: Permanent (stored in event store)

**Timestamp:**
- When the event occurred
- Format: ISO 8601 UTC
- Generated when event is created
- Lifetime: Permanent (stored in event store)

**ActorId:**
- User or system that caused the event
- Format: UUID v4 (user ID) or string (system name)
- Extracted from UserId or set to "system"
- Lifetime: Permanent (stored in event store)

**Source:**
- Service or component that produced the event
- Format: String (e.g., "order-service")
- Set by the service producing the event
- Lifetime: Permanent (stored in event store)

### HTTP Headers

**Incoming Headers:**
```
X-Request-Id: <uuid>
X-Correlation-Id: <uuid>
X-Tenant-Id: <uuid>
```

**Behavior:**
- If client provides RequestId, use it
- If client provides CorrelationId, use it
- If client provides TenantId, validate it
- If headers are missing, generate appropriate values

**Outgoing Headers:**
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
- Inherit UserId from current request

### Logging

**Log Format:**
All log entries include correlation context:

```json
{
  "timestamp": "2026-06-29T08:30:00Z",
  "level": "info",
  "message": "Order created",
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "correlationId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
  "tenantId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "userId": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "service": "order-service"
}
```

**Structured Logging:**
- Use JSON format for logs
- Enable correlation-based log aggregation
- Enable correlation-based log filtering

### Background Jobs

**Job Context:**
Background jobs inherit correlation context from triggering event:

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

### Error Handling

**Error Context:**
All errors include correlation context:

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

## Consequences

**Positive:**
- Traceability across the system
- Easier debugging of issues
- Better audit trail
- Improved monitoring capabilities
- Lightweight implementation
- No complex distributed tracing infrastructure

**Negative:**
- Additional context propagation complexity
- Header management overhead
- Log size increase
- Need for middleware implementation
- Need for discipline to maintain context

**Risks:**
- Context propagation failures
- Correlation ID leaks across tenants
- Performance overhead from context propagation
- Log volume increase

## Implementation Guidelines

### Middleware Pattern

```typescript
class CorrelationMiddleware {
  async handle(req, res, next) {
    // Extract or generate RequestId
    req.requestId = req.headers['x-request-id'] || generateUUID();
    
    // Extract or generate CorrelationId
    req.correlationId = req.headers['x-correlation-id'] || generateUUID();
    
    // Extract TenantId
    req.tenantId = await this.extractTenantId(req);
    
    // Extract UserId
    req.userId = await this.extractUserId(req);
    
    // Add to response headers
    res.setHeader('X-Request-Id', req.requestId);
    res.setHeader('X-Correlation-Id', req.correlationId);
    res.setHeader('X-Tenant-Id', req.tenantId);
    
    // Add to request context for downstream use
    req.context = {
      requestId: req.requestId,
      correlationId: req.correlationId,
      tenantId: req.tenantId,
      userId: req.userId
    };
    
    next();
  }
}
```

### Event Publishing Pattern

```typescript
class EventPublisher {
  publish(event: DomainEvent, context: RequestContext) {
    const eventWithContext = {
      ...event,
      eventId: generateUUID(),
      correlationId: context.correlationId,
      causationId: context.requestId,
      tenantId: context.tenantId,
      timestamp: new Date().toISOString(),
      actorId: context.userId || 'system',
      source: this.serviceName
    };
    
    this.eventStore.save(eventWithContext);
  }
}
```

### Database Query Pattern

```typescript
class TenantAwareRepository {
  async findById(id: string, context: RequestContext): Promise<Entity> {
    return this.db.query(
      'SELECT * FROM entities WHERE id = $1 AND tenant_id = $2',
      [id, context.tenantId]
    );
  }
}
```

## Related Documentation

- [Correlation ID Technical Context](../technical/CORRELATION_ID.md) - Detailed correlation ID standards
- [Business Events](../technical/EVENTS.md) - Event context structure
- [API Standards](../technical/API_STANDARDS.md) - Header propagation
- [Data Ownership](../technical/DATA_OWNERSHIP.md) - Tenant isolation
