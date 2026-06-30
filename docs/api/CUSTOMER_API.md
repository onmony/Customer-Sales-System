# Customer API Documentation

## Base URL

```
http://localhost:3001/api
```

## Authentication

**Note:** Authentication and authorization are not implemented in Module 3. These will be added in a future module.

All endpoints are currently accessible without authentication.

## Customer Endpoints

### Create Customer

Creates a new customer.

**Endpoint:** `POST /customers`

**Request Body:**
```json
{
  "tenantId": "string (required)",
  "displayName": "string (required, max 255 characters)",
  "gstNumber": "string (optional, exactly 15 characters if provided)",
  "creditLimit": "number (optional, non-negative, max 999999999999.99)",
  "statusId": "string (required)",
  "createdBy": "string (optional)"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "tenantId": "string",
  "displayName": "string",
  "gstNumber": "string | null",
  "creditLimit": "decimal",
  "statusId": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "createdBy": "string | null",
  "updatedBy": "string | null",
  "deletedAt": "datetime | null",
  "status": {
    "id": "string",
    "code": "string",
    "name": "string",
    "description": "string | null",
    "isInitial": "boolean",
    "isTerminal": "boolean",
    "color": "string | null"
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
- CUS-001: New customers start in Active state (statusId must be provided)
- Display name is required and cannot be empty
- GST number must be 15 characters if provided
- GST number must be unique within tenant
- Credit limit cannot be negative

---

### Get Customer

Retrieves a customer by ID.

**Endpoint:** `GET /customers/:id`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "tenantId": "string",
  "displayName": "string",
  "gstNumber": "string | null",
  "creditLimit": "decimal",
  "statusId": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "createdBy": "string | null",
  "updatedBy": "string | null",
  "deletedAt": "datetime | null",
  "status": {
    "id": "string",
    "code": "string",
    "name": "string",
    "description": "string | null",
    "isInitial": "boolean",
    "isTerminal": "boolean",
    "color": "string | null"
  }
}
```

**Not Found:** `404 Not Found`
\
```json
{
  "error": "Customer not found"
}
```

---

### List Customers

Retrieves a paginated list of customers for a tenant.

**Endpoint:** `GET /customers`

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
    "gstNumber": "string | null",
    "creditLimit": "decimal",
    "statusId": "string",
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "createdBy": "string | null",
    "updatedBy": "string | null",
    "deletedAt": "datetime | null",
    "status": {
      "id": "string",
      "code": "string",
      "name": "string",
      "description": "string | null",
      "isInitial": "boolean",
      "isTerminal": "boolean",
      "color": "string | null"
    }
  }
]
```

**Business Rules:**
- Only active customers (not soft-deleted) are returned
- Results are ordered by createdAt descending

---

### Search Customers

Searches customers by display name or GST number.

**Endpoint:** `GET /customers/search`

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
    "gstNumber": "string | null",
    "creditLimit": "decimal",
    "statusId": "string",
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "createdBy": "string | null",
    "updatedBy": "string | null",
    "deletedAt": "datetime | null",
    "status": {
      "id": "string",
      "code": "string",
      "name": "string",
      "description": "string | null",
      "isInitial": "boolean",
      "isTerminal": "boolean",
      "color": "string | null"
    }
  }
]
```

**Business Rules:**
- Search is case-insensitive
- Searches both displayName and gstNumber fields
- Only active customers (not soft-deleted) are returned
- Results are ordered by createdAt descending

---

### Update Customer

Updates an existing customer.

**Endpoint:** `PUT /customers/:id`

**Request Body:**
```json
{
  "displayName": "string (optional, max 255 characters)",
  "gstNumber": "string (optional, exactly 15 characters if provided)",
  "creditLimit": "number (optional, non-negative, max 999999999999.99)",
  "statusId": "string (optional)",
  "updatedBy": "string (optional)"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "tenantId": "string",
  "displayName": "string",
  "gstNumber": "string | null",
  "creditLimit": "decimal",
  "statusId": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "createdBy": "string | null",
  "updatedBy": "string | null",
  "deletedAt": "datetime | null",
  "status": {
    "id": "string",
    "code": "string",
    "name": "string",
    "description": "string | null",
    "isInitial": "boolean",
    "isTerminal": "boolean",
    "color": "string | null"
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
  "error": "Customer not found"
}
```

**Business Rules:**
- Cannot update archived (soft-deleted) customers
- GST number must be unique within tenant (excluding current customer)
- Status transitions are validated (basic validation in Module 3, full validation in future modules)
- CUS-002 to CUS-009: Full status transition validation requires order/balance checks (out of scope for Module 3)

---

### Archive Customer

Archives (soft deletes) a customer.

**Endpoint:** `DELETE /customers/:id`

**Request Body:**
```json
{
  "archivedBy": "string (optional)"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "tenantId": "string",
  "displayName": "string",
  "gstNumber": "string | null",
  "creditLimit": "decimal",
  "statusId": "string",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "createdBy": "string | null",
  "updatedBy": "string | null",
  "deletedAt": "datetime",
  "status": {
    "id": "string",
    "code": "string",
    "name": "string",
    "description": "string | null",
    "isInitial": "boolean",
    "isTerminal": "boolean",
    "color": "string | null"
  }
}
```

**Not Found:** `404 Not Found`
```json
{
  "error": "Customer not found"
}
```

**Bad Request:** `400 Bad Request`
```json
{
  "error": "Customer is already archived"
}
```

**Business Rules:**
- No hard delete - only soft delete
- Archived customers are excluded from default queries
- archivedBy parameter is kept for future audit trail

---

### Get Customers by Status

Retrieves customers filtered by status.

**Endpoint:** `GET /customers/status/:statusId`

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
    "gstNumber": "string | null",
    "creditLimit": "decimal",
    "statusId": "string",
    "createdAt": "datetime",
    "updatedAt": "datetime",
    "createdBy": "string | null",
    "updatedBy": "string | null",
    "deletedAt": "datetime | null",
    "status": {
      "id": "string",
      "code": "string",
      "name": "string",
      "description": "string | null",
      "isInitial": "boolean",
      "isTerminal": "boolean",
      "color": "string | null"
    }
  }
]
```

**Business Rules:**
- Only active customers (not soft-deleted) are returned
- Results are ordered by createdAt descending

---

### Import Customers

Placeholder endpoint for customer import functionality.

**Endpoint:** `POST /customers/import`

**Response:** `501 Not Implemented`
```json
{
  "error": "Customer import not yet implemented",
  "message": "This endpoint is a placeholder for future customer import functionality"
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

### Customer Workflow States

- **Active**: Customer can create orders and receive shipments
- **Inactive**: Customer cannot create new orders but existing orders continue
- **Blocked**: Customer is blocked from creating orders due to credit or policy reasons
- **On Hold**: Customer is on hold pending resolution (from config)

### Customer Business Rules

- **CUS-001**: New customers start in Active state
- **CUS-002**: Active → Inactive (requires no pending orders or outstanding balance) - *Full validation in future module*
- **CUS-003**: Active → Blocked (requires credit limit exceeded or payment overdue) - *Full validation in future module*
- **CUS-004**: Inactive → Active (requires contact verification) - *Full validation in future module*
- **CUS-005**: Blocked → Active (requires credit limit restored or payment received) - *Full validation in future module*
- **CUS-009**: Inactive → Blocked (not allowed - must reactivate first) - *Full validation in future module*

### Tenant Isolation

All customer operations are tenant-scoped:
- Customers are isolated by `tenantId`
- Searches are scoped to tenant
- GST number uniqueness is enforced within tenant

### Soft Delete

- No hard delete operations
- Archive operation sets `deletedAt` timestamp
- Soft-deleted customers are excluded from default queries
- Soft-deleted customers cannot be updated

---

## Future Enhancements

- Authentication and authorization
- Full status transition validation with order/balance checks
- Customer merge functionality
- Customer import implementation
- Customer workspace integration
- Credit limit enforcement
- Outstanding balance tracking
