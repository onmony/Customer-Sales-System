# Architecture V1 Final

## Purpose

This document is the official architecture baseline for the Customer-Sales-System. It summarizes the completed architecture after the Architecture Hardening Sprint - Final, assesses readiness for PostgreSQL implementation, and provides recommendations for next steps.

**Status:** Architecture V1 Final - Ready for PostgreSQL Implementation

**Date:** June 29, 2026

## Architecture Summary

### Product Vision

The product is a modern SaaS ERP focused on customer relationship operations for order-to-delivery workflows. The customer is the center of the product, not accounting. Customer-specific pricing is the primary business capability.

### Core Domain Flow

Customer → Order → Pricing Resolution → Invoice → Warehouse → Shipment → Delivery → Payment

### Architecture Principles

1. **Customer-Centered ERP:** Workflows organized around the customer, not accounting records
2. **Speed With Accuracy:** Salesperson can create accurate order in under one minute
3. **History Preservation:** Business history preserved, current state does not overwrite past truth
4. **Immutable Business Snapshots:** Orders and invoices preserve values at time of event
5. **Multi-Tenant Foundation:** Tenant isolation is a foundation, not later enhancement
6. **AI-First Documentation:** Documentation allows future AI agents to continue development
7. **Simplicity:** Optimize for simplicity, avoid unnecessary enterprise complexity

### Architecture Decisions

**Accepted ADRs:**
- ADR-010: Customer Workspace as primary operational entry point
- ADR-011: Source Layering (Domain, Application, Infrastructure, Presentation, Configuration)
- ADR-012: Multi-Tenant Strategy (shared database, shared schema, row-level isolation)
- ADR-013: Customer Workspace as READ MODEL
- ADR-014: Authorization Bootstrap (configuration-driven)
- ADR-015: Import Center for validated data onboarding
- ADR-016: Global Search for unified search capability
- ADR-017: Correlation ID Strategy for lightweight traceability
- ADR 001: Business Actions vs System Versioning
- ADR 002: Phase-Aware Order Workflow
- ADR 003: Business Document Independence
- ADR 004: Relational for Operational Data. JSONB for Immutable Documents.

### Technical Standards

**API Standards:**
- RESTful principles
- Request/response formats
- Pagination, filtering, sorting
- Validation
- Correlation ID and tenant propagation
- Versioning
- Idempotency
- Rate limiting
- Security
- OpenAPI specification
- Testing

**Value Objects:**
- Money (currency, precision, rounding, arithmetic, serialization, display)

**Correlation ID:**
- Request context: RequestId, CorrelationId, TenantId, UserId
- Event context: EventId, CorrelationId, CausationId, TenantId, Timestamp, ActorId, Source
- HTTP header propagation
- Logging
- Database context
- Background jobs
- Error handling

### Business Capabilities

**Customer Workspace:**
- READ MODEL architecture
- Composes data from Customer, Order, Pricing, Invoice, Warehouse, Shipment aggregates
- Never writes to aggregates
- Multi-level caching with TTLs
- Event-driven cache invalidation

**Import Center:**
- Validated, auditable, rollback-capable data onboarding
- Import types: Customer, Product, Pricing, Tally
- Duplicate detection
- Bulk import with validation
- Audit logging

**Global Search:**
- Unified search across customers, products, orders, invoices
- Permission-aware
- Tenant-scoped
- Ranking algorithms
- Recent searches
- Keyboard shortcuts

**Authorization:**
- Configuration-driven bootstrap from YAML
- Database as source of truth post-bootstrap
- Role-based access control
- Wildcard permissions
- Decision tables for permission resolution
- Role Management UI

### Configuration Philosophy

**config/ Directory:**
- Contains bootstrapped, editable defaults
- Database becomes source of truth after bootstrap
- YAML files for feature flags, statuses, types
- Seed directory for roles, permissions, demo data

### Workflows

**Customer Workflow:** Active → Inactive → Blocked → Merged
**Pricing Workflow:** Draft → Active → Expired → Future
**Order Workflow:** Draft → Pending → Confirmed → Processing → Shipped → Delivered → Cancelled → On Hold
**Invoice Workflow:** Draft → Generated → Issued → Viewed → Partial → Paid → Overdue → Void → Written Off
**Warehouse Workflow:** Pending → Picked → Packed → Ready → Cancelled
**Shipment Workflow:** Pending → In Transit → Out for Delivery → Delivered → Exception → Returned
**Delivery Workflow:** Pending → Attempted → Confirmed → Failed

### Performance Budgets

- Customer Search: < 500ms (p95)
- Pricing Resolution: < 100ms (p95)
- Customer Workspace: < 1 second (p95)
- Create Order: < 2 seconds (p95)
- Invoice Generation: < 5 seconds (p95)
- Import Validation: < 30 seconds for 10,000 rows (p95)
- Global Search: < 500ms (p95)

### Database Indexing Strategy

**Tenant Indexes:** All tenant-scoped tables have `tenant_id` index
**Search Indexes:** Customer (name, GST, mobile), Product (SKU, name)
**Resolution Indexes:** Pricing (customer_id, product_id, effective_date)
**Query Indexes:** Orders (customer_id, created_at, status), Invoices (invoice_number, customer_id, issued_at, status)

### Data Storage Strategy

**Relational for Operational Data. JSONB for Immutable Documents:**

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

**JSONB Decision Checklist:**

Before introducing JSONB, every developer must answer YES to all:

1. Is this data immutable after creation?
2. Is it a business document, snapshot, event, or external payload?
3. Is the structure expected to evolve?
4. Is it not the primary target of transactional queries?

If any answer is No, use relational tables.

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

**Frozen Module Strategy:**

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

**Invoice Persistence Contract:**
- Relational columns support search, reporting, tenant isolation, status workflow, and traceability: `tenantId`, `customerId`, `orderId`, `invoiceNumber`, `statusId`, `issuedAt`, `dueDate`, `totalAmount`, `taxAmount`, `discountAmount`, `currency`, and `correlationId`.
- `documentSnapshot` stores the complete immutable invoice document as JSONB, including customer snapshot, order snapshot, invoice line items, pricing snapshot, totals, currency, and reproduction metadata.
- `snapshotSchemaVersion` identifies the JSONB document structure and defaults to `1`.
- Invoice rendering must use `documentSnapshot`; it must not join to live Customer, Product, Pricing, or Order data to reproduce an issued invoice.

**Order Persistence Contract:**
- Order is a hybrid business document.
- Relational columns support workflow, search, reporting, tenant isolation, and traceability: `tenantId`, `customerId`, `statusId`, `orderNumber`, `currency`, `totalAmount`, timestamps, and audit fields.
- `orderDocumentPayload` stores the complete immutable commercial representation as JSONB, including customer snapshot, order header, line items, pricing snapshots, totals, and reproduction metadata.
- `snapshotSchemaVersion` identifies the JSONB document structure and defaults to `1`.
- Draft Orders may regenerate `orderDocumentPayload` whenever the Order changes.
- Confirmed Orders freeze `orderDocumentPayload` forever.
- Order rendering must use `orderDocumentPayload`.

**Business Document Rendering Principle:**
- Every business document owns an immutable JSONB payload.
- Operational fields remain relational.
- Business documents are rendered from the JSONB payload.

See [ADR 004: Relational for Operational Data. JSONB for Immutable Documents.](docs/adr/004-relational-first-jsonb-by-exception.md) for detailed strategy.

### Dependencies

**Allowed Dependencies:** Follow operational flow (Customer → Pricing → Order → Invoice → Warehouse → Shipment → Delivery → Payment)
**Forbidden Dependencies:** No cross-module mutation, no accounting as root dependency
**Circular Dependencies:** None detected
**Customer Workspace:** Reads from multiple modules, never writes

### Traceability

**Traceability Flow:** Business Rule → Decision Table → Gherkin → API → Implementation → Tests
**Rule IDs:** Stable identifiers for all business rules (DOC-001 to AUTH-019)
**Traceability Matrix:** Links all artifacts from business intent to implementation verification

### Notifications

**Future Notification Events:** Pricing Changed, Order Approved, Shipment Dispatched, Delivery Completed, Payment Overdue, Customer Credit Limit Crossed
**Channels:** In-app (Phase 1), Email (Future), WhatsApp (Future), SMS (Future)
**Priorities:** Critical, High, Medium, Low

## Open Decisions

None. All required decisions for Version 1 implementation have been completed.

## Deferred Decisions

### Pricing Templates / Customer Groups

**Status:** Deferred to Phase 2 (recommended to move to Phase 2)

**Reasoning:**
- Customer-product pricing matrix will explode at scale
- Manual pricing becomes tedious at 1,000+ customers
- Pricing templates/customer groups needed earlier than Phase 4

**Recommendation:** Move to Phase 2, before 1,000 customers

### Event Outbox Implementation

**Status:** Deferred (pattern decision needed first)

**Reasoning:**
- Event architecture is documented conceptually
- Implementation decision not yet made
- Can be implemented incrementally

**Recommendation:** Decide pattern first, then implement when needed

### AI Governance Implementation

**Status:** Deferred to Phase 4

**Reasoning:**
- AI governance is documented
- AI features are Phase 4+
- Implementation not yet needed

**Recommendation:** Implement before AI features in Phase 4

### Integration Architecture

**Status:** Deferred to Phase 5

**Reasoning:**
- External integrations are Phase 5+
- Integration boundaries documented in dependencies
- Implementation not yet needed

**Recommendation:** Design before Phase 5 implementation

## Technology Assumptions

**See [TECH_STACK](docs/TECH_STACK.md) for complete technology stack definition.**

### Backend

**Database:** PostgreSQL (shared database, shared schema, row-level tenant isolation)
**ORM:** Prisma
**API Framework:** Express.js
**Language:** TypeScript
**Authentication:** JWT
**File Storage:** Local filesystem or S3-compatible storage

### Frontend

**Framework:** React
**Styling:** TailwindCSS
**Components:** shadcn/ui
**Icons:** Lucide React
**State Management:** React Context + useReducer (or Zustand if needed)

### Architecture

**Pattern:** Modular monolith (not microservices)
**Event System:** Simple in-process event bus (no Kafka)
**CQRS:** Not implemented (READ MODEL for Customer Workspace only)
**Event Sourcing:** Not implemented
**Caching:** Redis (if needed) or in-memory cache

### Deployment

**Containerization:** Docker
**Cloud Provider:** Any major provider (AWS, GCP, Azure) or VPS
**CI/CD:** GitHub Actions
**Monitoring:** Simple logging + basic metrics

## Future Roadmap

### Phase 1: Foundation (Completed)

- AI Engineering Knowledge Base
- Product vision
- Repository rules
- Domain language
- Documentation workflow
- Architecture hardening

### Phase 2: Core Order-To-Delivery Documentation (Completed)

- Customer
- Product
- Customer-specific pricing
- Order
- Invoice
- Warehouse
- Shipment
- Delivery
- Payment

### Phase 3: Implementation Planning (In Progress)

- PostgreSQL implementation
- Technical architecture
- Data model
- API design
- UI design
- Test strategy

### Phase 4: Future AI Modules (Deferred)

- Pricing suggestions
- Order assistance
- Customer insights
- Delivery risk detection
- AI governance

### Phase 5: Integrations (Deferred)

- External accounting tools
- Transport providers
- Payment gateways
- Warehouse systems
- CRM integration

## Readiness Assessment

### Documentation Readiness

**Status:** Complete

**Evidence:**
- All core documentation is complete
- All ADRs are accepted
- All technical standards are defined
- All business workflows are documented
- All performance budgets are defined
- All indexing strategy is defined
- All business rules have Rule IDs
- Traceability framework is defined
- Configuration philosophy is defined

### Architecture Readiness

**Status:** Ready

**Evidence:**
- Source layering is documented
- Multi-tenant strategy is documented
- Customer Workspace READ MODEL is documented
- Authorization framework is documented
- Correlation ID strategy is documented
- API standards are documented
- Money value object is documented
- Dependencies are documented with no circular dependencies
- Future modules are documented

### Implementation Readiness

**Status:** Conditionally Ready

**Conditions:**
1. Pricing effective-date policy must be defined before schema design
2. Event outbox pattern must be decided before event implementation
3. Performance budgets must be defined before optimization
4. Database indexing must be defined before schema implementation
5. Object-level authorization must be defined before API implementation
6. READ MODEL complexity must be monitored during implementation

### Risk Assessment

**Low Risk:**
- Documentation is comprehensive
- Architecture decisions are documented
- Dependencies are clean
- Multi-tenancy is designed from day one

**Medium Risk:**
- Pricing effective-date policy needs refinement
- Event outbox pattern not decided
- Object-level authorization not defined
- READ MODEL complexity not yet validated

**High Risk:**
- None identified

## Recommendations

### Immediate Actions

1. **Define Pricing Effective-Date Policy** - Before database schema design
2. **Decide Event Outbox Pattern** - Before event implementation
3. **Define Object-Level Authorization** - Before API implementation
4. **Define Operational Module Workspaces** - Before frontend implementation

### PostgreSQL Implementation

**Recommendation:** Proceed with PostgreSQL implementation

**Prerequisites:**
- Complete pricing effective-date policy
- Decide event outbox pattern
- Define database indexing strategy (completed)
- Define performance budgets (completed)

**Implementation Order:**
1. Database schema with tenant isolation
2. Source layering implementation
3. Repository layer with tenant filtering
4. API layer with authorization
5. Customer Workspace READ MODEL
6. Event implementation (outbox pattern)
7. Frontend implementation

### Monitoring During Implementation

**Monitor:**
- READ MODEL complexity and performance
- Tenant isolation enforcement
- Pricing resolution performance
- Event processing performance
- Authorization enforcement
- Performance budget compliance

### Future Considerations

**Before 1,000 Customers:**
- Implement pricing templates or customer groups
- Implement pricing bulk import/export
- Implement object-level authorization
- Implement operational module workspaces

**Before 10,000 Customers:**
- Implement effective-date pricing engine
- Implement background jobs for imports/exports
- Implement event outbox
- Implement search infrastructure

**Before 100,000 Orders:**
- Implement partitioning/archival strategy
- Implement reporting read models
- Implement strong idempotency for invoice generation

## Architecture Principles Compliance

### Customer-Centered ERP

**Status:** Compliant

**Evidence:**
- Customer is primary operational entry point
- Customer Workspace is central to navigation
- Customer-specific pricing is primary capability
- Accounting is one module, not product center

### Speed With Accuracy

**Status:** Compliant

**Evidence:**
- Performance budgets defined for critical operations
- Customer Workspace designed for fast order creation
- Pricing resolution budget: < 100ms
- Create order budget: < 2 seconds

### History Preservation

**Status:** Compliant

**Evidence:**
- Pricing versions are append-only
- Orders store immutable snapshots
- Invoices are immutable
- Event catalog for audit trail

### Immutable Business Snapshots

**Status:** Compliant

**Evidence:**
- Order snapshots preserve values at time of event
- Invoice snapshots copied from order
- Source aggregates cannot rewrite snapshots
- Data ownership rules defined

### Multi-Tenant Foundation

**Status:** Compliant

**Evidence:**
- Multi-tenant strategy documented
- Tenant isolation from day one
- Tenant context propagation defined
- Database indexing includes tenant_id
- Authorization is tenant-aware

### AI-First Documentation

**Status:** Compliant

**Evidence:**
- Documentation is comprehensive
- Traceability framework defined
- Business rules have stable IDs
- Events carry context for AI explanation
- Future AI modules documented

### Simplicity

**Status:** Compliant

**Evidence:**
- Modular monolith (not microservices)
- No CQRS (except Customer Workspace READ MODEL)
- No Event Sourcing
- No complex workflow engines
- No policy engines
- Configuration-driven authorization

## Architecture Stability

The architecture is now frozen. Future architectural changes must satisfy ALL of the following:

1. **Business Justification** - Must demonstrate clear business value
2. **ADR** - Must create an Architecture Decision Record
3. **Architecture Review** - Must undergo architecture review
4. **Approval** - Must receive explicit approval
5. **Architecture Version Update** - Must update architecture version

Architecture changes should be additive whenever possible. Breaking changes require stronger justification and approval.

## Conclusion

The Architecture V1 Final is **ready for PostgreSQL implementation** with the following conditions:

**Must Complete Before Schema Design:**
- None (Pricing effective-date policy completed)

**Must Complete Before Event Implementation:**
- None (Simple in-process event bus sufficient for Version 1)

**Must Complete Before API Implementation:**
- None (Role-based access control sufficient for Version 1)

**Must Complete Before Frontend Implementation:**
- None (Workspace strategy completed)

**Recommendation:** Proceed with PostgreSQL implementation. All required decisions for Version 1 have been completed.

The architecture is simple, modular, maintainable, and AI-friendly. It follows the product vision and principles while avoiding unnecessary enterprise complexity.

## Related Documents

- [Architecture Freeze V1](ARCHITECTURE_FREEZE_V1.md) - Previous architecture summary
- [Architecture Critique V2](ARCHITECTURE_CRITIQUE.md) - Architecture weaknesses review
- [Architecture Changelog](ARCHITECTURE_CHANGELOG.md) - Changes during hardening sprint
- [Product Decisions](docs/PRODUCT_DECISIONS.md) - Product decision rationale
- [Business Rules](docs/BUSINESS_RULES.md) - Business rule registry
- [Pricing Effective Date Policy](docs/business/PRICING_EFFECTIVE_DATE_POLICY.md) - Authoritative pricing behavior
- [Workspace Strategy](docs/product/WORKSPACE_STRATEGY.md) - Operational workspace strategy
