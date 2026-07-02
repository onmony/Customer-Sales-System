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

## Related Documents

- [MASTER_SKILL](MASTER_SKILL.md)
- [VISION](VISION.md)
- [PRINCIPLES](PRINCIPLES.md)
- [GLOSSARY](GLOSSARY.md)
- [DOMAIN](DOMAIN.md)
- [ROADMAP](ROADMAP.md)
- [RELEASES](RELEASES.md)

