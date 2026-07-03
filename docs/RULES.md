# Rules

## Documentation Rules

- Never generate application code before documentation.
- Never generate feature documentation without approval.
- Every module must be documented before implementation.
- Business documentation must not contain implementation details.
- Technical documentation must not redefine business rules.
- Gherkin scenarios must be written before implementation.
- Documentation is production code.

## Product Rules

- The product must be multi-tenant from day one.
- The customer is the center of the product.
- Customer-specific pricing is the primary business capability.
- Pricing history must never be lost.
- Orders must contain immutable snapshots.
- Invoices are immutable.
- Future AI modules must be supported without redesign.

## Ambiguity Rule

If a business requirement is unclear, stop and ask questions. Do not invent business rules.

## Permanent Review Rule

If a user has to understand a technical concept (versions, activation, internal state management), ask whether it can be replaced with a business action instead.

This principle keeps the ERP intuitive for SMB users while letting the system handle all complexity behind the scenes. See [ADR 001: Business Actions vs System Versioning](adr/001-business-actions-vs-system-versioning.md) for detailed guidance.

## API Design Rule

Expose business actions, not technical operations.

APIs should reflect user-facing business concepts (Edit Price, Issue Invoice) rather than technical implementation details (activate version, deactivate version, manage state). Technical concerns like versioning, history, and audit must be handled internally by the system.

## Data Storage Rule

Relational for Operational Data. JSONB for Immutable Documents.

This is a frozen architectural rule:

- Master Data -> Relational
- Operational Transactions -> Relational
- Business Documents -> Relational metadata + JSONB immutable payload
- Execution Modules -> Relational references + optional JSONB evidence/payloads

JSONB stores immutable evidence or documents, not operational state.

### JSONB Decision Checklist

Before introducing JSONB, every developer must answer YES to all:

1. Is this data immutable after creation?
2. Is it a business document, snapshot, event, or external payload?
3. Is the structure expected to evolve?
4. Is it not the primary target of transactional queries?

If any answer is No, use relational tables.

This is documented in [ADR 004: Relational for Operational Data. JSONB for Immutable Documents.](adr/004-relational-first-jsonb-by-exception.md).

JSONB is preferred only for immutable business document snapshots, immutable historical payloads, external webhook payloads, AI request/response payloads, import/export payloads, and audit payloads.

JSONB is not preferred for Customer, Product, Pricing, User, Warehouse, Shipment, Payment, Status, or Lookup tables.

Invoices use a hybrid persistence strategy: operational fields remain relational, and the complete immutable invoice document is stored in `documentSnapshot` with `snapshotSchemaVersion`.

Invoice rendering must use `documentSnapshot`.

Orders use a hybrid persistence strategy: operational fields remain relational, and the complete immutable commercial document is stored in `orderDocumentPayload` with `snapshotSchemaVersion`.

Order rendering must use `orderDocumentPayload`.

Draft Orders may regenerate `orderDocumentPayload` whenever the Order changes. Confirmed Orders freeze `orderDocumentPayload` forever.

## Document Builder Rule

Complex document construction must live in a Builder, not in Services.

**Services orchestrate. Builders construct.**

Examples:
- OrderSnapshotBuilder
- InvoiceSnapshotBuilder
- ShipmentDocumentBuilder (future)

This rule keeps services small and maintainable as the product grows. When multiple sources need to generate the same document type (e.g., invoices from Manual Orders, WhatsApp Orders, API Orders, Imported Orders), a single Builder ensures one source of truth for document structure and construction logic.

## Related Documents

- [MASTER_SKILL](MASTER_SKILL.md)
- [VISION](VISION.md)
- [PRINCIPLES](PRINCIPLES.md)
- [GLOSSARY](GLOSSARY.md)
- [DOMAIN](DOMAIN.md)
- [ROADMAP](ROADMAP.md)
- [RELEASES](RELEASES.md)
