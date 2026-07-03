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

Relational tables are the default storage strategy. JSONB is approved only when ALL of the following conditions are met:

1. **Immutability**: The data is immutable after creation
2. **Business Document/Payload**: The data represents a business document, snapshot, event, or payload
3. **Schema Evolution**: The structure is expected to evolve over time
4. **Non-Transactional**: The data is not the primary source for transactional queries

If these conditions are not met, use relational tables.

This is documented as "Relational First, JSONB by Exception." See [ADR 004: Relational First, JSONB by Exception](adr/004-relational-first-jsonb-by-exception.md) for detailed strategy.

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

