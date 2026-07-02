# Order API Documentation

## Base URL

```
http://localhost:3001/api
```

## Authentication

**Note:** Authentication and authorization are not implemented in Module 6. These will be added in a future module.

All endpoints are currently accessible without authentication.

## Order Endpoints

### Create Draft Order

Creates a new draft order with customer snapshot.

**Endpoint:** `POST /orders`

**Request Body:**
```json
{
  "tenantId": "string (required)",
  "customerId": "string (required)",
  "orderNumber": "string (required)",
  "statusId": "string (required, must be draft status)",
  "notes": "string (optional)",
  "createdBy": "string (optional)"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "tenantId": "string",
  "customerId": "string",
  "orderNumber": "string",
  "orderDate": "datetime",
  "statusId": "string",
  "totalAmount": "decimal",
  "currency": "string",
  "notes": "string | null",
  "customerSnapshotName": "string",
  "customerSnapshotGstNumber": "string | null",
  "customerSnapshotBillingAddress": "json | null",
  "customerSnapshotShippingAddress": "json | null",
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
  },
  "customer": {
    "id": "string",
    "displayName": "string",
    "gstNumber": "string | null"
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
- ORD-1: Order must belong to a tenant
- ORD-2: Order must have a customer
- ORD-3: Order creation starts from a selected customer
- Customer must belong to the same tenant as the order
- Order number must be unique within tenant
- Customer snapshot is created at order creation time
- Only draft status is valid for Module 6

---

### Get Order

Retrieves an order by ID.

**Endpoint:** `GET /orders/:id`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "tenantId": "string",
  "customerId": "string",
  "orderNumber": "string",
  "orderDate": "datetime",
  "statusId": "string",
  "totalAmount": "decimal",
  "currency": "string",
  "notes": "string | null",
  "customerSnapshotName": "string",
  "customerSnapshotGstNumber": "string | null",
  "customerSnapshotBillingAddress": "json | null",
  "customerSnapshotShippingAddress": "json | null",
  "createdAt": "datetime",
  "updatedAt": "datetime",
  "createdBy": "string | null",
  "updatedBy": "string | null",
  "deletedAt": "datetime | null",
  "status": {
    "id": "string",
    "code": "string",
    "name": "string"
  },
  "customer": {
    "id": "string",
    "displayName": "string"
  }
}
```

**Error:** `404 Not Found`
```json
{
  "error": "Order not found"
}
```

---

### Get Order with Items

Retrieves an order with all order items.

**Endpoint:** `GET /orders/:id/items`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "tenantId": "string",
  "customerId": "string",
  "orderNumber": "string",
  "orderDate": "datetime",
  "statusId": "string",
  "totalAmount": "decimal",
  "currency": "string",
  "notes": "string | null",
  "customerSnapshotName": "string",
  "customerSnapshotGstNumber": "string | null",
  "customerSnapshotBillingAddress": "json | null",
  "customerSnapshotShippingAddress": "json | null",
  "orderItems": [
    {
      "id": "uuid",
      "orderId": "string",
      "productId": "string",
      "quantity": "decimal",
      "unitPrice": "decimal",
      "lineTotal": "decimal",
      "currency": "string",
      "notes": "string | null",
      "productSnapshotCode": "string | null",
      "productSnapshotName": "string",
      "productSnapshotUnit": "string",
      "pricingSnapshotVersion": "integer",
      "pricingSnapshotEffectiveDate": "datetime",
      "pricingSnapshotCurrency": "string",
      "pricingSnapshotSource": "string",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  ]
}
```

---

### List Orders

Lists orders for a tenant with pagination.

**Endpoint:** `GET /orders`

**Query Parameters:**
- `tenantId` (required): Tenant ID
- `skip` (optional): Number of records to skip (default: 0)
- `take` (optional): Number of records to take (max: 100)

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "tenantId": "string",
    "customerId": "string",
    "orderNumber": "string",
    "orderDate": "datetime",
    "statusId": "string",
    "totalAmount": "decimal",
    "currency": "string",
    "notes": "string | null",
    "status": {
      "id": "string",
      "code": "string",
      "name": "string"
    },
    "customer": {
      "id": "string",
      "displayName": "string"
    }
  }
]
```

**Validation Errors:** `400 Bad Request`
```json
{
  "errors": ["Take cannot exceed 100"]
}
```

---

### List Customer Orders

Lists orders for a specific customer with pagination.

**Endpoint:** `GET /orders/customer/:customerId`

**Query Parameters:**
- `tenantId` (required): Tenant ID
- `skip` (optional): Number of records to skip (default: 0)
- `take` (optional): Number of records to take (max: 100)

**Response:** `200 OK`
```json
[
  {
    "id": "uuid",
    "tenantId": "string",
    "customerId": "string",
    "orderNumber": "string",
    "orderDate": "datetime",
    "statusId": "string",
    "totalAmount": "decimal",
    "currency": "string",
    "status": {
      "id": "string",
      "code": "string",
      "name": "string"
    }
  }
]
```

---

### Edit Draft Order

Updates a draft order (notes only).

**Endpoint:** `PUT /orders/:id`

**Request Body:**
```json
{
  "notes": "string (optional)",
  "updatedBy": "string (optional)"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "tenantId": "string",
  "customerId": "string",
  "orderNumber": "string",
  "notes": "string | null",
  "updatedAt": "datetime",
  "updatedBy": "string | null"
}
```

**Validation Errors:** `400 Bad Request`
```json
{
  "error": "Only Draft orders can be edited"
}
```

**Business Rules:**
- ORD-12: Only Draft orders can be edited in Module 6
- Confirmed orders are immutable
- Cancelled orders are immutable

---

### Confirm Order

Confirms a draft order, making it immutable.

**Endpoint:** `POST /orders/:id/confirm`

**Request Body:**
```json
{
  "updatedBy": "string (optional)"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "tenantId": "string",
  "customerId": "string",
  "orderNumber": "string",
  "statusId": "string",
  "status": {
    "code": "confirmed",
    "name": "Confirmed"
  },
  "updatedAt": "datetime"
}
```

**Validation Errors:** `400 Bad Request`
```json
{
  "error": "Only Draft orders can be confirmed"
}
```

```json
{
  "error": "Cannot confirm order without items"
}
```

**Business Rules:**
- Only Draft orders can be confirmed
- Order must have at least one item to be confirmed
- Confirmed orders become immutable
- Status transitions to "confirmed"

---

### Cancel Draft Order

Cancels a draft order.

**Endpoint:** `POST /orders/:id/cancel`

**Request Body:**
```json
{
  "updatedBy": "string (optional)"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "tenantId": "string",
  "customerId": "string",
  "orderNumber": "string",
  "statusId": "string",
  "status": {
    "code": "cancelled",
    "name": "Cancelled"
  },
  "updatedAt": "datetime"
}
```

**Validation Errors:** `400 Bad Request`
```json
{
  "error": "Only Draft orders can be cancelled"
}
```

**Business Rules:**
- Only Draft orders can be cancelled in Module 6
- Cancelled orders become terminal (immutable)

---

### Add Order Item

Adds a product to an order. Pricing is resolved automatically from the Pricing module.

**Endpoint:** `POST /orders/:id/items`

**Request Body:**
```json
{
  "productId": "string (required)",
  "quantity": "number (required, positive)",
  "createdBy": "string (optional)"
}
```

**Response:** `201 Created`
```json
{
  "id": "uuid",
  "orderId": "string",
  "productId": "string",
  "quantity": "decimal",
  "unitPrice": "decimal",
  "lineTotal": "decimal",
  "currency": "string",
  "notes": "string | null",
  "productSnapshotCode": "string | null",
  "productSnapshotName": "string",
  "productSnapshotUnit": "string",
  "pricingSnapshotVersion": "integer",
  "pricingSnapshotEffectiveDate": "datetime",
  "pricingSnapshotCurrency": "string",
  "pricingSnapshotSource": "string",
  "createdAt": "datetime"
}
```

**Validation Errors:** `400 Bad Request`
```json
{
  "error": "Only Draft orders can be edited"
}
```

```json
{
  "error": "Product does not belong to the order tenant"
}
```

```json
{
  "error": "No active pricing found for this customer-product pair"
}
```

**Business Rules:**
- ORD-4: Order must have at least one item
- ORD-5: Every order item must reference a product
- ORD-6: Every order item must have a quantity
- ORD-7: Pricing must be resolved before adding item (automatic via Pricing module)
- ORD-8: Every saved order item must include an immutable pricing snapshot (automatic)
- ORD-9: Saved orders must preserve customer and product context
- Product must belong to the same tenant as the order
- Only Draft orders can have items added
- Order total is recalculated automatically
- **Pricing is resolved internally by calling Pricing module**
- **Client never supplies unit price, pricing version, effective date, or source**
- **Resolved pricing is automatically snapshotted**

---

### Update Order Item

Updates an order item (quantity, unit price).

**Endpoint:** `PUT /orders/:id/items/:itemId`

**Request Body:**
```json
{
  "quantity": "number (optional, positive)",
  "unitPrice": "number (optional, positive)",
  "lineTotal": "number (optional)",
  "currency": "string (optional)",
  "notes": "string (optional)",
  "updatedBy": "string (optional)"
}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "quantity": "decimal",
  "unitPrice": "decimal",
  "lineTotal": "decimal",
  "updatedAt": "datetime"
}
```

**Validation Errors:** `400 Bad Request`
```json
{
  "error": "Only Draft orders can be edited"
}
```

**Business Rules:**
- Only Draft orders can have items updated
- Line total is recalculated if quantity or unit price changes
- Order total is recalculated automatically

---

### Remove Order Item

Removes an order item from a draft order.

**Endpoint:** `DELETE /orders/:id/items/:itemId`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "orderId": "string",
  "productId": "string",
  "deletedAt": "datetime | null"
}
```

**Validation Errors:** `400 Bad Request`
```json
{
  "error": "Only Draft orders can be edited"
}
```

**Business Rules:**
- Only Draft orders can have items removed
- Order total is recalculated automatically
- Soft delete is used (deletedAt is set)

---

### Get Order History

Retrieves order history (current order with items).

**Endpoint:** `GET /orders/history/:id`

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "tenantId": "string",
  "customerId": "string",
  "orderNumber": "string",
  "orderDate": "datetime",
  "statusId": "string",
  "totalAmount": "decimal",
  "currency": "string",
  "notes": "string | null",
  "customerSnapshotName": "string",
  "customerSnapshotGstNumber": "string | null",
  "customerSnapshotBillingAddress": "json | null",
  "customerSnapshotShippingAddress": "json | null",
  "orderItems": [
    {
      "id": "uuid",
      "productId": "string",
      "quantity": "decimal",
      "unitPrice": "decimal",
      "lineTotal": "decimal",
      "currency": "string",
      "productSnapshotName": "string",
      "productSnapshotUnit": "string",
      "pricingSnapshotVersion": "integer",
      "pricingSnapshotEffectiveDate": "datetime",
      "pricingSnapshotCurrency": "string",
      "pricingSnapshotSource": "string"
    }
  ]
}
```

**Business Rules:**
- For Module 6, history returns the current order with items
- Future modules may add version history tracking
- Snapshots are used for historical rendering

---

## Business Rules Summary

### ORD-1: Tenant Scope
Every order belongs to exactly one tenant. Orders from one tenant must not be visible to another tenant.

### ORD-2: Customer Required
An order must have a customer. The customer must belong to the same tenant as the order.

### ORD-3: Order Creation From Customer
Order creation starts from a selected customer.

### ORD-4: Items Required
An order must have at least one order item before it can be confirmed.

### ORD-5: Product Required
Every order item must reference a product. The product must belong to the same tenant as the order.

### ORD-6: Quantity Required
Every order item must have a quantity (positive number).

### ORD-7: Pricing Resolution Required
Every order item must have pricing resolved according to the Pricing module before the order can be saved.

### ORD-8: Pricing Snapshot Required
Every saved order item must include an immutable pricing snapshot.

### ORD-9: Customer And Product Snapshot Safety
Saved orders must preserve customer and product context required by downstream immutable documents.

### ORD-10: Historical Safety
Saved order pricing must not change when customer pricing changes later. Saved order customer and product context must not be rewritten by later customer or product changes.

### ORD-11: Invoice Readiness
An order is eligible for invoice creation only after it is saved with required item and pricing snapshots.

### ORD-12: Draft, Edit, Status, And Cancellation Policy
In Module 6, only Draft orders can be edited, confirmed, or cancelled. Confirmed and cancelled orders are immutable.

## Module 6 Status Workflow

### Valid Statuses (Module 6)
- **Draft** (initial state) - Order being created
- **Confirmed** - Order confirmed, immutable
- **Cancelled** - Order cancelled, terminal state

### Allowed Transitions (Module 6)
- Draft → Confirmed
- Draft → Cancelled
- Confirmed → (no transitions, immutable)
- Cancelled → (no transitions, terminal)

### Blocked Statuses (Future Modules)
The following statuses exist in the database but are not accessible in Module 6:
- Pending
- Processing
- Shipped
- Delivered
- On Hold

These will be enabled in future modules (Warehouse, Delivery, Order Management).

## Snapshot Strategy

### Customer Snapshot
Captured at order creation time:
- Customer Display Name
- GST Number
- Billing Address (JSONB)
- Shipping Address (JSONB)

### Order Item Snapshot
Captured when item is added to order:

**Product Snapshot:**
- Product Code
- Product Name
- Unit

**Pricing Snapshot:**
- Unit Price
- Currency
- Pricing Version
- Pricing Effective Date
- Pricing Source (CUSTOMER_PRICE, CLIENT_DEFAULT, BASE_PRICE, MANUAL_OVERRIDE)

### Snapshot Principle
- Snapshots are immutable
- Business rendering uses snapshot values, not live records
- Foreign keys retained for navigation and reporting
- Changing Customer, Product, or Pricing later never modifies historical orders

## Architectural Principles

### Business Actions vs System Versioning
This module follows the architectural principle defined in [ADR 001: Business Actions vs System Versioning](../adr/001-business-actions-vs-system-versioning.md).

Users perform business actions (Create Order, Edit Order, Confirm Order, Cancel Order). The system manages snapshots, history, and audit internally. Users never manage versions directly.

### Phase-Aware Workflow
This module follows the phase-aware workflow defined in [ADR 002: Phase-Aware Order Workflow](../adr/002-phase-aware-order-workflow.md).

The database is future-ready with all statuses, but Module 6 only exposes Draft, Confirmed, and Cancelled statuses. Future statuses will be enabled in later modules.

## Related Documents

- [Order V1 Business Rules](../features/order/VERSIONS/V1.md)
- [Order Decision Tables](../features/order/DECISION_TABLES.md)
- [Order Gherkin Scenarios](../features/order/order.feature)
- [ADR 001: Business Actions vs System Versioning](../adr/001-business-actions-vs-system-versioning.md)
- [ADR 002: Phase-Aware Order Workflow](../adr/002-phase-aware-order-workflow.md)
- [PRINCIPLES](../PRINCIPLES.md)
- [BUSINESS_RULES](../BUSINESS_RULES.md)
- [RULES](../RULES.md)
