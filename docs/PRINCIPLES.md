# Principles

## Customer-Centered ERP

The product must organize workflows around the customer rather than around accounting records.

## Speed With Accuracy

The salesperson should be able to create an accurate order in under one minute.

## History Preservation

Business history must be preserved. Current state must not overwrite past truth.

## Immutable Business Snapshots

Orders and invoices must preserve the values that existed when the business event occurred.

## Multi-Tenant Foundation

Tenant isolation is a foundation, not a later enhancement.

## Business Actions vs System Versioning

Users perform BUSINESS ACTIONS. The system manages VERSIONS, HISTORY, and AUDIT automatically.

- Users should never manage technical versions directly
- Users should never activate or deactivate versions
- Users should never understand internal version numbers
- Versioning is an internal implementation detail
- Expose business concepts, hide technical concepts

**Examples:**
- User thinks: "Edit Price" → System performs: Create immutable version, preserve history
- User thinks: "Edit Order" → System performs: Create internal versions automatically
- User thinks: "Issue Invoice" → System performs: Maintain snapshots, audit trail

**Permanent Review Rule:**
If a user has to understand a technical concept (versions, activation, internal state management), ask whether it can be replaced with a business action instead.

See [ADR 001: Business Actions vs System Versioning](adr/001-business-actions-vs-system-versioning.md) for detailed implementation guidance.

## AI-First Documentation

Documentation must allow future AI agents to continue development without previous chat history.

## Related Documents

- [MASTER_SKILL](MASTER_SKILL.md)
- [VISION](VISION.md)
- [RULES](RULES.md)
- [GLOSSARY](GLOSSARY.md)
- [DOMAIN](DOMAIN.md)
- [ROADMAP](ROADMAP.md)
- [RELEASES](RELEASES.md)
