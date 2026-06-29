# Phase 1 Architecture Review

## Review Scope

This review covers the current repository before database implementation.

Reviewed areas:

- Business model
- Domain-driven design
- Folder structure
- Rules and skills
- Gherkin scenarios
- Decision tables
- Cross references
- Naming
- API design
- Future scalability
- Phase 1 implementation alignment

Validation performed:

- Markdown cross-reference check: passed.
- Automated test suite: `64` passing, `0` failing.

## Executive Summary

Phase 1 has a strong documentation-first foundation and a coherent customer-first domain flow:

Customer -> Product -> Pricing -> Order -> Invoice

The best architectural decisions so far are:

- Customer is correctly treated as the product center.
- Pricing is correctly modeled as customer-specific and versioned.
- Orders and invoices preserve immutable snapshots.
- Unclear business policies are blocked instead of invented.
- Feature packages are independently understandable.
- Tests map well to Gherkin acceptance scenarios.

The main gap before database implementation is that several database-critical policies remain unresolved. These should be decided before schema design, because they affect constraints, indexes, uniqueness, audit tables, lifecycle columns, and data migration strategy.

## Top Recommendations Before Database Work

1. Decide tenant isolation strategy and document it as an ADR.
2. Decide required fields and uniqueness rules for Customer and Product.
3. Decide pricing precision, currency, effective-date, and missing-price policy.
4. Decide order lifecycle states before persisting orders.
5. Decide invoice numbering, draft behavior, and cancellation or credit-note policy before persisting invoices.
6. Create a technical data model document before writing migrations.
7. Split application architecture into domain, application services, persistence ports, and adapters before adding a database.
8. Add ADRs for snapshot strategy, pricing versioning, and tenant isolation enforcement.

## Business Model Review

### Strengths

The business model is clear and differentiated. It is not accounting-first; it is built around customer relationship operations and fast order creation.

Customer-specific pricing is correctly elevated to the primary business capability. The documentation consistently protects pricing history, order snapshots, and invoice immutability.

### Gaps

Some business decisions are intentionally open. That is good at the documentation stage, but these questions now block safe database design:

- Customer required fields.
- Customer duplicate handling.
- Product required fields.
- Product unit policy.
- Product inactive behavior.
- Pricing missing-price fallback.
- Pricing currency and precision.
- Order status and edit policy.
- Invoice numbering and draft policy.

### Recommendation

Create a `docs/decisions/` ADR set before database implementation:

- Tenant isolation strategy.
- Snapshot immutability strategy.
- Pricing versioning strategy.
- Order lifecycle.
- Invoice numbering and correction policy.

## DDD Review

### Current Aggregate Candidates

The current model suggests these aggregate boundaries:

- Customer
- Product
- Pricing
- Order
- Invoice

This is a reasonable Phase 1 split.

### Aggregate Boundary Notes

Customer and Product are reference aggregates used by Order and Invoice through snapshots.

Pricing is a specialized aggregate around customer-product price versions. It should not become a generic discount engine until future versions define that scope.

Order is the operational aggregate that composes customer, product, quantity, and pricing snapshots.

Invoice is a downstream immutable aggregate created from a saved order.

### Concern

The current implementation lets Order accept customer, product, and pricing objects directly. That is acceptable for in-memory Phase 1 tests, but database implementation should avoid tight service-to-service object coupling.

### Recommendation

Before persistence, define application-level commands and ports:

- `CustomerRepository`
- `ProductRepository`
- `PricingRepository`
- `OrderRepository`
- `InvoiceRepository`
- `Clock`
- `IdGenerator`

Application services should orchestrate use cases. Domain objects should enforce invariants. Repositories should hide database details.

## Folder Structure Review

### Strengths

The documentation structure is strong:

- `docs/features/<feature>/README.md`
- `SKILL.md`
- `VERSIONS/V1.md`
- `DECISION_TABLES.md`
- Gherkin
- API
- UI
- CHECKLIST
- TEST_CASES
- EVOLUTION

This is excellent for AI context reuse.

The implementation structure is simple:

- `src/customer`
- `src/product`
- `src/pricing`
- `src/order`
- `src/invoice`
- `test/...`

### Gaps

The source folders currently combine domain logic, service logic, repository logic, IDs, timestamps, and error types in one file per module.

That is fine for Phase 1, but it will become hard to evolve with a database.

### Recommendation

Before database implementation, move toward this structure:

```text
src/
  modules/
    customer/
      domain/
      application/
      ports/
      adapters/
    product/
    pricing/
    order/
    invoice/
  shared/
    tenant/
    errors/
    ids/
    time/
```

Do not do a broad refactor casually. Do it as a documented architecture step before persistence.

## Rules And Skills Review

### Strengths

The repository rules are effective:

- Documentation before implementation.
- Gherkin before implementation.
- No invented business rules.
- Multi-tenancy from day one.
- Immutable order and invoice snapshots.

Feature `SKILL.md` files are especially useful. They give future AI agents a stable load order and guardrails.

### Gaps

There is no ADR yet for the rules that are now effectively architectural decisions.

### Recommendation

Promote the most important rules into accepted ADRs:

- Documentation-first development.
- Multi-tenancy from day one.
- Immutable snapshots.
- Feature packages as AI context units.

## Gherkin Review

### Strengths

Gherkin scenarios are readable, business-oriented, and mapped to tests. They cover:

- Tenant isolation.
- Snapshot preservation.
- Missing-policy gates.
- Order-to-invoice happy path.
- Issued invoice immutability.

### Gaps

Current Gherkin is feature-local. It does not yet include a single end-to-end feature file for the full Phase 1 workflow.

### Recommendation

Add a Phase 1 workflow Gherkin file before database implementation:

```text
docs/features/phase-1-workflow/phase-1-workflow.feature
```

This should cover:

- Customer selection.
- Product selection.
- Pricing resolution.
- Order save.
- Invoice creation.
- Invoice issue.
- Source changes after invoice issue.

This is not a new product feature. It is a cross-module acceptance workflow.

## Decision Tables Review

### Strengths

Decision tables are present for every feature and generally map cleanly to business rules and Gherkin.

They are especially useful around:

- Missing-price fallback.
- Cross-tenant access.
- Snapshot preservation.
- Lifecycle policy gates.

### Gaps

Some decision tables say "block until approved", but there is no central open-decision register.

### Recommendation

Create:

```text
docs/decisions/OPEN_DECISIONS.md
```

Track each unresolved business policy with:

- Feature.
- Decision needed.
- Impacted documents.
- Impacted future database tables.
- Owner or status.

## Cross References Review

### Status

All Markdown links currently resolve.

### Strengths

Feature packages cross-reference related modules well. Pricing, Order, and Invoice relationships are especially clear.

### Gaps

Root placeholder folders such as `docs/business`, `docs/product`, and `docs/technical` are still thin compared to the feature packages.

### Recommendation

Before database implementation, add focused technical documents:

- `docs/technical/DATA_MODEL.md`
- `docs/technical/MULTI_TENANCY.md`
- `docs/technical/SNAPSHOT_STRATEGY.md`
- `docs/technical/PERSISTENCE_PORTS.md`

Keep business rules in feature packages. Technical docs should reference, not redefine, business behavior.

## Naming Review

### Strengths

Feature names are clear and stable:

- Customer
- Product
- Pricing
- Order
- Invoice

IDs are prefixed consistently in demo and implementation:

- `cus_`
- `pro_`
- `prv_`
- `ord_`
- `oit_`
- `inv_`
- `iiv_`

### Gaps

The term `price` is currently numeric without a documented money type. This will become risky once currency, precision, and rounding are introduced.

`tenantId` is consistent, but there is no shared tenant context type.

### Recommendation

Before persistence:

- Define a `Money` concept.
- Define a `TenantContext` concept.
- Decide ID generation strategy.
- Decide whether IDs are globally unique or tenant-scoped unique.

## API Design Review

### Strengths

API docs use command/query separation in spirit:

- Commands mutate or create state.
- Queries read current state or history.
- Validation and error categories are documented.

The API docs correctly avoid redefining business rules.

### Gaps

The current implementation is service-method based, not transport API based. That is fine for now, but before database/API implementation the contract should become more explicit.

Missing details:

- Request and response shapes.
- Error response envelope.
- Idempotency expectations.
- Pagination for search/list endpoints.
- Audit metadata.
- Tenant context propagation.

### Recommendation

Before adding HTTP or database code, define API contract templates:

```text
docs/templates/API_CONTRACT_TEMPLATE.md
docs/technical/API_ERROR_MODEL.md
docs/technical/API_IDEMPOTENCY.md
```

## Future Scalability Review

### What Scales Well

The feature package pattern scales well for AI-assisted engineering.

The business model scales well because it protects history through snapshots instead of recalculating past events from current state.

The tests scale reasonably because they include unit, integration, smoke, and regression layers.

### What Will Not Scale As-Is

In-memory repositories will not carry over directly to database persistence.

One-file modules will become difficult once each feature has:

- database models,
- transactions,
- permissions,
- audit logs,
- import/export,
- API handlers,
- UI screens.

### Recommendation

Introduce ports and adapters before the database:

- Domain remains database-agnostic.
- Application services orchestrate commands.
- Persistence adapters implement repository ports.
- Tests can reuse in-memory adapters and add database adapter tests later.

## Database Readiness Review

### Not Ready Yet

The repository is not ready for database schema implementation until these decisions are made:

- Required customer fields.
- Required product fields.
- Product unit policy.
- Pricing currency and precision.
- Pricing effective-date behavior.
- Missing-price fallback behavior.
- Order lifecycle and locking.
- Invoice numbering.
- Invoice draft and correction policy.

### Database-Critical Recommendations

Define these tables or concepts only after decisions are approved:

- `tenants`
- `customers`
- `customer_contacts`
- `customer_addresses`
- `products`
- `customer_price_versions`
- `orders`
- `order_items`
- `order_item_pricing_snapshots`
- `invoices`
- `invoice_items`
- `invoice_snapshots`

Every tenant-owned table should include `tenant_id`.

Every immutable snapshot should store copied display values, not only foreign keys.

Pricing versions should be append-only.

Issued invoices should be immutable at the database and application levels.

## Testing Review

### Strengths

The current suite is strong for Phase 1:

- Feature-level tests.
- Unit tests.
- Integration tests.
- Smoke tests.
- Regression tests.
- Demo data smoke test.

Current status: `64` passing tests.

### Gaps

The suite does not yet include mutation testing, persistence tests, or concurrency tests.

### Recommendation

Before database implementation, add planned test categories:

- Repository contract tests.
- Tenant isolation persistence tests.
- Transaction rollback tests.
- Append-only pricing history tests.
- Invoice immutability persistence tests.

## Demo Data Review

### Strengths

Demo data includes the requested Phase 1 entities:

- 10 customers.
- 10 products.
- pricing records.
- saved orders.
- issued invoices.

### Gap

Demo data is static JSON and not loaded through domain services. This is acceptable for now, but database seeding should use approved application commands once persistence exists.

### Recommendation

Before database implementation, create a seed-data strategy document:

```text
docs/technical/SEED_DATA.md
```

## Priority Action List

### P0 Before Database

- Create ADR for tenant isolation.
- Create ADR for immutable snapshots.
- Create ADR for pricing versioning.
- Resolve pricing money model: currency, precision, rounding.
- Resolve invoice numbering and draft policy.
- Resolve order lifecycle policy.

### P1 Before Database

- Create `docs/technical/DATA_MODEL.md`.
- Create `docs/technical/PERSISTENCE_PORTS.md`.
- Create central open-decision register.
- Define shared error model.
- Define shared tenant context.

### P2 Soon After Database

- Add repository contract tests.
- Add persistence integration tests.
- Add API request/response contracts.
- Add audit and provenance strategy.

## Final Assessment

Phase 1 is a good foundation. The repository has strong documentation discipline, well-scoped feature packages, meaningful Gherkin, useful decision tables, and tests that enforce the most important invariants.

The next engineering step should not be to rush into database tables. The next step should be to freeze the database-affecting business decisions and write the technical persistence design. Once that is done, database implementation can proceed with much less rework.

