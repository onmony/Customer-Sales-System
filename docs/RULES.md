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
- Every business workspace must implement the standard Workspace Interaction Patterns. New workspaces must reuse these patterns instead of inventing new interaction models.
- The Application Shell is permanent. Every workspace must inherit the same Header, Left Navigation, Search, Footer, Right Context Panel, Toolbar, Theme, Typography, and Color Palette.
- The Workspace Directory belongs to the current workspace. It is not application navigation.
- ProOS has one Primary Brand Color. Individual workspaces must not introduce darker or different navigation colors.
- Customer Workspace is the design master for future workspaces. New workspaces must inherit the approved layout, navigation model, visual language, interaction patterns, shell, personalization, information density, and business-first philosophy.
- Compress before remove. When space is limited, reduce spacing, padding, card height, optional sections, or component size before removing operationally valuable information.

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

## Product Foundation Rules

The Product Foundation is the highest authority for all product decisions.

Every future decision must follow this hierarchy:

Product Foundation
↓

UX Foundation
↓

UI Constitution
↓

Design System
↓

React Foundation
↓

Business Workspaces

No UX, UI, component, workflow or feature may contradict a higher level.

1.
Every UX decision must trace back to the Product Foundation.

2.
Every UI component must trace back to the UX Foundation.

3.
Every Design System decision must support the UI Constitution.

4.
React components implement the Design System.
They never invent new design patterns.

5.
Business Workspaces reuse approved components.
They do not create their own design language.

6.
Whenever there is a conflict between:

Customer Productivity

and

Visual Beauty

Customer Productivity wins.

7.
Whenever there is a conflict between:

Speed

and

Animation

Speed wins.

8.
Whenever there is a conflict between:

Consistency

and

Creativity

Consistency wins.

9.
Whenever there is a conflict between:

Customer Ease

and

Visual Design

Customer Ease wins.

10.
Every automatic business decision made by the backend must be explainable in the UI.

The UI must clearly communicate:

- What happened
- Why it happened
- What business rule was applied
- What the user can do next

11.
The application is designed for professionals who use it daily.

Useful information is more valuable than decorative design.

12.
No new component may be introduced unless:

- an approved component cannot be reused, or
- the Product Foundation and UI Constitution are updated first.

13.
The Product Foundation is considered frozen.

Future changes require review and explicit approval.

14.
Customer Workflow First

The product is designed around complete business workflows, not software modules.

Users think in terms of:

Customer
↓

Pricing
↓

Order
↓

Invoice
↓

Payment

—not—

Tables

Forms

Screens

Modules

Every workspace must help the user complete a business process from start to finish with the fewest possible steps.

Navigation, layout, and actions must follow the natural business workflow rather than the underlying technical implementation.

Business modules exist for engineering. Workflows exist for customers.

When there is a conflict, the workflow always wins.

15.
Business Context First

Every screen must immediately answer the user's business questions.

Users should not have to navigate multiple screens to understand the current business situation.

Where appropriate, the UI should provide sufficient context to make confident decisions without unnecessary navigation.

The goal is to reduce context switching and keep users focused on running the business rather than operating the software.

For example:

On an Order screen, the user should see the customer, pricing context, status, totals, and next actions without opening three other screens.
On an Invoice screen, they should immediately understand where it came from, its status, and what needs to happen next.

## Related Documents

- [MASTER_SKILL](MASTER_SKILL.md)
- [VISION](VISION.md)
- [PRINCIPLES](PRINCIPLES.md)
- [GLOSSARY](GLOSSARY.md)
- [DOMAIN](DOMAIN.md)
- [ROADMAP](ROADMAP.md)
- [RELEASES](RELEASES.md)
