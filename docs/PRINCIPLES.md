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

## The Workspace Adapts to the Professional

Professionals spend thousands of hours using the product.

The system should learn and preserve how each user prefers to work.

Where appropriate, workspaces should remember user preferences including:

- Expanded and collapsed sections
- Panel sizes
- Table column widths
- Column order
- Sort order
- Filters
- Workspace density
- Default tabs
- Recently used actions

The goal is to reduce repetitive configuration and allow every workspace to feel personally optimized.

The workspace should adapt to the professional rather than forcing the professional to adapt to the workspace.

## Audit vs Business History

**Audit (Technical History):**
- Captures: who, when, what changed
- Purpose: System integrity, debugging, compliance
- Implementation: Audit columns (`createdAt`, `updatedAt`, `createdBy`, `updatedBy`)
- Scope: All entities in all modules
- User Visibility: Read-only, for compliance and transparency

**Business History (Domain-Specific):**
- Captures: Business state transitions meaningful to users
- Purpose: Business intelligence, decision support, workflow tracking
- Implementation: Dedicated revision tables (when needed)
- Scope: Only when business value justifies complexity
- User Visibility: Read-only, for business decisions

**Decision Principle:**
- Use audit columns by default (low complexity, universal value)
- Introduce business history tables only when:
  - Users need to compare business states for decision-making
  - Workflow complexity requires state tracking beyond audit
  - Customer value justifies implementation cost

**Example: Order Module (Module 6):**
- Draft orders use audit columns only
- No dedicated OrderRevision table in Module 6
- OrderRevision deferred to Module 10+ when warehouse/invoice integration adds value
- Audit columns provide sufficient technical history for compliance and debugging

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
