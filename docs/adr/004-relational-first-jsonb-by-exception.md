# ADR 004: Relational for Operational Data. JSONB for Immutable Documents.

## Status

Accepted

## Date

2026-07-03

## Context

The system needs to store two types of data:

1. **Operational/Master Data**: Customer, Product, Pricing, User, Warehouse, Shipment, Payment
2. **Business Documents**: Orders, Invoices, and future documents that must preserve immutable snapshots

Traditional relational databases excel at operational data with strong constraints, relationships, and query capabilities. However, business documents require:
- Immutable snapshots of complex nested data
- Schema evolution over time without breaking historical documents
- Self-contained reproducibility
- Flexible structure for regulatory compliance changes

Using only relational columns for business document snapshots leads to:
- Complex schema migrations when snapshot structure changes
- Difficulty adding new fields without breaking existing documents
- Challenges with nested data structures
- Schema bloat as new snapshot fields are added

Using JSONB for all data would:
- Lose relational constraints and referential integrity
- Complicate transactional queries
- Reduce data quality through lack of schema enforcement
- Make reporting and analytics more difficult

## Decision

**Relational for Operational Data. JSONB for Immutable Documents.**

This is a frozen architectural rule:

```text
Master Data
  -> Relational

Operational Transactions
  -> Relational

Business Documents
  -> Relational metadata
  + JSONB immutable payload

Execution Modules
  -> Relational references
  + Optional JSONB evidence/payloads
```

JSONB stores immutable evidence or documents, not operational state.

### JSONB Decision Checklist

Before introducing JSONB, every developer must answer YES to all:

1. Is this data immutable after creation?
2. Is it a business document, snapshot, event, or external payload?
3. Is the structure expected to evolve?
4. Is it not the primary target of transactional queries?

If any answer is No, use relational tables.

### Data Classification

**Relational Storage (Default):**
- Master Data: Customer, Product, Pricing
- Operational Data: User, Warehouse, Shipment, Payment
- Reference Data: Status tables, Lookup tables
- Transactional Data: Any data requiring complex queries, joins, or constraints

**JSONB Storage (Exception):**
- Business Document Snapshots: Order snapshots, Invoice documentSnapshot
- Immutable Historical Payloads: Historical records that must not change
- External Webhook Payloads: Incoming/outgoing webhook data
- AI Request/Response Payloads: AI interaction history
- Import/Export Payloads: Data transfer formats
- Audit Payloads: Complex audit trail data

### Payload Enforcement

- Business documents are invalid without a document payload.
- Document payloads must never be empty or default to `{}`.
- Document payloads are generated only by Document Builders.
- If payload generation fails, document creation/update must fail.
- Every document payload must include immutable metadata: `schemaVersion`, `generatedAt`, and `generatedBy`.

### Frozen Module Strategy

| Module | Relational | JSONB |
| --- | --- | --- |
| Customer | Yes | No |
| Product | Yes | No |
| Pricing | Yes | No |
| Order | Yes | Yes, `orderDocumentPayload` |
| Invoice | Yes | Yes, `documentSnapshot` |
| Warehouse | Yes | Optional, `pickListSnapshot` |
| Shipment | Yes | Optional, `carrierPayload`, `labelPayload` |
| Delivery | Yes | Optional, `proofOfDelivery` |
| Payment | Yes | Optional, `gatewayResponse` |
| WhatsApp | Yes | Yes, `messagePayload` |
| AI | Yes | Yes, `requestPayload`, `responsePayload` |

### Invoice Implementation

**Schema Change:**
- Remove invoice-level snapshot columns such as customer snapshot and order snapshot columns from `invoices`.
- Add `documentSnapshot` as the complete immutable invoice document JSONB payload.
- Add `snapshotSchemaVersion` as an integer with default `1`.
- Keep relational fields needed for search, reporting, workflow, tenant isolation, and traceability.

**Relational Columns (Search & Reporting):**
- `tenantId` - Tenant isolation
- `customerId` - Customer reference
- `orderId` - Source order reference
- `invoiceNumber` - Invoice identifier
- `statusId` - Invoice status
- `issuedAt` - Issue date (indexed)
- `dueDate` - Due date
- `totalAmount` - Total amount (indexed)
- `taxAmount` - Tax amount
- `discountAmount` - Discount amount
- `currency` - Currency
- `correlationId` - End-to-end tracing

**JSONB Column (Document Snapshot):**
- `documentSnapshot` - Complete invoice document including:
  - Customer snapshot (name, GST, addresses)
  - Order snapshot (number, date, totals)
  - Invoice line items (product, pricing, quantities)
  - Totals and currency
  - Metadata required to reproduce the invoice
- `snapshotSchemaVersion` - Identifies which snapshot schema version was used

**Rendering:**
- Invoice rendering must use `documentSnapshot` only
- Never join to live Customer, Product, Pricing, or Order for rendering
- Relational columns are used for search, filtering, and reporting only

### Decision Examples

**Use relational tables for:**
- Customer profile fields that users edit and search
- Product SKU, name, unit, and active state
- Customer-specific pricing and pricing versions
- Invoice status workflow and invoice list filters
- Payment amount, currency, and invoice settlement references

**Use JSONB for:**
- Complete invoice document snapshot
- Immutable webhook request/response payloads
- AI request/response payloads kept for audit or explanation
- Import/export source payloads kept for traceability
- Audit payloads that preserve historical context

### Benefits

- Keeps operational data queryable, constrained, and reportable
- Keeps business documents self-contained and reproducible
- Allows invoice document structure to evolve without rewriting old invoices
- Avoids schema bloat from adding many one-off snapshot columns
- Makes misuse of JSONB visible through explicit approval criteria

### Order Module

Order is a hybrid business document.

- Operational fields remain relational for workflow, search, reporting, tenant isolation, and traceability.
- `orderDocumentPayload` stores the complete immutable commercial representation as JSONB.
- `snapshotSchemaVersion` identifies the Order payload structure and defaults to `1`.
- Draft Orders may regenerate `orderDocumentPayload` whenever the Order changes.
- Confirmed Orders freeze `orderDocumentPayload` forever.
- Order rendering must use `orderDocumentPayload`.

Every business document owns an immutable JSONB payload. Operational fields remain relational. Business documents are rendered from the JSONB payload.

## Rationale

1. **Best of Both Worlds**: Relational constraints for operational data, JSONB flexibility for immutable documents
2. **Schema Evolution**: Business documents can evolve without breaking historical records
3. **Query Performance**: Relational columns enable efficient search and reporting
4. **Data Integrity**: Referential integrity maintained for operational data
5. **Backward Compatibility**: Historical documents remain readable regardless of schema changes
6. **Regulatory Compliance**: Flexible structure supports changing regulatory requirements

## Consequences

### Positive

- Relational constraints protect data quality for operational data
- JSONB enables schema evolution for business documents
- Efficient queries using relational columns for search/reporting
- Historical documents remain readable across schema versions
- Clear decision criteria prevent misuse of JSONB
- Supports complex nested structures without schema bloat

### Negative

- Hybrid approach increases complexity
- Requires discipline to follow decision criteria
- JSONB data not validated by database schema
- Requires application-level validation for JSONB content
- Potential for inconsistent JSONB structures if not carefully managed

### Implementation Notes

**Decision Criteria Enforcement:**
- Code review must verify JSONB usage meets all four conditions
- Architecture review required for new JSONB columns
- Document justification in ADR or architecture notes

**JSONB Schema Validation:**
- Use `snapshotSchemaVersion` to track schema evolution
- Application-level validation for JSONB structure
- Consider JSON schema validation libraries for complex payloads

**Query Strategy:**
- Use relational columns for WHERE clauses, JOINs, and sorting
- Use JSONB for document reconstruction and rendering
- Create GIN indexes on JSONB columns if querying JSONB content

**Migration Strategy:**
- Increment `snapshotSchemaVersion` when JSONB structure changes
- Maintain backward compatibility for rendering historical documents
- Document schema evolution in ADRs

## Anti-Patterns

**Do NOT use JSONB for:**
- Customer master data
- Product master data
- Pricing master data
- User accounts
- Warehouse inventory
- Shipment tracking
- Payment transactions
- Status codes
- Lookup tables
- Any data requiring foreign key constraints
- Any data requiring complex relational queries

**Do NOT use relational columns for:**
- Business document snapshots that will evolve
- Immutable historical payloads
- Complex nested structures that change frequently
- External webhook payloads
- AI request/response history

## Related Documents

- [ADR 003: Business Document Independence](003-business-document-independence.md)
- [ARCHITECTURE_V1_FINAL.md](../../ARCHITECTURE_V1_FINAL.md)
- [TECH_STACK.md](../TECH_STACK.md)
- [RULES.md](../RULES.md)
