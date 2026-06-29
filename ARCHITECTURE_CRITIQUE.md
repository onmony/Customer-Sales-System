# Architecture Critique V2

## Purpose

This document reviews the repository as a Principal Software Architect with a bias toward finding weaknesses after the Architecture Hardening Sprint - Round 2. The goal is to identify decisions that will become expensive as the system scales.

**Review Scope:**
- Business Model
- DDD
- Folder Structure
- Navigation
- Pricing
- Customer Workspace
- Future Extensibility
- AI Readiness
- Performance
- Security
- Scalability
- Testability
- Maintainability
- Multi-tenancy
- Event Architecture

## Executive Assessment

The Architecture Hardening Sprint - Round 2 has significantly strengthened the architecture by addressing many of the original critique points. However, several critical weaknesses remain that will become painful at scale.

**Strengths Added:**
- Source layering ADR (ADR-011) - addresses DDD and folder structure concerns
- Multi-tenant strategy ADR (ADR-012) - addresses multi-tenancy enforcement
- Customer Workspace READ MODEL ADR (ADR-013) - addresses workspace coupling
- Authorization bootstrap ADR (ADR-014) - addresses security foundation
- Correlation ID strategy ADR (ADR-017) - addresses event architecture
- API Standards document - addresses API conventions
- Money value object document - addresses pricing precision
- Configuration philosophy - addresses maintainability

**Remaining Critical Weaknesses:**
- Pricing effective-date policy still underdeveloped
- Event outbox pattern not decided
- Customer Workspace READ MODEL complexity not fully addressed
- Operational module workspaces (Warehouse, Finance) not defined
- Pricing matrix scalability not addressed
- Performance budgets not defined
- Object-level authorization not defined
- Database indexing strategy not defined

## Business Model Weaknesses

### Pain Points

- Customer lifecycle rules (duplicate, inactive, blocked, credit hold, payment terms, sales ownership, merge) are still thin
- Payment module inclusion in workflow remains inconsistent
- "Order in under one minute" lacks measurable acceptance criteria
- Operational freshness requirements are now defined but not validated

### Recommendations

- Create explicit business rules for customer lifecycle before implementation
- Decide Payment module scope definitively
- Define "order in under one minute" as measurable acceptance criteria with performance budgets

## DDD Weaknesses

### Pain Points

- Source layering is documented but not yet implemented
- Value objects are defined (Money) but not yet implemented
- Transaction boundaries are not defined for pricing changes, order creation, invoice generation
- Domain event emission rules are documented but not yet enforced

### Recommendations

- Implement source layering before adding persistence
- Implement value objects before database schema design
- Define transaction boundaries explicitly

## Folder Structure Weaknesses

### Pain Points

- Source layering ADR exists but source structure not yet reorganized
- Shared concerns (tenant context, errors, clocks) not yet extracted

### Recommendations

- Reorganize source structure per ADR-011 before adding persistence
- Extract shared technical rules into dedicated modules

## Navigation Weaknesses

### Pain Points

- Operational module workspaces (Warehouse, Finance, Management) not defined
- Customer Workspace tabs could become overloaded
- Deep-linking, saved filters, return-to-workflow not defined

### Recommendations

- Define parallel operational module workspaces for Warehouse, Finance, Management
- Define which pages are customer-scoped vs operational queues
- Add navigation rules for deep links and return paths

## Pricing Weaknesses

### Pain Points

- Pricing effective-date policy is still underdeveloped
- Pricing conflict policy for overlapping versions not defined
- Pricing matrix scalability (customer × product) not addressed
- Pricing templates/customer groups deferred to Phase 4 but may be needed earlier

### Recommendations

- Define effective date, expiry date, future price, backdated order behavior before database design
- Add pricing conflict rules for duplicate customer-product prices
- Introduce pricing templates or customer groups in Phase 2, not Phase 4

## Customer Workspace Weaknesses

### Pain Points

- READ MODEL architecture is defined but adds significant complexity
- Event-driven cache invalidation complexity not fully addressed
- READ MODEL drift from aggregates risk not mitigated
- Performance impact from event processing not quantified

### Recommendations

- Implement READ MODEL with monitoring for drift detection
- Define fallback strategy when READ MODEL is unavailable
- Quantify performance impact of event processing

## Future Extensibility Weaknesses

### Pain Points

- Integration architecture not defined
- Module lifecycle not defined
- Extension rules for AI modules, webhooks not defined

### Recommendations

- Create Integration Architecture document before external API design
- Define module versioning and migration rules
- Define extension rules for future modules

## AI Readiness Weaknesses

### Pain Points

- AI governance documented but not implemented
- AI suggestion approval workflow not defined
- AI context boundaries not defined

### Recommendations

- Implement AI governance before AI features
- Define suggestion approval workflow
- Define tenant-scoped AI context packaging

## Performance Weaknesses

### Pain Points

- Performance budgets not defined
- Database indexing strategy not defined
- READ MODEL performance impact not quantified
- Caching strategy not implemented

### Recommendations

- Define performance budgets for order creation, pricing resolution, workspace load
- Define required database indexes before schema implementation
- Quantify READ MODEL performance impact

## Security Weaknesses

### Pain Points

- Object-level authorization not defined
- Field-level masking not defined
- Pricing visibility for margin-sensitive data not addressed

### Recommendations

- Define object-level permission rules
- Define field-level masking strategy
- Split pricing permissions into view, create, update, approve, import, export, view-sensitive-data

## Scalability Weaknesses

### At 100 Customers

**Likely Pain:**
- Duplicate customers begin appearing
- Manual pricing manageable but error-prone
- Customer Workspace READ MODEL complexity may be overkill

**Required:**
- Customer duplicate policy
- Customer status rules
- Basic customer search

### At 1,000 Customers

**Likely Pain:**
- Manual pricing per customer/product becomes tedious
- Pricing import/export becomes necessary
- READ MODEL complexity justified

**Required:**
- Indexed customer and product search
- Pricing bulk import/export rules
- Object-level authorization

### At 10,000 Customers

**Likely Pain:**
- Customer-product pricing matrix explodes
- Pricing templates/customer groups become necessary
- READ MODEL essential for performance

**Required:**
- Pricing templates or customer groups (Phase 2, not Phase 4)
- Effective-date pricing engine
- Background jobs for imports/exports
- Event outbox

### At 100,000 Orders

**Likely Pain:**
- Order/invoice snapshots create large immutable storage
- Event log grows rapidly
- READ MODEL recent activity becomes slow without optimization
- Archiving/partitioning becomes unavoidable

**Required:**
- Event envelope and outbox strategy
- Immutable snapshot storage policy
- Partitioning/archival strategy
- Reporting read models
- Strong idempotency for invoice generation

## Testability Weaknesses

### Pain Points

- Repository contract tests not defined
- Tenant isolation tests not defined
- Concurrency tests not defined
- Gherkin-to-test automation not defined

### Recommendations

- Add repository contract tests before persistence implementation
- Add tenant isolation tests for every repository
- Add concurrency tests for pricing changes, order confirmation
- Define Gherkin-to-test automation strategy

## Maintainability Weaknesses

### Pain Points

- Rule IDs not added to business rules
- Documentation update rules not defined
- Doc-to-test traceability not defined

### Recommendations

- Add rule IDs to business rules
- Define documentation update rules
- Define doc-to-test traceability strategy

## Multi-Tenancy Weaknesses

### Pain Points

- Tenant context not yet implemented
- Database-level tenant isolation not yet implemented
- Tenant isolation tests not defined

### Recommendations

- Implement tenant context as application boundary
- Implement database-level tenant isolation (RLS or constraints)
- Add tenant isolation tests

## Event Architecture Weaknesses

### Pain Points

- Event envelope defined but not implemented
- Event outbox pattern not decided
- Event versioning policy not defined
- Replay/projection strategy not defined

### Recommendations

- Decide between event store, outbox, or hybrid
- Implement event envelope
- Define event versioning policy
- Define replay/projection strategy

## Highest-Risk Decisions Before Database Implementation

1. **Pricing effective-date and conflict rules** - Still underdeveloped
2. **Event outbox pattern** - Not decided
3. **Pricing templates/customer groups** - Deferred to Phase 4 but needed earlier
4. **Performance budgets** - Not defined
5. **Database indexing strategy** - Not defined
6. **Object-level authorization** - Not defined
7. **READ MODEL complexity mitigation** - Not addressed
8. **Operational module workspaces** - Not defined

## Recommended Next Steps

### Before PostgreSQL Implementation

1. Define pricing effective-date and conflict rules
2. Decide event outbox pattern
3. Define performance budgets
4. Define database indexing strategy
5. Define object-level authorization
6. Define READ MODEL complexity mitigation

### Before API Implementation

1. Implement tenant context
2. Implement database-level tenant isolation
3. Add tenant isolation tests
4. Define operational module workspaces

### Before Frontend Implementation

1. Define Customer Workspace data contract
2. Define module queue pages
3. Define loading/empty/stale states

## Final Critique

The Architecture Hardening Sprint - Round 2 has made significant progress. The architecture is now **conditionally ready** for PostgreSQL implementation with the following caveats:

**Ready to Proceed:**
- Source layering is documented
- Multi-tenant strategy is documented
- Customer Workspace READ MODEL is documented
- Authorization framework is documented
- Correlation ID strategy is documented
- API standards are documented
- Money value object is documented

**Requires Attention During Implementation:**
- Pricing effective-date policy must be defined before schema design
- Event outbox pattern must be decided before event implementation
- Performance budgets must be defined before optimization
- Database indexing must be defined before schema implementation
- Object-level authorization must be defined before API implementation
- READ MODEL complexity must be monitored during implementation

**Recommendation:** Proceed with PostgreSQL implementation but prioritize the "Requires Attention During Implementation" items. Do not defer pricing effective-date policy or event outbox pattern decisions.
