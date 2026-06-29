# Architecture Critique

## Purpose

This document reviews the repository as a Principal Software Architect with a bias toward finding weaknesses before database, API, and frontend implementation begin.

It is intentionally critical. The goal is to expose the decisions that will become expensive after the system grows beyond early Phase 1 usage.

Related documents:

- [Product Vision](docs/VISION.md)
- [Master Skill](docs/MASTER_SKILL.md)
- [Rules](docs/RULES.md)
- [Domain Model](docs/DOMAIN.md)
- [Glossary](docs/GLOSSARY.md)
- [Customer Workspace Business Context](docs/business/CUSTOMER_WORKSPACE.md)
- [Customer Workspace ADR](docs/decisions/ADR-010-Customer-Workspace.md)
- [Navigation](docs/product/NAVIGATION.md)
- [Events](docs/technical/EVENTS.md)
- [Data Ownership](docs/technical/DATA_OWNERSHIP.md)
- [Dependencies](docs/technical/DEPENDENCIES.md)
- [Role Matrix](docs/security/ROLE_MATRIX.md)
- [Architecture Review](REVIEW.md)
- [Architecture Hardening Notes](REVIEW_NOTES.md)

## Executive Assessment

The repository has a strong documentation-first foundation, but the current architecture still has several unresolved pressure points:

- The customer-centered product vision is documented, but several operational policies needed to make the Customer Workspace reliable are not yet explicit.
- Phase 1 implementation proves domain behavior in memory, but it does not yet establish the architecture that will survive PostgreSQL, Prisma, Express, React, authorization, and multi-tenant production usage.
- Pricing is correctly treated as the strategic capability, but it is also the highest-risk area because versioning, effective dates, customer-product scale, approvals, import, precision, and audit policy are still incomplete.
- Event architecture is documented conceptually, but there is no event envelope, outbox, ordering, idempotency, replay, or integration policy yet.
- Multi-tenancy appears in documentation and simple record fields, but there is no central tenant enforcement strategy.
- The Customer Workspace is the right product direction, but it risks becoming an expensive, tightly coupled page unless backed by explicit read models and bounded module ownership.

The largest risk is not that the system lacks features. The largest risk is that the next implementation phase could accidentally turn good documentation into a tightly coupled CRUD application before the domain boundaries, tenant boundaries, and event boundaries are hardened.

## Business Model Weaknesses

The product is positioned as a Customer Relationship ERP, not an accounting-first ERP. That is the correct strategic distinction, but the business model still needs sharper operational rules.

### Pain Points

- Customer is the center of the workflow, but customer lifecycle rules are still thin. The documentation does not yet fully define duplicate customers, inactive customers, blocked customers, credit hold, payment terms, preferred warehouse, preferred transport, sales ownership, or customer merge rules.
- The workflow includes Customer, Order, Pricing Resolution, Invoice, Warehouse, Shipment, Delivery, and sometimes Payment. The inclusion of Payment is inconsistent across documents and needs a clear product decision.
- Accounting is stated as only one module, but invoice immutability and payment handling will inevitably intersect with finance controls. The boundary between operational invoicing and accounting needs to be explicit before implementation.
- The “order in under one minute” goal is clear, but the exact workflow shortcuts needed to achieve it are not fully modeled as business rules.
- The Customer Workspace is described as operational context, but the documents do not define freshness requirements for outstanding balance, current pricing, frequent products, and recent activity.

### Recommendations

- Create explicit business rules for customer lifecycle status, credit hold, duplicate prevention, customer merge, payment terms, sales ownership, and customer-specific operational preferences.
- Decide whether Payment is inside Phase 1 workflow vocabulary or deferred to a future Finance/Accounting module.
- Define “order in under one minute” as measurable acceptance criteria, not only a product aspiration.
- Create a business document for operational freshness: what must be real-time, near real-time, cached, or manually refreshed.

## DDD Weaknesses

The documentation uses aggregate language, but the implementation is still closer to service-and-repository scripting than a durable DDD architecture.

### Pain Points

- Aggregates are named, but aggregate boundaries are not fully enforced in implementation.
- Customer, Product, Pricing, Order, and Invoice each live mostly inside one file per module, mixing entity creation, validation, repository behavior, service orchestration, ID generation, time handling, cloning, and error handling.
- Important value objects are missing: `Money`, `Quantity`, `TenantId`, `CustomerId`, `ProductId`, `PricingVersion`, `EffectiveDateRange`, `Snapshot`, `InvoiceNumber`, and `OrderStatus`.
- Order currently depends on full customer/product/pricing objects rather than stable command inputs and repositories. This creates coupling that will become painful once API, database, and transactions are introduced.
- Domain events are documented but not emitted by aggregates or services.
- Transaction boundaries are not defined. Order confirmation, pricing snapshot creation, and invoice generation will need clear consistency rules.
- There is no explicit distinction between domain services, application services, repositories, DTOs, and adapters.

### Recommendations

- Before PostgreSQL implementation, define a source folder architecture that separates domain, application, ports, adapters, and tests.
- Introduce value objects in the design documentation before implementing database schemas.
- Define aggregate command contracts, not only service methods.
- Define transaction boundaries for pricing changes, order creation, order confirmation, invoice generation, and invoice issuance.
- Define domain event emission rules per aggregate.

## Folder Structure Weaknesses

The documentation folder is stronger than the source structure. The source structure is adequate for Phase 1 demonstration but not for production architecture.

### Pain Points

- Source files are shallow and module-local, but they will become oversized as persistence, API validation, authorization, events, and adapters are added.
- Shared concerns are repeated or implied across modules: tenant validation, IDs, clocks, errors, cloning/freezing, money validation, and status transitions.
- There is no clear place for cross-cutting contracts such as event envelopes, tenant context, authorization policies, or audit metadata.
- Tests are organized by category, but production code is not organized by architectural layer.

### Recommendations

- Define a technical ADR for source folder layering before adding Express, Prisma, or React.
- Add explicit future folders in documentation for `domain`, `application`, `ports`, `adapters`, and `shared`.
- Keep feature documentation self-contained, but do not force source code to mirror documentation one-file-per-feature.
- Create shared technical rules for errors, tenant context, clocks, IDs, money, and event envelopes.

## Navigation Weaknesses

The navigation design correctly prioritizes Customers and the Customer Workspace. The weakness is that customer-first navigation may accidentally hide operational modules that also need queue-based workflows.

### Pain Points

- Warehouse, Finance, and Management users may need module-level queues, not only customer-scoped tabs.
- A salesperson benefits from Customer Workspace, but warehouse staff may need shipment queues, pick lists, packing views, and dispatch boards.
- Finance may need invoice aging, payment collection, disputed invoices, and credit holds across all customers.
- Customer Workspace tabs could become overloaded if every future module adds tab content directly.
- Breadcrumbs are documented, but deep-linking, saved filters, and return-to-workflow behavior are not yet defined.

### Recommendations

- Preserve Customer Workspace as the salesperson entry point, but define parallel operational module workspaces for Warehouse, Finance, and Management.
- Define which pages are customer-scoped views and which are operational queues.
- Add navigation rules for deep links, recently viewed customers, return paths after creating an order, and cross-module search.
- Prevent the Customer Workspace from becoming a container for unrelated module complexity.

## Pricing Weaknesses

Pricing is the most important domain capability and the largest future risk.

### Pain Points

- Pricing versioning exists conceptually, but effective-date policy is underdeveloped.
- “Latest price wins” is not enough for backdated orders, scheduled price changes, expired pricing, future prices, audit reconstruction, or invoice disputes.
- Currency, tax inclusivity, unit of measure, rounding, decimal precision, discounts, minimum order quantity, and price approval are not yet fully defined.
- A price per customer per product creates a large data matrix. At scale, this becomes difficult to manage, search, import, approve, and audit.
- Bulk import and templates are deferred, but they may be required earlier than expected because manual customer-product pricing will become painful quickly.
- Pricing has no documented conflict policy for overlapping versions or duplicate active prices.
- There is no explicit pricing authorization rule for who can change prices, approve prices, import prices, or view margin-sensitive data.
- There is no documented pricing explainability requirement for salesperson trust.

### Recommendations

- Define effective date, expiry date, future price, and backdated order behavior before database design.
- Add pricing conflict rules for duplicate customer-product prices and overlapping effective ranges.
- Introduce pricing templates, customer groups, price lists, or fallback pricing earlier in the roadmap.
- Define money precision, rounding, currency, and tax treatment as technical and business rules.
- Require every pricing change to include actor, reason, source, approval status, and audit metadata.
- Define a pricing resolution explanation object that can be shown in the UI and stored in order snapshots.

## Customer Workspace Weaknesses

The Customer Workspace is strategically important, but it is also a high-coupling risk.

### Pain Points

- The workspace wants outstanding balance, credit limit, last order, frequently ordered products, current pricing, preferred warehouse, preferred transport, quick order creation, and recent activity.
- Most of this information is not owned by the Customer aggregate.
- Without read models, the workspace will require many cross-module queries.
- Recent Activity requires either an event log or an activity stream. Neither is implemented yet.
- Outstanding balance and credit status require finance/payment rules that are not yet fully modeled.
- Frequently ordered products require order history aggregation and ranking rules.
- Current pricing requires fast customer-product pricing lookup and possibly pricing previews.
- Preferred warehouse and preferred transport are mentioned but not yet modeled as customer preferences.

### Recommendations

- Design Customer Workspace as a read model, not as direct aggregate composition.
- Define workspace data ownership and freshness per field.
- Define degraded states when some modules are unavailable or not yet implemented.
- Add a Customer Workspace API contract before UI implementation.
- Keep workspace commands routed to owning modules instead of letting Customer mutate other aggregates.

## Future Extensibility Weaknesses

The docs name future modules, but the extension model is not yet strong enough.

### Pain Points

- Warehouse, Shipment, Delivery, Payment, Accounting, AI, Documents, and Notes are referenced but not all have feature packages.
- No extension rules exist for webhooks, external integrations, API clients, automation, or AI modules.
- No module lifecycle exists for feature maturity, deprecation, or version migration.
- No integration boundary exists for external accounting tools, transport providers, payment gateways, or warehouse systems.

### Recommendations

- Create feature packages for Warehouse, Shipment, Delivery, and Payment before implementation touches those concepts.
- Add an Integration Architecture document before external API design.
- Define module versioning and migration rules.
- Define extension rules for future AI modules, webhooks, and background automations.

## AI Readiness Weaknesses

The documentation is AI-friendly, but the product data model is not yet AI-ready.

### Pain Points

- Events do not yet include correlation IDs, causation IDs, actor IDs, source, confidence, or reason fields.
- There is no provenance model for AI-generated suggestions.
- There is no approval workflow for AI-generated pricing, order recommendations, or customer insights.
- There is no boundary for what AI can read, suggest, change, or automate.
- The Role Matrix includes Future API but not Future AI permissions.
- There is no documented prompt/context packaging policy for future agents.
- There is no retrieval model for customer history, price history, order history, and invoice history.

### Recommendations

- Add AI governance before implementing AI features: read permissions, suggestion permissions, approval requirements, audit trail, and rollback behavior.
- Add event metadata that supports future AI learning and explainability.
- Define AI suggestion records as auditable objects, not transient UI messages.
- Create AI context boundaries per module so future agents do not require the entire repository or entire tenant dataset.

## Performance Weaknesses

Current implementation is intentionally in-memory and is acceptable for Phase 1 tests. It must not influence production persistence design.

### Pain Points

- In-memory repositories use simple scans and arrays. This will not translate safely to database query design.
- Customer Workspace can easily become an N+1 query page.
- Pricing resolution can become slow if every order line requires independent customer-product lookup without proper indexes.
- Event logs, order history, invoice history, and activity feeds will grow quickly.
- Search is not designed yet for customer names, product SKUs, invoice numbers, or order references.
- No pagination, sorting, filtering, or cursor strategy is documented for large lists.
- No caching strategy exists for pricing, customer workspace summaries, or frequently ordered products.

### Recommendations

- Define required database indexes before Prisma schema implementation.
- Design read models for Customer Workspace, recent activity, current pricing, outstanding balance, and frequent products.
- Define pagination and filtering rules for every list API.
- Create performance budgets for order creation, pricing resolution, customer search, and workspace load.
- Add query-shape review as part of database implementation.

## Security Weaknesses

Security is documented at a role-matrix level but not yet at a production enforcement level.

### Pain Points

- Role Matrix does not yet define object-level authorization.
- Tenant isolation strategy is not defined as database-enforced, application-enforced, or both.
- There is no API authentication architecture.
- There is no session, token, refresh, service-account, or API-key policy.
- Export/import permissions are too broad for sensitive customer and pricing data.
- Pricing visibility may expose margin-sensitive or negotiated customer information.
- Audit actor rules are not yet implemented or fully specified.
- There is no field-level masking strategy for financial or customer contact data.
- Future API role is vague and could become a security gap.

### Recommendations

- Define tenant isolation with database constraints and application-level tenant context.
- Consider PostgreSQL Row Level Security or equivalent tenant-safe query enforcement.
- Add object-level permission rules for customer ownership, branch/region access, pricing changes, invoice issuance, exports, and imports.
- Split pricing permissions into view, create, update, approve, import, export, and view-sensitive-data.
- Define audit requirements for every privileged action.

## Scalability Weaknesses

The architecture is still early enough to harden, but scale will expose weak boundaries quickly.

### At 100 Customers

Likely pain:

- Duplicate customers begin appearing.
- Salespeople need fast search and recent customer lists.
- Manual customer-specific pricing remains manageable but error-prone.
- Missing customer status, credit hold, and payment terms begin affecting order accuracy.
- Customer Workspace can still load directly from simple queries, but unclear ownership starts showing.

Required before this point:

- Customer duplicate policy.
- Customer status rules.
- Basic customer search.
- Pricing change audit reason.
- Workspace read model shape.

### At 1,000 Customers

Likely pain:

- Manual pricing per customer/product becomes tedious.
- Customer search needs indexing, filtering, and ranking.
- Sales ownership and territory rules become important.
- Role Matrix needs object-level scoping.
- Pricing import/export becomes operationally necessary.
- Order and invoice lists need pagination and filters.
- Workspace tabs need lazy loading.

Required before this point:

- Indexed customer and product search.
- Pricing bulk import/export rules.
- Tenant-aware repository enforcement.
- Object-level authorization.
- Paginated API contracts.
- Operational activity feed.

### At 10,000 Customers

Likely pain:

- Customer-product pricing matrix can explode.
- Current price lookup must be indexed and cacheable.
- Price changes need approval workflows and conflict detection.
- Customer Workspace cannot calculate outstanding, frequent products, and recent activity on demand.
- Sales teams need segmentation, templates, customer groups, and price lists.
- Reporting and exports become background jobs.
- Import validation must be asynchronous and auditable.

Required before this point:

- Pricing templates or customer groups.
- Effective-date pricing engine.
- Read models for workspace summaries.
- Background jobs for imports, exports, and reports.
- Event outbox.
- Search infrastructure or database full-text strategy.

### At 100,000 Orders

Likely pain:

- Order and invoice snapshots create large immutable storage.
- Activity feed and event log grow rapidly.
- Workspace recent activity becomes slow without precomputed projections.
- Invoice generation and issuance need transactional guarantees.
- Order-to-invoice traceability becomes critical for support and audit.
- Reports and dashboards require analytical projections, not OLTP queries.
- Archiving, retention, and partitioning decisions become unavoidable.
- Replaying pricing and invoice history requires exact historical data, not inferred current records.

Required before this point:

- Event envelope, event store or outbox, and projection strategy.
- Immutable snapshot storage policy.
- Partitioning or archival strategy for orders, invoices, and events.
- Reporting read models.
- Strong idempotency for invoice generation and external integrations.
- Operational observability around order creation, pricing resolution, and invoice issuance.

## Testability Weaknesses

The test suite verifies Phase 1 behavior, but future database/API/UI work will need a broader testing strategy.

### Pain Points

- Current tests are in-memory and do not catch persistence, query, transaction, or concurrency bugs.
- There are no repository contract tests.
- There are no authorization tests.
- There are no tenant leak tests across every module.
- There are no concurrency tests for pricing changes, order confirmation, or invoice issuance.
- There are no property-based tests for pricing resolution or effective-date selection.
- Gherkin exists, but there is no clear automation bridge from feature files to executable acceptance tests.

### Recommendations

- Add repository contract tests before implementing Prisma adapters.
- Add tenant isolation tests for every query and command.
- Add authorization matrix tests.
- Add concurrency and idempotency tests for invoice generation and pricing changes.
- Add acceptance test mapping from Gherkin scenarios to automated tests.

## Maintainability Weaknesses

The codebase is still small, but the current implementation pattern will not scale cleanly.

### Pain Points

- One-file modules will become hard to maintain as behavior grows.
- Cross-cutting rules will be duplicated unless extracted carefully.
- Documentation and implementation may drift because there is no doc-to-test traceability matrix.
- Business rules are documented, but not all rules have stable identifiers.
- ADRs exist, but there is no open decision register for unresolved architecture questions.
- Feature packages are self-contained, but cross-feature changes may require updates in many places.

### Recommendations

- Add rule IDs to business rules, decision table rows, Gherkin scenarios, tests, and implementation references.
- Create an Architecture Decision Register that lists accepted, proposed, and unresolved decisions.
- Define documentation update rules for any source change.
- Split implementation by architecture layer before adding persistence and APIs.

## Multi-Tenancy Weaknesses

Multi-tenancy is stated as a day-one requirement, but enforcement is not yet architecturally strong.

### Pain Points

- Tenant IDs exist in records, but there is no central `TenantContext`.
- Repository methods rely on callers to pass tenant IDs correctly.
- There is no tenant-aware ID strategy.
- There is no database-level tenant isolation plan.
- There is no test suite specifically designed to prove tenant isolation.
- Events, audit logs, imports, exports, and AI context all need tenant scoping.
- Future API clients could accidentally query across tenants without central enforcement.

### Recommendations

- Define tenant context as a required application boundary.
- Require every command, query, event, audit entry, import, export, and AI context to carry tenant identity.
- Use database constraints and possibly Row Level Security to prevent cross-tenant leakage.
- Add tenant isolation tests as mandatory tests for every repository and API endpoint.

## Event Architecture Weaknesses

The event list is useful, but it is not yet an event architecture.

### Pain Points

- Events do not yet have a standard envelope.
- Producer and consumer documentation exists, but transactional publication rules do not.
- There is no outbox pattern decision.
- There is no idempotency strategy.
- There is no ordering strategy per aggregate or tenant.
- There is no event versioning policy.
- There is no replay/projection strategy.
- There is no dead-letter or retry policy.
- Audit events and integration events are not separated.
- Notification implications are documented conceptually but not operationally.

### Recommendations

- Create an event envelope with event ID, tenant ID, aggregate type, aggregate ID, event type, version, timestamp, actor ID, correlation ID, causation ID, source, and payload.
- Decide between event store, outbox, or hybrid event architecture.
- Define event publishing inside transaction boundaries.
- Define idempotency keys for integrations and invoice generation.
- Separate domain events, integration events, audit events, and notification events.
- Define projection ownership for Customer Workspace, reporting, and AI context.

## Highest-Risk Decisions Before Database Implementation

These decisions should be made before PostgreSQL, Prisma, Express, and React work begins:

1. Tenant isolation strategy.
2. Source architecture layering.
3. Pricing effective-date and conflict rules.
4. Money, currency, precision, rounding, and tax policy.
5. Customer Workspace read model strategy.
6. Event envelope and outbox strategy.
7. Authorization enforcement model.
8. Order and invoice transaction boundaries.
9. Snapshot storage strategy.
10. API pagination, filtering, and search conventions.
11. Import/export security and audit policy.
12. Gherkin-to-test traceability strategy.

## Recommended Architecture Hardening Backlog

### Must Do Before Database Design

- Create ADR for source code layering.
- Create ADR for multi-tenant enforcement.
- Create ADR for event envelope and outbox.
- Create ADR for pricing effective dates and conflict resolution.
- Create technical document for money and quantity value objects.
- Create Customer Workspace read model specification.
- Create API standards for pagination, filtering, sorting, errors, and tenant context.

### Must Do Before API Implementation

- Define authentication and authorization architecture.
- Define role-to-endpoint mapping.
- Define object-level permission rules.
- Define idempotency rules for commands.
- Define event publication rules for commands.
- Define validation error format.

### Must Do Before Frontend Implementation

- Define Customer Workspace data contract.
- Define module queue pages for Sales, Warehouse, Finance, and Management.
- Define loading, empty, stale, and permission-denied states.
- Define pricing explanation UI requirements.
- Define navigation behavior for deep links and return paths.

### Must Do Before AI Features

- Define AI governance.
- Define AI-readable event and audit metadata.
- Define suggestion approval workflow.
- Define tenant-scoped AI context packaging.
- Define explainability and provenance rules.

## Final Critique

The repository is ready for another architecture-hardening pass, not yet for database implementation.

The main weakness is that the documentation has established the product direction faster than the technical architecture has established enforcement mechanisms. That is normal at this stage, but it must be corrected before persistence and API code make the boundaries harder to change.

The next successful step is not to add PostgreSQL tables. The next successful step is to turn the highest-risk architectural assumptions into explicit decisions, especially around pricing, tenancy, events, authorization, and Customer Workspace read models.
