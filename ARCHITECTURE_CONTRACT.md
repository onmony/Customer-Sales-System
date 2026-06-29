# Architecture Contract

## Purpose

This contract defines the mandatory rules for implementation. From this point forward, the repository enters Implementation Mode. All implementation must follow this contract.

**Effective Date:** June 29, 2026
**Architecture Version:** V1 Final

## Implementation Contract

Implement each module according to the approved architecture baseline (ARCHITECTURE_V1_FINAL.md), relevant ADRs, RULES.md, TECH_STACK.md, BUSINESS_RULES.md, and the module documentation package.

### Mandatory Rules

**If implementation requires deviating from the approved architecture, business rules, ADRs, or technology principles, STOP and ask for approval before proceeding.**

**Do not invent business rules.**

**Do not introduce new architectural patterns.**

**Prefer extending the existing modular monolith over redesigning it.**

**Documentation is the source of truth.**

**Business rules always take precedence over implementation convenience.**

## Required Reading Before Implementation

Before implementing any module, read the following documents in order:

1. [MASTER_SKILL](docs/MASTER_SKILL.md) - AI agent entry point
2. [VISION](docs/VISION.md) - Product vision
3. [RULES](docs/RULES.md) - Documentation and product rules
4. [PRINCIPLES](docs/PRINCIPLES.md) - Product principles
5. [GLOSSARY](docs/GLOSSARY.md) - Key terminology
6. [DOMAIN](docs/DOMAIN.md) - Core domain definition
7. [TECH_STACK](docs/TECH_STACK.md) - SMB-focused technology stack
8. [BUSINESS_RULES](docs/BUSINESS_RULES.md) - Business rule registry
9. [TRACEABILITY](docs/TRACEABILITY.md) - Traceability framework
10. [ARCHITECTURE_V1_FINAL](ARCHITECTURE_V1_FINAL.md) - Architecture baseline
11. Relevant ADRs (docs/decisions/)
12. Relevant module documentation

## Technology Constraints

**Must Use:**
- PostgreSQL (database)
- TypeScript (language)
- React (frontend)
- TailwindCSS (styling)
- shadcn/ui (components)
- JWT (authentication)
- Docker (containerization)
- Express.js (API framework)
- Prisma (ORM)

**Must Not Use:**
- Kafka (unless explicitly needed for scale)
- Microservices (unless explicitly needed for scale)
- Kubernetes (unless explicitly needed for scale)
- Complex authentication providers (unless explicitly required)
- Distributed tracing (unless explicitly needed)
- Redis (unless profiling proves necessary)
- Elasticsearch (unless search complexity requires it)
- Complex workflow engines
- Policy engines
- Event Sourcing
- CQRS (except Customer Workspace READ MODEL)

## Architecture Stability

The architecture is frozen. Future architectural changes must satisfy ALL of the following:

1. **Business Justification** - Must demonstrate clear business value
2. **ADR** - Must create an Architecture Decision Record
3. **Architecture Review** - Must undergo architecture review
4. **Approval** - Must receive explicit approval
5. **Architecture Version Update** - Must update architecture version

Architecture changes should be additive whenever possible. Breaking changes require stronger justification and approval.

## Business Rule Compliance

All implementation must comply with business rules defined in BUSINESS_RULES.md:

- Documentation rules (DOC-001 to DOC-007)
- Product rules (PRD-001 to PRD-013)
- Customer rules (CUS-001 to CUS-009)
- Pricing rules (PR-001 to PR-011)
- Order rules (ORD-001 to ORD-017)
- Invoice rules (INV-001 to INV-017)
- Warehouse rules (WH-001 to WH-009)
- Shipment rules (SHP-001 to SHP-013)
- Delivery rules (DEL-001 to DEL-008)
- Payment rules (PAY-001 to PAY-004)
- Authorization rules (AUTH-001 to AUTH-019)

## Pricing Behavior

All pricing implementation must comply with PRICING_EFFECTIVE_DATE_POLICY.md:

- Active pricing resolution
- Future pricing scheduling
- Historical pricing for backdated orders
- Invoice pricing snapshots
- Overlapping price resolution
- Future edits before activation
- Customer dispute handling

## Multi-Tenant Compliance

All implementation must comply with multi-tenant strategy (ADR-012):

- All tables include tenant_id
- All queries filter by tenant
- Tenant context is propagated throughout system
- Tenant isolation is enforced at database level

## Data Ownership

All implementation must comply with DATA_OWNERSHIP.md:

- Aggregate ownership boundaries are respected
- Customer Workspace is READ MODEL (never writes to aggregates)
- Order snapshots are immutable
- Invoice snapshots are copied from order
- Source aggregates cannot rewrite snapshots

## Authorization

All implementation must comply with authorization framework (ADR-014):

- Configuration-driven bootstrap from YAML
- Database has source of truth after bootstrap
- Role-based access control
- Wildcard permissions
- Decision tables for permission resolution
- No hardcoded role names in application code

## Traceability

All implementation must follow TRACEABILITY.md:

- Business Rule → Decision Table → Gherkin → API → Implementation → Tests
- Rule IDs must be referenced in implementation
- Rule IDs must be referenced in tests
- Traceability matrix must be maintained

## Performance Budgets

All implementation must comply with PERFORMANCE_BUDGETS.md:

- Customer Search: < 500ms (p95)
- Pricing Resolution: < 100ms (p95)
- Customer Workspace: < 1 second (p95)
- Create Order: < 2 seconds (p95)
- Invoice Generation: < 5 seconds (p95)
- Import Validation: < 30 seconds for 10,000 rows (p95)
- Global Search: < 500ms (p95)

## Database Indexing

All implementation must comply with DATABASE_INDEXING.md:

- Tenant indexes on all tenant-scoped tables
- Search indexes for Customer and Product
- Resolution indexes for Pricing
- Query indexes for Orders and Invoices
- Foreign key indexes

## Workspace Strategy

All implementation must comply with WORKSPACE_STRATEGY.md:

- Customer Workspace: Salesperson, create order < 1 minute
- Warehouse Workspace: Warehouse Manager, pick request < 1 minute
- Finance Workspace: Finance Manager, issue invoice < 1 minute
- Management Workspace: Business Owner, view daily summary < 1 minute

## Violation Consequences

If implementation violates this contract:

1. Stop implementation immediately
2. Document the violation
3. Request approval for deviation
4. If approved, update ADR and architecture version
5. If not approved, revert to compliant implementation

## Related Documents

- [Architecture V1 Final](ARCHITECTURE_V1_FINAL.md) - Architecture baseline
- [Implementation Readiness Report](IMPLEMENTATION_READINESS_REPORT.md) - Readiness assessment
- [Pricing Effective Date Policy](docs/business/PRICING_EFFECTIVE_DATE_POLICY.md) - Authoritative pricing behavior
- [Workspace Strategy](docs/product/WORKSPACE_STRATEGY.md) - Operational workspace strategy
- [Technology Stack](docs/TECH_STACK.md) - SMB-focused technology stack
- [Business Rules](docs/BUSINESS_RULES.md) - Business rule registry
