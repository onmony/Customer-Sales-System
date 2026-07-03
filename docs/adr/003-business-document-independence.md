# ADR 003: Business Document Independence

## Status

Accepted

## Date

2026-07-03

## Context

In a multi-module ERP system, business documents (Orders, Invoices, Shipments, Payments) must preserve the exact commercial context at the time of business events. If these documents depended on live master data (Customer, Product, Pricing), later changes to master data would corrupt historical business records.

For example:
- If an Invoice read live Customer data, changing a customer's address would retroactively alter issued invoices
- If an Invoice read live Product data, changing a product name would alter historical invoices
- If an Invoice read live Pricing data, price changes would rewrite historical invoices

This violates accounting principles and creates audit trail corruption.

## Decision

**Every business document is independently reproducible.**

Business documents must own their own immutable snapshots of all data required to reproduce the document forever. Once generated, a business document becomes completely independent of live master data.

### Data Classification

**Master Data (Mutable, Referenced):**
- Customer
- Product
- Pricing

**Business Documents (Immutable, Self-Contained):**
- Order → Commercial Document (Own Snapshot)
- Invoice → Accounting Document (Own Snapshot)
- Warehouse → Operational Document (Future)
- Shipment → Operational Document (Future)
- Payment → Financial Transaction (Future)

### Snapshot Principle

1. **Generation**: Business documents are generated from snapshots of master data at the time of business event
2. **Independence**: After generation, business documents never read live master data
3. **Immutability**: Business document snapshots are never modified
4. **Reproducibility**: Business documents can be reproduced entirely from their own snapshots

### Schema Evolution

Business documents are immutable, but business document schemas evolve over time.

**snapshotSchemaVersion:**
- Each business document includes a `snapshotSchemaVersion` field
- Identifies which snapshot schema version was used when the document was generated
- Default value: 1
- Future schema changes must increment this version

**Purpose:**
- Enables backward compatibility when rendering historical documents
- Allows the system to understand how to interpret snapshot data based on version
- Supports schema evolution without breaking existing documents

**Example:**
- Version 1: Basic customer, product, pricing snapshots
- Version 2: Added tax breakdown fields
- Version 3: Added regulatory compliance fields

When rendering a document, the system checks `snapshotSchemaVersion` to determine which fields are available and how to interpret them.

**End-to-End Tracing:**
- Business document items include `correlationId` for end-to-end tracing
- Enables tracing across: Order → Invoice → Warehouse → Shipment → Payment
- Supports debugging and audit trail reconstruction

### Invoice Implementation

Invoice is generated from Order snapshot once:

**Relational Columns (Search & Reporting):**
- tenantId, customerId, orderId, invoiceNumber, statusId
- issuedAt, dueDate, totalAmount, taxAmount, discountAmount
- currency, correlationId

**JSONB Document Snapshot (Rendering):**
- `documentSnapshot` - Complete invoice document in JSONB format:
  - Customer snapshot (name, GST, billing address, shipping address)
  - Order snapshot (number, date, total amount, currency)
  - Invoice line items (product, pricing, quantities, totals)
  - Metadata required to reproduce the invoice
- `snapshotSchemaVersion` - Identifies which snapshot schema version was used

**Storage Strategy:**
- Relational columns for search, filtering, and reporting
- JSONB for complete document snapshot and rendering
- See [ADR 004: Relational First, JSONB by Exception](004-relational-first-jsonb-by-exception.md) for detailed strategy

After generation:
- Invoice becomes completely independent
- Invoice rendering uses `documentSnapshot` only
- Invoice never reads live Customer, Product, Pricing, or Order

### Future Modules

Future modules must reference Invoice as the accounting source of truth:

- Warehouse → References Invoice (not Order)
- Shipment → References Invoice (not Order)
- Delivery → References Invoice (not Order)
- Payment → References Invoice (not Order)

They must never reconstruct commercial information from Customer, Product, or Pricing.

## Rationale

1. **Audit Integrity**: Historical business records are preserved exactly as issued
2. **Accounting Compliance**: Invoices are legally binding documents that must not change
3. **Regulatory Requirements**: Tax authorities require immutable invoice records
4. **Business Continuity**: Master data changes do not corrupt historical documents
5. **Reproducibility**: Business documents can be reproduced without live data dependencies

## Consequences

### Positive

- Guaranteed audit trail integrity
- Accounting compliance with regulatory requirements
- Historical business records are immutable
- Master data changes do not corrupt historical documents
- Business documents are independently reproducible

### Negative

- Data duplication (intentional and necessary)
- Increased storage requirements
- More complex data model
- Requires careful snapshot generation logic

### Implementation Notes

**Schema Design:**
- Business documents include snapshot fields (not foreign keys to master data)
- Snapshot fields are immutable after document generation
- JSONB for complex nested data (addresses)

**Generation Workflow:**
1. Read source data (Order, Customer, Product, Pricing)
2. Create snapshots in business document
3. Business document becomes independent
4. Source data changes no longer affect business document

**Rendering:**
- Business document rendering uses only snapshot fields
- Never join to live master data for rendering
- PDF generation uses snapshot data only

**Data Duplication:**
- Duplication is intentional and approved
- Normalization is avoided for business documents
- This is a deliberate architectural decision

## Related Documents

- [Invoice V1](../features/invoice/VERSIONS/V1.md)
- [Order V1](../features/order/VERSIONS/V1.md)
- [ADR 001: Business Actions vs System Versioning](001-business-actions-vs-system-versioning.md)
- [PRINCIPLES.md](../PRINCIPLES.md)
