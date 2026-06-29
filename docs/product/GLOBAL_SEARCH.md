# Global Search

## Purpose

Global Search provides a unified search capability across all major entities in the system. It allows users to quickly find customers, products, orders, invoices, shipments, and documents from a single search interface without navigating to specific modules.

Related documents:

- [Vision](../VISION.md)
- [Navigation](NAVIGATION.md)
- [Customer Workspace ADR](../decisions/ADR-010-Customer-Workspace.md)
- [Authorization](../security/AUTHORIZATION.md)

## Business Context

Salespeople and operational staff need to quickly find information across the system without knowing which module contains the data. Common use cases:

- "Find customer Aarav Retail Mart"
- "Find product with SKU ABC123"
- "Find order #12345"
- "Find unpaid invoices"
- "Find shipments to Delhi"
- "Find documents for customer XYZ"

Global Search reduces navigation overhead and supports the product goal of fast, accurate order creation.

## Search Scope

### Searchable Entities

**Phase 1:**
- Customers
- Products
- Orders
- Invoices

**Phase 2:**
- Shipments
- Documents (when document module exists)

**Phase 3 (Future):**
- Pricing records
- Warehouse requests
- Delivery confirmations
- Payments
- Notes

### Search Fields per Entity

**Customers:**
- Customer name
- Customer code
- Contact email
- Contact phone
- Billing address
- Shipping address

**Products:**
- Product name
- Product code (SKU)
- Product category
- Product description

**Orders:**
- Order ID
- Customer name
- Customer code
- Order status
- Order date

**Invoices:**
- Invoice ID
- Order ID
- Customer name
- Customer code
- Invoice status
- Invoice date
- Invoice amount

**Shipments:**
- Shipment ID
- Order ID
- Customer name
- Carrier name
- Tracking number
- Shipment status

**Documents:**
- Document name
- Document type
- Customer name
- Order ID
- Invoice ID

## Search Interface

### Search Input

**Location:**
- Global search bar in header (always visible)
- Keyboard shortcut: Ctrl+K or Cmd+K

**Input Features:**
- Auto-suggest as user types
- Show recent searches
- Show popular searches
- Clear search button
- Search scope selector (All, Customers, Products, Orders, etc.)

**Search Behavior:**
- Minimum 2 characters to trigger search
- Debounce input (300ms) to reduce API calls
- Show loading indicator during search
- Show "No results" message when no matches

### Search Results

**Result Display:**
- Grouped by entity type
- Show entity icon
- Show entity name
- Show entity identifier (ID, code, etc.)
- Show relevant context (customer name for orders, etc.)
- Show match highlighting
- Show result count per entity type

**Result Ordering:**
- Relevance score (primary)
- Recency (secondary)
- Entity type priority (tertiary)

**Entity Type Priority:**
1. Customers (highest priority)
2. Orders
3. Products
4. Invoices
5. Shipments
6. Documents (lowest priority)

**Result Limit:**
- Show top 5 results per entity type
- Maximum 25 total results
- "Show more" link for each entity type

### Search Filters

**Filter Panel:**
- Entity type checkboxes
- Date range picker
- Status filters (for orders, invoices, shipments)
- Customer filter (for orders, invoices, shipments)
- Product filter (for orders)

**Filter Behavior:**
- Filters apply after initial search
- Filters update results in real-time
- Filter combinations supported
- Clear all filters button

## Search Ranking

### Relevance Scoring

**Exact Match:**
- Exact match on primary field: 100 points
- Exact match on secondary field: 80 points

**Fuzzy Match:**
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

**Entity Type Boost:**
- Customers: +5 points
- Orders: +3 points
- Products: +2 points
- Invoices: +1 point
- Shipments: +1 point
- Documents: 0 points

### Ranking Algorithm

```
Relevance Score = (Match Score × Field Weight) + Recency Boost + Entity Type Boost
```

**Example:**
- Search: "Aarav"
- Customer "Aarav Retail Mart" (exact match on name, created 5 days ago)
  - Match Score: 100 × 1.0 = 100
  - Recency Boost: +10
  - Entity Type Boost: +5
  - Total: 115

- Order for "Aarav Retail Mart" (contains in customer name, created 60 days ago)
  - Match Score: 40 × 0.8 = 32
  - Recency Boost: +2
  - Entity Type Boost: +3
  - Total: 37

## Recent Searches

### Search History

**Storage:**
- Store last 50 searches per user
- Store search query and timestamp
- Store search filters used
- Persist in user preferences

**Display:**
- Show recent searches in search dropdown
- Group by time (Today, Yesterday, Last Week, Older)
- Clear recent searches button
- Remove individual search button

**Privacy:**
- Search history is user-specific
- Search history is not shared across users
- Search history respects tenant isolation

## Keyboard Shortcuts

### Global Shortcuts

- `Ctrl+K` / `Cmd+K`: Open global search
- `Escape`: Close search
- `Arrow Down`: Navigate down in results
- `Arrow Up`: Navigate up in results
- `Enter`: Open selected result
- `Tab`: Navigate to filters

### Result Shortcuts

- `Ctrl+1` to `Ctrl+9`: Open result by position
- `Alt+Enter`: Open result in new tab

## Search Permissions

### Authorization

Global Search must respect user permissions:

- Users can only search entities they have permission to view
- Results are filtered based on user permissions
- No permission errors shown to user (simply no results)

**Required Permissions:**
- `customer.view` - Search customers
- `product.view` - Search products
- `order.view` - Search orders
- `invoice.view` - Search invoices
- `shipment.view` - Search shipments
- `document.view` - Search documents

### Tenant Isolation

- Search results are tenant-scoped
- Users cannot search across tenants
- Tenant context is automatically applied

## Search Performance

### Query Optimization

**Database Queries:**
- Use full-text search indexes where available
- Use indexed columns for filtering
- Limit result sets with pagination
- Use query caching for common searches

**Caching Strategy:**
- Cache recent search results (5-minute TTL)
- Cache popular search results (15-minute TTL)
- Invalidate cache on data changes
- Use cache warming for common searches

**Search Optimization:**
- Parallel queries across entity types
- Early termination for exact matches
- Lazy loading of detailed results
- Debounce rapid search inputs

### Search Latency Targets

- Search input response: < 100ms
- Search results display: < 300ms
- Filter application: < 200ms
- Result navigation: < 100ms

## Future AI Search

### AI-Powered Search

**Phase 3+ Enhancements:**

**Natural Language Search:**
- "Find unpaid invoices for Aarav Retail Mart"
- "Show me orders from last week"
- "Find products with price between 100 and 500"
- "Shipments to Delhi this month"

**Semantic Search:**
- Understand synonyms and related terms
- Contextual understanding of business terms
- Intent recognition (search vs. action)

**Search Suggestions:**
- Suggest related searches
- Suggest filters based on context
- Suggest actions based on results

**Search Analytics:**
- Track search patterns
- Identify search failures
- Recommend content improvements

### AI Implementation Considerations

- AI search should be an enhancement, not replacement
- Fallback to traditional search if AI unavailable
- AI suggestions should be clearly labeled
- AI should respect permissions and tenant isolation
- AI should not expose sensitive data in suggestions

## Search Analytics

### Metrics to Track

**Usage Metrics:**
- Search volume per user
- Search volume per entity type
- Average search session length
- Search result click-through rate
- Zero-result search rate

**Performance Metrics:**
- Average search latency
- Search cache hit rate
- Search error rate
- Search timeout rate

**Quality Metrics:**
- Search result relevance (user feedback)
- Search result position (first result click rate)
- Search refinement rate (filter usage)
- Search abandonment rate

### Analytics Privacy

- Analytics data is tenant-isolated
- Analytics data is aggregated
- No personally identifiable information in analytics
- Search queries are not stored in plain text

## Cross References

- [Navigation](NAVIGATION.md) - Search integration with navigation
- [Authorization](../security/AUTHORIZATION.md) - Search permissions
- [Customer Workspace](../business/CUSTOMER_WORKSPACE.md) - Customer search context
