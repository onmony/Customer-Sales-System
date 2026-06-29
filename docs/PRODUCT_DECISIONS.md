# Product Decisions

## Purpose

This document captures WHY key product and architectural decisions were made. These are business decisions that explain the rationale behind the product direction, not technical ADRs.

Related documents:

- [Vision](VISION.md) - Product direction
- [Principles](PRINCIPLES.md) - Product principles
- [Architecture Decision Records](decisions/README.md) - Technical decisions

## Customer First

### Decision

The product is organized around the customer, not around accounting records.

### Why

**Business Reality:**
- Salespeople work with customers, not ledgers
- The primary workflow starts with "Who is buying?"
- Customer relationships drive business growth
- Accounting is a downstream concern, not the starting point

**Competitive Differentiation:**
- Most ERPs are accounting-first
- Accounting-first navigation forces salespeople to think in ledger terms
- Customer-first navigation aligns with how salespeople actually work

**User Experience:**
- Reduces context switching for salespeople
- Supports the goal of fast, accurate order creation
- Makes customer relationship management the primary focus

**Consequences:**
- Navigation is customer-centered
- Customer Workspace is the operational entry point
- Accounting is one module, not the product center
- All workflows should support customer context

## Customer × Product Pricing

### Decision

Pricing is customer-specific, not product-specific.

### Why

**Business Reality:**
- Every customer may have different pricing for every product
- Volume discounts, negotiated rates, and contract pricing are common
- One-size-fits-all pricing doesn't work in B2B
- Pricing is a competitive lever in customer relationships

**Revenue Impact:**
- Customer-specific pricing enables price optimization
- Allows for strategic discounting
- Supports contract negotiations
- Enables customer segmentation

**Competitive Requirement:**
- Competitors offer customer-specific pricing
- Losing this capability would be a competitive disadvantage
- Customers expect personalized pricing

**Consequences:**
- Pricing is a first-class business capability
- Pricing is versioned to preserve history
- Pricing resolution is a core workflow
- Pricing data cannot be simplified to product-only

## Order Snapshots

### Decision

Orders store immutable snapshots of customer, product, and pricing data at the time of order creation.

### Why

**Business Truth:**
- An order represents what was agreed at a point in time
- If customer details change later, the historical order should not change
- If pricing changes later, historical orders should not be affected
- If product details change, historical orders should reflect the original product

**Audit Requirements:**
- Businesses need to prove what was agreed historically
- Disputes require historical accuracy
- Compliance requires preserving original transaction data
- Financial reporting requires historical accuracy

**Legal Requirements:**
- Commercial contracts are based on order terms
- Orders may be used in legal disputes
- Tax authorities may audit historical transactions
- Changing historical data creates legal risk

**Consequences:**
- Orders copy customer, product, and pricing data
- Order snapshots are immutable
- Current data changes do not affect historical orders
- Additional storage required for snapshot data

## Invoice Immutability

### Decision

Once issued, invoices cannot be modified. Corrections require credit notes or reversals.

### Why

**Legal Requirements:**
- Invoices are legal commercial documents
- Tax authorities require immutable invoice records
- Changing issued invoices may be illegal in some jurisdictions
- Audit trails require invoice immutability

**Financial Integrity:**
- Accounting systems require immutable invoices
- Financial reporting depends on invoice stability
- Revenue recognition requires stable invoice data
- Audits require invoice immutability

**Business Trust:**
- Customers expect invoices to be stable
- Changing invoices damages trust
- Disputes require clear invoice history
- Credit notes provide a proper correction mechanism

**Consequences:**
- Issued invoices cannot be modified
- Corrections require credit notes or reversals
- Invoice data is copied from order snapshots
- Additional workflow for invoice corrections

## Customer Workspace

### Decision

The Customer Workspace is the primary operational entry point for sales and service workflows.

### Why

**User Experience:**
- Salespeople need a single place to understand a customer
- Reduces navigation overhead
- Supports the goal of fast, accurate order creation
- Provides operational context before action

**Workflow Efficiency:**
- Customer Workspace shows: outstanding balance, credit status, last order, frequently ordered products, current pricing, preferred warehouse, preferred transport
- Salesperson can assess situation and create order quickly
- Reduces time to accurate order creation

**Future Extensibility:**
- Can absorb future modules without changing product center
- Warehouse readiness, shipment tracking, payments can be added as tabs
- AI suggestions can be integrated into workspace
- Risk signals can be displayed

**Consequences:**
- Customer Workspace is a READ MODEL (composes data but doesn't own it)
- Navigation is customer-centered
- Module pages exist but customer-scoped views are primary
- API and frontend design must preserve customer context

## Import Center Before AI

### Decision

Prioritize Import Center for onboarding existing businesses before AI features.

### Why

**Business Reality:**
- Most businesses transitioning to this ERP have existing data
- Manual data entry is error-prone and time-consuming
- Onboarding friction is a major adoption barrier
- Without import capability, onboarding is impractical

**Time to Value:**
- Import Center enables faster customer onboarding
- Customers can start using the system sooner
- Reduces implementation time
- Improves customer satisfaction

**AI Dependency:**
- AI features require historical data to be effective
- Import Center provides the data foundation for AI
- AI without data has limited value
- Import Center is foundational for AI success

**Consequences:**
- Import Center is Phase 1/2 priority
- AI features are Phase 4 priority
- Import Center provides data for AI training
- AI features depend on imported data quality

## Configuration Driven Authorization

### Decision

Authorization is configuration-driven via YAML bootstrap, not hardcoded in application code.

### Why

**Business Flexibility:**
- Roles and permissions change as business evolves
- Hardcoded roles require code deployment for changes
- Business users need to manage roles without developer involvement
- Different tenants may need different roles

**Multi-Tenant Readiness:**
- Configuration-driven approach supports tenant-specific overrides
- Hardcoded roles cannot be customized per tenant
- Future tenant customization requires configuration foundation
- Database as source of truth enables tenant isolation

**Operational Efficiency:**
- Role Management UI allows business users to manage roles
- Reduces dependency on development team
- Faster response to business needs
- Better alignment with business operations

**Consequences:**
- YAML provides default roles only
- Database becomes source of truth after bootstrap
- Role Management UI is required
- No hardcoded role names in application code

## Multi-Tenant Foundation

### Decision

Multi-tenancy is a foundation, not a later enhancement.

### Why

**Business Model:**
- Product is a SaaS ERP
- Multiple businesses will use the same instance
- Multi-tenancy is core to the business model
- Adding multi-tenancy later would require major rework

**Cost Efficiency:**
- Shared infrastructure reduces operational costs
- Economies of scale enable competitive pricing
- Single codebase reduces maintenance overhead
- Shared resources improve resource utilization

**Competitive Requirement:**
- Competitors offer multi-tenant SaaS
- Single-tenant architecture would be competitive disadvantage
- Customers expect SaaS multi-tenancy
- Multi-tenancy is standard in SaaS ERP market

**Future Flexibility:**
- Multi-tenant foundation enables tenant-specific customization
- Supports white-label solutions
- Enables franchise or subsidiary models
- Provides upgrade path for enterprise features

**Consequences:**
- All tables include tenant_id
- All queries filter by tenant
- Tenant context is propagated throughout system
- Additional complexity in data isolation

## Configuration Philosophy

### Decision

Configuration that a business may eventually customize belongs in `config/`. Core business logic never belongs in configuration.

### Why

**Separation of Concerns:**
- Business rules should be documented and stable
- Configurable defaults should be editable
- Mixing business logic with configuration creates confusion
- Clear separation enables proper governance

**Business Control:**
- Businesses need to customize operational defaults (statuses, types, flags)
- Businesses should not customize core business logic
- Configuration provides customization without code changes
- Business logic remains stable and auditable

**Scalability:**
- Configuration-driven defaults scale well
- Adding new configuration items is low-risk
- Business logic changes are high-risk
- Clear boundary prevents scope creep

**Consequences:**
- `config/` contains bootstrapped, editable defaults
- Business rules are documented in SKILL.md and ADRs
- Configuration is bootstrapped into database
- Database becomes source of truth for configuration

## History Preservation

### Decision

Business history must be preserved. Current state must not overwrite past truth.

### Why

**Audit Requirements:**
- Businesses need to audit historical changes
- Compliance requires preserving history
- Disputes require historical accuracy
- Regulatory requirements mandate history preservation

**Business Intelligence:**
- Historical data enables trend analysis
- Pricing history supports pricing optimization
- Customer history supports relationship management
- Operational history supports process improvement

**Legal Requirements:**
- Commercial transactions require historical records
- Tax authorities require historical data
- Legal disputes require historical accuracy
- Regulatory compliance requires history preservation

**Consequences:**
- Pricing is versioned and append-only
- Orders store immutable snapshots
- Invoices are immutable
- Events preserve change history
- Additional storage for historical data

## Cross References

- [Vision](VISION.md) - Product vision
- [Principles](PRINCIPLES.md) - Product principles
- [Architecture Decision Records](decisions/README.md) - Technical decisions
- [Customer Workspace ADR](decisions/ADR-010-Customer-Workspace.md) - Customer Workspace decision
- [Authorization Bootstrap ADR](decisions/ADR-014-Authorization-Bootstrap.md) - Configuration-driven authorization
