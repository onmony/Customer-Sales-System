# ADR-016 Global Search

## Status

Accepted for architecture hardening.

## Context

Salespeople and operational staff need to quickly find information across the system without navigating to specific modules. Common search needs:

- "Find customer Aarav Retail Mart"
- "Find product with SKU ABC123"
- "Find order #12345"
- "Find unpaid invoices"
- "Find shipments to Delhi"

Without global search, users must:
- Navigate to specific module
- Use module-specific search
- Remember which module contains the data
- Switch between modules for different entity types

This increases context switching and reduces productivity.

## Decision

The system will include a **Global Search** capability that provides unified search across all major entities from a single interface.

### Search Scope

**Phase 1:**
- Customers
- Products
- Orders
- Invoices

**Phase 2 (Future):**
- Shipments
- Documents

**Phase 3 (Future):**
- Pricing records
- Warehouse requests
- Payments

### Search Interface

**Global Search Bar:**
- Always visible in header
- Keyboard shortcut: Ctrl+K or Cmd+K
- Auto-suggest as user types
- Show recent searches

**Search Results:**
- Grouped by entity type
- Show entity icon, name, identifier
- Show match highlighting
- Show result count per entity type
- Limit to top 5 results per entity type

**Search Filters:**
- Entity type checkboxes
- Date range picker
- Status filters
- Customer filter

### Search Ranking

**Relevance Scoring:**
- Exact match on primary field: 100 points
- Exact match on secondary field: 80 points
- Starts with search term: 60 points
- Contains search term: 40 points
- Fuzzy match (similarity > 80%): 20 points

**Field Weighting:**
- Primary field (name, code): 1.0x multiplier
- Secondary field (email, phone): 0.8x multiplier
- Tertiary field (address, description): 0.6x multiplier

**Recency Boost:**
- Records created in last 7 days: +10 points
- Records created in last 30 days: +5 points
- Records created in last 90 days: +2 points

**Entity Type Priority:**
- Customers: +5 points
- Orders: +3 points
- Products: +2 points
- Invoices: +1 point
- Shipments: +1 point
- Documents: 0 points

### Search Permissions

**Authorization:**
Global search must respect user permissions:
- Users can only search entities they have permission to view
- Results are filtered based on user permissions
- No permission errors shown (simply no results)

**Required Permissions:**
- `customer.view` - Search customers
- `product.view` - Search products
- `order.view` - Search orders
- `invoice.view` - Search invoices
- `shipment.view` - Search shipments
- `document.view` - Search documents

### Tenant Isolation

**Tenant Scoping:**
- Search results are tenant-scoped
- Users cannot search across tenants
- Tenant context is automatically applied
- All queries include `tenant_id` filter

### Performance

**Query Optimization:**
- Use full-text search indexes where available
- Use indexed columns for filtering
- Limit result sets with pagination
- Use query caching for common searches

**Caching Strategy:**
- Cache recent search results (5-minute TTL)
- Cache popular search results (15-minute TTL)
- Invalidate cache on data changes
- Use cache warming for common searches

**Search Latency Targets:**
- Search input response: < 100ms
- Search results display: < 300ms
- Filter application: < 200ms

### Future AI Search

**Phase 3+ Enhancements:**
- Natural language search ("Find unpaid invoices for Aarav Retail Mart")
- Semantic search (synonyms, related terms)
- Search suggestions (related searches, filters)
- Search analytics (patterns, failures)

**AI Implementation:**
- AI search as enhancement, not replacement
- Fallback to traditional search if AI unavailable
- AI suggestions clearly labeled
- AI respects permissions and tenant isolation

## Consequences

**Positive:**
- Unified search interface
- Reduced navigation overhead
- Faster information retrieval
- Better user experience
- Supports productivity goals

**Negative:**
- Additional complexity (search infrastructure)
- Performance considerations (cross-entity queries)
- Caching complexity
- Ranking algorithm complexity
- AI search complexity (future)

**Risks:**
- Poor search ranking quality
- Performance degradation
- Permission bypass vulnerabilities
- Cache invalidation issues
- AI search hallucinations (future)

## Implementation Guidelines

### Search Service Pattern

```typescript
class GlobalSearchService {
  constructor(
    private customerRepository: CustomerRepository,
    private productRepository: ProductRepository,
    private orderRepository: OrderRepository,
    private invoiceRepository: InvoiceRepository,
    private cache: Cache
  ) {}

  async search(query: string, filters: SearchFilters): Promise<SearchResults> {
    const cacheKey = this.buildCacheKey(query, filters);
    const cached = await this.cache.get(cacheKey);
    if (cached) return cached;

    const results = await Promise.all([
      this.searchCustomers(query, filters),
      this.searchProducts(query, filters),
      this.searchOrders(query, filters),
      this.searchInvoices(query, filters)
    ]);

    const rankedResults = this.rankResults(results, query);
    await this.cache.set(cacheKey, rankedResults, 300); // 5-minute TTL
    return rankedResults;
  }

  private async searchCustomers(query: string, filters: SearchFilters): Promise<CustomerResult[]> {
    const customers = await this.customerRepository.search(query, filters);
    return customers.map(c => ({
      type: 'customer',
      id: c.id,
      name: c.name,
      code: c.code,
      score: this.calculateScore(c, query)
    }));
  }

  private calculateScore(entity: any, query: string): number {
    let score = 0;
    
    // Exact match on primary field
    if (entity.name === query) score += 100;
    
    // Starts with query
    if (entity.name.startsWith(query)) score += 60;
    
    // Contains query
    if (entity.name.includes(query)) score += 40;
    
    // Recency boost
    const daysSinceCreation = this.daysSince(entity.createdAt);
    if (daysSinceCreation < 7) score += 10;
    else if (daysSinceCreation < 30) score += 5;
    
    // Entity type boost
    score += 5; // Customer priority
    
    return score;
  }
}
```

### Permission Filter Pattern

```typescript
class PermissionFilteredSearch {
  constructor(
    private searchService: GlobalSearchService,
    private authorizationService: AuthorizationService
  ) {}

  async search(query: string, filters: SearchFilters, userId: string): Promise<SearchResults> {
    const permissions = await this.authorizationService.getUserPermissions(userId);
    const results = await this.searchService.search(query, filters);

    return {
      customers: permissions.includes('customer.view') ? results.customers : [],
      products: permissions.includes('product.view') ? results.products : [],
      orders: permissions.includes('order.view') ? results.orders : [],
      invoices: permissions.includes('invoice.view') ? results.invoices : []
    };
  }
}
```

## Related Documentation

- [Global Search Product Context](../product/GLOBAL_SEARCH.md) - Detailed search requirements
- [Navigation](../product/NAVIGATION.md) - Search integration with navigation
- [Authorization](../security/AUTHORIZATION.md) - Search permissions
- [API Standards](../technical/API_STANDARDS.md) - Search API design
