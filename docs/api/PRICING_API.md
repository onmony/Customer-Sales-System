# Pricing API Documentation

## Base URL

```
http://localhost:3001/api
```

## Authentication

**Note:** Authentication and authorization are not implemented in Module 5. These will be added in a future module.

All endpoints are currently accessible without authentication.

## Pricing Endpoints

### Create Pricing

Creates a new customer-specific pricing record.

**Endpoint:** `POST /pricing`

**Request Body:**
```json
{
  "tenantId": "string (required)",
  "customerId": "string (required)",
  "productId": "string (required)",
  "price": "number (required, > 0)",
  "currency": "string (required, 3-letter ISO code, uppercase)",
  "effectiveDate": "string (required, ISO date)",
  "expiryDate": "string (optional, ISO date, must be after effectiveDate)",
  "statusId": "string (required)",
  "createdBy": "string (optional)"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "tenantId": "string",
  "customerId": "string",
  "productId": "string",
  "price": "number",
  "currency": "string",
  "effectiveDate": "datetime",
  "expiryDate": "datetime | null",
  "statusId": "string",
  "version": "number",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "createdBy": "string | null",
  "updatedBy": "string | null",
  "deletedAt": "datetime | null",
  "tenant": {
    "id": "string",
    "name": "string",
    "subdomain": "string",
    "isActive": "boolean"
  },
  "customer": {
    "id": "string",
    "displayName": "string",
    "tenantId": "string"
  },
  "product": {
    "id": "string",
    "displayName": "string",
    "tenantId": "string"
  },
  "status": {
    "id": "string",
    "code": "string",
    "name": "string"
  }
}
```

**Validation Errors:** `400 Bad Request`
```json
{
  "errors": ["string"]
}
```

**Business Rules:**
- PRI-1: Every pricing record belongs to exactly one tenant
- PRI-2: Every customer may have a unique price for every product
- PRI-3: Pricing must be associated with one customer and one product in the same tenant
- PRI-4: Changing price creates a new version (version auto-incremented)
- Overlapping pricing (same effective date for same customer-product pair) is rejected
- PRD-014: Users perform business actions; system manages versions, history, and audit automatically. Users should never manage technical versions, activate/deactivate versions, or understand internal version numbers

---

### Get Pricing

Retrieves a pricing record by ID.

**Endpoint:** `GET /pricing/:id`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "tenantId": "string",
  "customerId": "string",
  "productId": "string",
  "price": "number",
  "currency": "string",
  "effectiveDate": "datetime",
  "expiryDate": "datetime | null",
  "statusId": "string",
  "version": "number",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "createdBy": "string | null",
  "updatedBy": "string | null",
  "deletedAt": "datetime | null",
  "tenant": {
    "id": "string",
    "name": "string",
    "subdomain": "string",
    "isActive": "boolean"
  },
  "customer": {
    "id": "string",
    "displayName": "string",
    "tenantId": "string"
  },
  "product": {
    "id": "string",
    "displayName": "string",
    "tenantId": "string"
  },
  "status": {
    "id": "string",
    "code": "string",
    "name": "string"
  }
}
```

**Not Found:** `404 Not Found`
```json
{
  "error": "Pricing not found"
}
```

---

### List Pricing

Retrieves a paginated list of pricing records for a tenant.

**Endpoint:** `GET /pricing`

**Query Parameters:**
- `tenantId` (required): Tenant ID
- `skip` (optional): Number of records to skip (default: 0)
- `take` (optional): Number of records to return (default: all, max: 100)

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "tenantId": "string",
    "customerId": "string",
    "productId": "string",
    "price": "number",
    "currency": "string",
    "effectiveDate": "datetime",
    "expiryDate": "datetime | null",
    "statusId": "string",
    "version": "number",
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "createdBy": "string | null",
    "updatedBy": "string | null",
    "deletedAt": "datetime | null",
    "tenant": {
      "id": "string",
      "name": "string",
      "subdomain": "string",
      "isActive": "boolean"
    },
    "customer": {
      "id": "string",
      "displayName": "string",
      "tenantId": "string"
    },
    "product": {
      "id": "string",
      "displayName": "string",
      "tenantId": "string"
    },
    "status": {
      "id": "string",
      "code": "string",
      "name": "string"
    }
  }
]
```

**Business Rules:**
- PRI-1: Only pricing records from the specified tenant are returned
- Only active pricing records (not soft-deleted) are returned
- Results are ordered by createdAt descending

---

### Resolve Pricing

Resolves the active pricing for a customer-product pair at a specific date.

**Endpoint:** `GET /pricing/customer/:customerId/product/:productId`

**Query Parameters:**
- `tenantId` (required): Tenant ID
- `date` (optional): Resolution date (ISO date string, defaults to current date)

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "tenantId": "string",
  "customerId": "string",
  "productId": "string",
  "price": "number",
  "currency": "string",
  "effectiveDate": "datetime",
  "expiryDate": "datetime | null",
  "statusId": "string",
  "version": "number",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "createdBy": "string | null",
  "updatedBy": "string | null",
  "deletedAt": "datetime | null",
  "tenant": {
    "id": "string",
    "name": "string",
    "subdomain": "string",
    "isActive": "boolean"
  },
  "customer": {
    "id": "string",
    "displayName": "string",
    "tenantId": "string"
  },
  "product": {
    "id": "string",
    "displayName": "string",
    "tenantId": "string"
  },
  "status": {
    "id": "string",
    "code": "string",
    "name": "string"
  }
}
```

**Not Found:** `404 Not Found`
```json
{
  "error": "No active pricing found for this customer-product pair"
}
```

**Business Rules:**
- PRI-6: Pricing is resolved when a product is added to an order for a customer
- Resolution algorithm: Find all pricing versions for customer-product pair, filter by effectiveDate <= resolutionDate, select version with latest effectiveDate
- If no pricing exists for the date, returns 404 (PRI-7: missing-price behavior not finalized in V1)
- Supports historical pricing resolution for backdated orders

---

### Update Pricing

Updates a pricing record by creating a new version. The existing record is never modified (immutable versioning).

**Endpoint:** `PUT /pricing/:id`

**Request Body:**
```json
{
  "price": "number (optional, > 0)",
  "currency": "string (optional, 3-letter ISO code, uppercase)",
  "effectiveDate": "string (optional, ISO date)",
  "expiryDate": "string (optional, ISO date, must be after effectiveDate)",
  "updatedBy": "string (optional)"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "tenantId": "string",
  "customerId": "string",
  "productId": "string",
  "price": "number",
  "currency": "string",
  "effectiveDate": "datetime",
  "expiryDate": "datetime | null",
  "statusId": "string",
  "version": "number",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "createdBy": "string | null",
  "updatedBy": "string | null",
  "deletedAt": "datetime | null",
  "tenant": {
    "id": "string",
    "name": "string",
    "subdomain": "string",
    "isActive": "boolean"
  },
  "customer": {
    "id": "string",
    "displayName": "string",
    "tenantId": "string"
  },
  "product": {
    "id": "string",
    "displayName": "string",
    "tenantId": "string"
  },
  "status": {
    "id": "string",
    "code": "string",
    "name": "string"
  }
}
```

**Not Found:** `404 Not Found`
```json
{
  "error": "Pricing not found"
}
```

**Bad Request:** `400 Bad Request`
```json
{
  "error": "Pricing with the same effective date already exists for this customer-product pair"
}
```

**Business Rules:**
- PRI-4: Changing price creates a new version (version auto-incremented)
- Old pricing records are never modified (immutable)
- New version automatically becomes the current pricing
- Version numbers are internal implementation details
- Overlapping pricing (same effective date for same customer-product pair) is rejected

---

### Get Pricing History

Retrieves the complete pricing history for a customer-product pair.

**Endpoint:** `GET /pricing/history/:customerId/:productId`

**Query Parameters:**
- `tenantId` (required): Tenant ID

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "tenantId": "string",
    "customerId": "string",
    "productId": "string",
    "price": "number",
    "currency": "string",
    "effectiveDate": "datetime",
    "expiryDate": "datetime | null",
    "statusId": "string",
    "version": "number",
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "createdBy": "string | null",
    "updatedBy": "string | null",
    "deletedAt": "datetime | null",
    "tenant": {
      "id": "string",
      "name": "string",
      "subdomain": "string",
      "isActive": "boolean"
    },
    "customer": {
      "id": "string",
      "displayName": "string",
      "tenantId": "string"
    },
    "product": {
      "id": "string",
      "displayName": "string",
      "tenantId": "string"
    },
    "status": {
      "id": "string",
      "code": "string",
      "name": "string"
    }
  }
]
```

**Business Rules:**
- PRI-5: Pricing history must never be deleted as part of normal business operation
- History is read-only (users cannot modify historical records)
- Results are ordered by effectiveDate descending
- Version numbers are included for internal reference but not exposed to users

---

### Import Pricing

Placeholder endpoint for pricing import functionality.

**Endpoint:** `POST /pricing/import`

**Response:** `501 Not Implemented`
```json
{
  "error": "Pricing import not yet implemented",
  "message": "This endpoint is a placeholder for future pricing import functionality"
}
```

**Note:** Full implementation will be in a future module.

---

## Error Responses

All endpoints may return:

**500 Internal Server Error**
```json
{
  "error": "Internal server error"
}
```

---

## Business Rules Reference

### Pricing Workflow States

- **Draft**: New pricing versions start in Draft state
- **Active**: Pricing version is currently in effect for order resolution
- **Future**: Pricing version scheduled to become active in the future
- **Historical**: Pricing version that was previously active but no longer in effect
- **Expired**: Active pricing expires when expiryDate is reached
- **Cancelled**: Draft or Future pricing can be cancelled

### Pricing Business Rules

- **PRI-1**: Every pricing record belongs to exactly one tenant
- **PRI-2**: Every customer may have a unique price for every product
- **PRI-3**: A customer-specific price must be associated with one customer and one product in the same tenant
- **PRI-4**: Changing a customer-specific price creates a new pricing version
- **PRI-5**: Pricing history must never be deleted as part of normal business operation
- **PRI-6**: Pricing is resolved when a product is added to an order for a customer
- **PRI-7**: If no customer-specific price exists, V1 must not invent fallback behavior
- **PRI-8**: Saved order items must store the resolved price as an immutable snapshot
- **PRI-9**: Changing a customer-specific price after an order is saved must not change the saved order item price
- **PRI-10**: A saved order item pricing snapshot must be traceable to the pricing version used during order creation
- **PRI-11**: Pricing determines customer-product price. It does not define product identity, customer identity, tax policy, invoice numbering, inventory, shipment, or payment rules.

### Pricing Resolution Algorithm

1. Find all pricing versions for customer_id and product_id
2. Filter by effective_date <= order_date
3. Filter by status = Active or Historical (exclude Future)
4. Sort by effective_date descending
5. Select the first (latest) version
6. If no customer pricing found, return 404 (PRI-7: missing-price behavior not finalized)

### Tenant Isolation

All pricing operations are tenant-scoped:
- Pricing records are isolated by tenantId
- Searches are scoped to tenant
- Customer and Product must belong to the same tenant

### Versioning Strategy

- Every pricing change creates a new version
- Version numbers auto-increment per customer-product pair
- Old versions are never updated (immutable)
- Old versions are preserved for history (PRI-5)
- Overlapping effective dates are rejected
- **Version numbers are internal implementation details** - users should never see or manage them
- Latest version automatically becomes current pricing
- No user-facing activate/deactivate operations
- Users perform business actions (Edit Price) while system handles versioning automatically

### Soft Delete

- No hard delete operations
- Archive operation sets deletedAt timestamp
- Soft-deleted pricing records are excluded from default queries
- Archive is an internal operation, not exposed to users

### Module Boundaries

**Pricing Module Owns:**
- Customer-product pricing relationships
- Pricing versioning and history
- Price resolution logic
- Effective date handling

**Pricing Module Does NOT Own:**
- Product identity (Product module)
- Customer identity (Customer module)
- Order creation (Order module)
- Invoice generation (Invoice module)
- Tax calculation (future module)
- Inventory (future module)
- Warehouse (future module)

---

## Future Enhancements

- Authentication and authorization
- Pricing templates
- Bulk pricing import
- Discount engine
- Promotions
- Coupons
- Tax integration
- Currency conversion
- Approval workflow for pricing changes
- Pricing change reason tracking
- Price precision and rounding policy
