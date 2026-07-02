# Product API Documentation

## Base URL

```
http://localhost:3001/api
```

## Authentication

**Note:** Authentication and authorization are not implemented in Module 4. These will be added in a future module.

All endpoints are currently accessible without authentication.

## Product Endpoints

### Create Product

Creates a new product.

**Endpoint:** `POST /products`

**Request Body:**
```json
{
  "tenantId": "string (required)",
  "displayName": "string (required, max 255 characters)",
  "sku": "string (optional, max 100 characters)",
  "unit": "string (required, max 50 characters)",
  "isActive": "boolean (optional, default: true)",
  "createdBy": "string (optional)"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "tenantId": "string",
  "displayName": "string",
  "sku": "string | null",
  "unit": "string",
  "isActive": "boolean",
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
- PRO-1: Every product belongs to exactly one tenant
- PRO-2: Product identity must be clear (displayName required)
- PRO-3: Product creation requires valid tenant
- SKU must be unique within tenant if provided
- Unit is required for order quantity context

---

### Get Product

Retrieves a product by ID.

**Endpoint:** `GET /products/:id`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "tenantId": "string",
  "displayName": "string",
  "sku": "string | null",
  "unit": "string",
  "isActive": "boolean",
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
  }
}
```

**Not Found:** `404 Not Found`
```json
{
  "error": "Product not found"
}
```

---

### List Products

Retrieves a paginated list of products for a tenant.

**Endpoint:** `GET /products`

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
    "displayName": "string",
    "sku": "string | null",
    "unit": "string",
    "isActive": "boolean",
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
    }
  }
]
```

**Business Rules:**
- PRO-1: Only products from the specified tenant are returned
- Only active products (not soft-deleted) are returned
- Results are ordered by createdAt descending

---

### Search Products

Searches products by display name or SKU.

**Endpoint:** `GET /products/search`

**Query Parameters:**
- `tenantId` (required): Tenant ID
- `query` (required): Search query (min 2 characters, max 100 characters)
- `skip` (optional): Number of records to skip (default: 0)
- `take` (optional): Number of records to return (default: all, max: 100)

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "tenantId": "string",
    "displayName": "string",
    "sku": "string | null",
    "unit": "string",
    "isActive": "boolean",
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
    }
  }
]
```

**Business Rules:**
- PRO-4: Search is scoped to current tenant
- Search is case-insensitive
- Searches both displayName and sku fields
- Only active products (not soft-deleted) are returned
- Results are ordered by createdAt descending

---

### Update Product

Updates an existing product.

**Endpoint:** `PUT /products/:id`

**Request Body:**
```json
{
  "displayName": "string (optional, max 255 characters)",
  "sku": "string (optional, max 100 characters)",
  "unit": "string (optional, max 50 characters)",
  "isActive": "boolean (optional)",
  "updatedBy": "string (optional)"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "tenantId": "string",
  "displayName": "string",
  "sku": "string | null",
  "unit": "string",
  "isActive": "boolean",
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
  }
}
```

**Validation Errors:** `400 Bad Request`
```json
{
  "errors": ["string"]
}
```

**Not Found:** `404 Not Found`
```json
{
  "error": "Product not found"
}
```

**Business Rules:**
- Cannot update archived (soft-deleted) products
- SKU must be unique within tenant (excluding current product)
- PRO-8: Inactive product behavior not finalized in V1 - isActive field available but business rules deferred

---

### Archive Product

Archives (soft deletes) a product.

**Endpoint:** `DELETE /products/:id`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "tenantId": "string",
  "displayName": "string",
  "sku": "string | null",
  "unit": "string",
  "isActive": "boolean",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "createdBy": "string | null",
  "updatedBy": "string | null",
  "deletedAt": "datetime",
  "tenant": {
    "id": "string",
    "name": "string",
    "subdomain": "string",
    "isActive": "boolean"
  }
}
```

**Not Found:** `404 Not Found`
```json
{
  "error": "Product not found"
}
```

**Bad Request:** `400 Bad Request`
```json
{
  "error": "Product is already archived"
}
```

**Business Rules:**
- No hard delete - only soft delete
- Archived products are excluded from default queries
- PRO-7: Product details required by immutable documents must be snapshotted when needed (handled by downstream modules)

---

### Get Products by Active Status

Retrieves products filtered by active status.

**Endpoint:** `GET /products/active`

**Query Parameters:**
- `tenantId` (required): Tenant ID
- `isActive` (required): Boolean string ("true" or "false")

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "tenantId": "string",
    "displayName": "string",
    "sku": "string | null",
    "unit": "string",
    "isActive": "boolean",
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
    }
  }
]
```

**Business Rules:**
- Only active products (not soft-deleted) are returned
- Results are ordered by createdAt descending
- PRO-8: Inactive product behavior not finalized in V1

---

### Import Products

Placeholder endpoint for product import functionality.

**Endpoint:** `POST /products/import`

**Response:** `501 Not Implemented`
```json
{
  "error": "Product import not yet implemented",
  "message": "This endpoint is a placeholder for future product import functionality"
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

### Product Workflow States

- **Active**: Product can be selected for orders and pricing
- **Inactive**: Product behavior not finalized in V1 (PRO-8)

### Product Business Rules

- **PRO-1**: Every product belongs to exactly one tenant
- **PRO-2**: Product identity must be clear enough for users to distinguish products
- **PRO-3**: A user may create a product when the product does not already exist in the current tenant
- **PRO-4**: A user must be able to search products in the current tenant before adding them to an order
- **PRO-5**: Only products in the current tenant can be selected for orders
- **PRO-6**: A product may have a unit used for order quantity and invoice display
- **PRO-7**: Product details required by immutable business documents must be snapshotted when needed
- **PRO-8**: Inactive product behavior is not finalized in V1
- **PRO-9**: Customer-specific pricing is handled by the Pricing module
- **PRO-10**: Product defines product identity and product context. It does not define customer-specific pricing, inventory quantity, warehouse allocation, shipment, delivery, payment, or accounting behavior.

### Tenant Isolation

All product operations are tenant-scoped:
- Products are isolated by `tenantId`
- Searches are scoped to tenant
- SKU uniqueness is enforced within tenant

### Soft Delete

- No hard delete operations
- Archive operation sets `deletedAt` timestamp
- Soft-deleted products are excluded from default queries
- Soft-deleted products cannot be updated

### Module Boundaries

**Product Module Owns:**
- Product identity (displayName, sku)
- Product context (unit, isActive)
- Product lifecycle (create, update, archive)

**Product Module Does NOT Own:**
- Customer-specific pricing (Pricing module)
- Inventory quantities (future module)
- Warehouse allocation (future module)
- Product variants (out of scope for V1)
- Product bundles (out of scope for V1)
- Bills of materials (out of scope for V1)

---

## Future Enhancements

- Authentication and authorization
- Product categories
- Product images
- Product variants
- Product bundles
- Inventory tracking
- Barcode scanning
- Serial number tracking
- Batch or lot tracking
- Advanced tax classification
