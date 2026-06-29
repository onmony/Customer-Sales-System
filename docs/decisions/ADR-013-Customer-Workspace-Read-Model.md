# ADR-013 Customer Workspace Read Model

## Status

Accepted for architecture hardening.

## Context

The Customer Workspace is the primary operational entry point for sales and service workflows. It needs to display operational context from multiple aggregates:

- Customer aggregate (identity, contacts, preferences)
- Order aggregate (recent orders, order status)
- Pricing aggregate (current pricing, pricing history)
- Invoice aggregate (outstanding balance, recent invoices)
- Warehouse aggregate (preferred warehouse, readiness)
- Shipment aggregate (preferred transport, shipment status)

Two approaches exist:

1. **Direct Queries**: Query each aggregate directly when loading the workspace
2. **Read Model**: Maintain a composed view optimized for workspace queries

Direct queries have drawbacks:
- Performance impact from multiple queries
- Complex query logic in UI layer
- Difficult to optimize for workspace-specific needs
- Inconsistent data freshness across aggregates

## Decision

The Customer Workspace will be implemented as a **READ MODEL** that composes data from multiple aggregates without owning any of it.

### Read Model Architecture

**Definition:**
The Customer Workspace Read Model is a composed, denormalized view optimized for workspace queries. It reads from multiple aggregates but never writes to them.

**Data Flow:**
```
Aggregates (Customer, Order, Pricing, Invoice, Warehouse, Shipment)
    ↓
Events (CustomerUpdated, OrderCreated, PricingChanged, etc.)
    ↓
Read Model Builder (subscribes to events)
    ↓
Customer Workspace Read Model (denormalized, cached)
    ↓
Customer Workspace UI (queries read model)
```

### Read Model Structure

**CustomerWorkspaceReadModel:**
```typescript
{
  customerId: string,
  tenantId: string,
  
  // From Customer Aggregate
  customerName: string,
  customerCode: string,
  contactEmail: string,
  contactPhone: string,
  creditLimit: Money,
  creditStatus: string,
  preferredWarehouseId: string,
  preferredTransportId: string,
  
  // From Order Aggregate
  lastOrderId: string,
  lastOrderDate: Date,
  lastOrderAmount: Money,
  frequentlyOrderedProducts: ProductSummary[],
  
  // From Pricing Aggregate
  hasCustomerSpecificPricing: boolean,
  pricingLastUpdated: Date,
  
  // From Invoice Aggregate
  outstandingBalance: Money,
  lastInvoiceId: string,
  lastInvoiceDate: Date,
  
  // From Warehouse Aggregate
  warehouseReady: boolean,
  warehouseLastUpdated: Date,
  
  // From Shipment Aggregate
  activeShipments: ShipmentSummary[],
  
  // Computed
  lastActivity: Date,
  activityScore: number,
  
  // Metadata
  cachedAt: Date,
  version: number
}
```

### Cache Strategy

**Multi-Level Caching:**
1. **Real-Time Data** (no cache): Customer identity, current pricing status
2. **Near Real-Time Data** (5-minute TTL): Recent orders, outstanding balance
3. **Periodic Data** (15-minute TTL): Frequently ordered products, preferred warehouse
4. **Historical Data** (1-hour TTL): Activity timeline, pricing history

**Cache Invalidation:**
- Invalidate cache when source aggregate changes
- Event-driven invalidation (subscribe to aggregate events)
- Manual refresh on user action
- TTL-based expiration for stale data

### Data Freshness Guarantees

**Critical Path (must be fresh):**
- Customer identity and contact information
- Current pricing status
- Outstanding balance
- Credit status

**Non-Critical Path (can be stale):**
- Frequently ordered products
- Preferred warehouse/transport
- Activity timeline
- Historical pricing

### Loading Strategy

**Initial Load:**
1. Load customer identity immediately (critical path)
2. Load overview data in parallel (non-blocking)
3. Load detailed data on tab switch (lazy loading)
4. Refresh cache on user action or explicit refresh

**Progressive Enhancement:**
- Show minimal data immediately
- Load additional data asynchronously
- Update UI as data arrives
- Show loading indicators for slow data

### Event Subscription

**Events to Subscribe:**
- CustomerUpdated → Invalidate customer identity cache
- OrderCreated → Update last order, frequently ordered products
- OrderConfirmed → Update order status
- PricingChanged → Invalidate pricing cache
- InvoiceIssued → Update outstanding balance
- WarehouseRequestCreated → Update warehouse readiness
- ShipmentDispatched → Update shipment status

**Event Processing:**
- Subscribe to event stream
- Filter events by customer
- Update read model on relevant events
- Increment version on each update
- Invalidate cache on version change

### Data Ownership Rules

**The Customer Workspace Read Model:**
- **READS** from Customer, Order, Pricing, Invoice, Warehouse, Shipment aggregates
- **NEVER WRITES** to any aggregate
- **NEVER OWNS** data from other aggregates
- **MAY CACHE** composed views for performance
- **MAY REFRESH** cache when source aggregates change

**Source of Truth:**
- Aggregates remain the source of truth
- Read model is derived from aggregates
- Read model can be rebuilt from events
- Read model is not authoritative for business operations

## Consequences

**Positive:**
- Optimized query performance for workspace
- Single query instead of multiple queries
- Consistent data freshness strategy
- Clear separation of concerns
- Can be rebuilt from event history
- Supports offline mode (cached data)

**Negative:**
- Additional complexity (read model builder)
- Eventual consistency (not real-time)
- Additional storage for read model
- Cache invalidation complexity
- Need to handle read model failures

**Risks:**
- Stale data if cache invalidation fails
- Read model drift from aggregates
- Complexity in event subscription
- Performance impact from event processing

## Implementation Guidelines

### Read Model Builder

```typescript
class CustomerWorkspaceReadModelBuilder {
  constructor(
    private eventStore: EventStore,
    private readModelRepository: ReadModelRepository
  ) {}

  async rebuild(customerId: string): Promise<void> {
    const events = await this.eventStore.getEventsForCustomer(customerId);
    const readModel = new CustomerWorkspaceReadModel();
    
    for (const event of events) {
      this.applyEvent(readModel, event);
    }
    
    await this.readModelRepository.save(readModel);
  }

  async handleEvent(event: DomainEvent): Promise<void> {
    if (this.isCustomerEvent(event)) {
      const readModel = await this.readModelRepository.findByCustomer(event.customerId);
      this.applyEvent(readModel, event);
      await this.readModelRepository.save(readModel);
    }
  }

  private applyEvent(readModel: CustomerWorkspaceReadModel, event: DomainEvent): void {
    switch (event.type) {
      case "CustomerUpdated":
        readModel.customerName = event.customerName;
        readModel.version++;
        break;
      case "OrderCreated":
        readModel.lastOrderId = event.orderId;
        readModel.lastOrderDate = event.createdAt;
        readModel.version++;
        break;
      // ... other events
    }
  }
}
```

### Cache Invalidation

```typescript
class CustomerWorkspaceCache {
  async get(customerId: string): Promise<CustomerWorkspaceReadModel> {
    const cached = await this.cache.get(`workspace:${customerId}`);
    if (cached && !this.isStale(cached)) {
      return cached;
    }
    
    const readModel = await this.readModelRepository.findByCustomer(customerId);
    await this.cache.set(`workspace:${customerId}`, readModel, this.getTTL(readModel));
    return readModel;
  }

  async invalidate(customerId: string): Promise<void> {
    await this.cache.delete(`workspace:${customerId}`);
  }

  private isStale(readModel: CustomerWorkspaceReadModel): boolean {
    const age = Date.now() - readModel.cachedAt.getTime();
    return age > this.getMaxAge();
  }
}
```

## Related Documentation

- [Customer Workspace Business Context](../business/CUSTOMER_WORKSPACE.md) - Workspace requirements
- [Data Ownership](../technical/DATA_OWNERSHIP.md) - Aggregate ownership boundaries
- [Business Events](../technical/EVENTS.md) - Event catalog for subscriptions
- [Dependencies](../technical/DEPENDENCIES.md) - Module dependency rules
