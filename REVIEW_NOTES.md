# Architecture Hardening Sprint Review Notes

## Purpose

This sprint hardened architecture documentation before PostgreSQL, Prisma, Express, and React implementation.

No database design, database persistence, frontend, or new product functionality was implemented.

## Architecture Improvements

- Established the Customer Workspace as the operational entry point through [ADR-010](docs/decisions/ADR-010-Customer-Workspace.md).
- Documented customer-first navigation in [Navigation](docs/product/NAVIGATION.md).
- Defined business events in [Events](docs/technical/EVENTS.md).
- Defined aggregate ownership boundaries in [Data Ownership](docs/technical/DATA_OWNERSHIP.md).
- Defined module dependency rules in [Dependencies](docs/technical/DEPENDENCIES.md).
- Added a permissions baseline in [Role Matrix](docs/security/ROLE_MATRIX.md).
- Added business context for the ideal salesperson experience in [Customer Workspace](docs/business/CUSTOMER_WORKSPACE.md).
- Updated feature `SKILL.md` files to reference the new architecture hardening documents.

## New Decisions

### Customer Workspace Is The Operational Center

The customer workspace is now the preferred entry point into operational modules.

This reinforces the product vision: customer-first ERP, not invoice-first or accounting-first ERP.

### Navigation Optimizes Order Creation

The navigation hierarchy starts from Dashboard and Customers, then enters Customer Workspace tabs:

Overview, Orders, Pricing, Invoices, Warehouse, Documents, Notes, Future AI.

### Events Are First-Class Business Facts

Business events are documented for audit, notification, integration, and future AI use.

### Aggregate Ownership Is Explicit

Each aggregate now has ownership, reference, immutability, and snapshot guidance.

### Role Permissions Are Explicitly Matrixed

Administrator, Sales, Warehouse, Finance, Management, and Future API roles now have module-level permission guidance.

## Potential Future Risks

- If database implementation starts before open policies are resolved, schema churn is likely.
- If navigation becomes invoice-first, the product will drift away from the customer relationship ERP vision.
- If Customer Workspace becomes a reporting dashboard, order creation speed may suffer.
- If events are implemented without idempotency and replay rules, integrations may create duplicate side effects.
- If snapshots store only foreign keys, historical order and invoice truth may be lost.
- If tenant isolation is only enforced in UI, data leakage risk remains.
- If role permissions are implemented inconsistently across modules, operational trust will degrade.

## Recommendations Before Database Implementation

1. Create ADRs for tenant isolation, immutable snapshots, pricing versioning, order lifecycle, and invoice numbering.
2. Resolve required fields for Customer and Product.
3. Resolve pricing currency, precision, effective dates, and missing-price behavior.
4. Resolve order lifecycle states, locking, cancellation, and edit policy.
5. Resolve invoice numbering, draft behavior, issue preconditions, and correction policy.
6. Produce a technical data model only after the above decisions are approved.
7. Define persistence ports before implementing PostgreSQL or Prisma.
8. Define API request/response contracts before implementing Express routes.
9. Keep Customer Workspace as the first frontend design target when React begins.

## Explicit Non-Goals Completed

- No PostgreSQL implementation.
- No Prisma implementation.
- No Express implementation.
- No React implementation.
- No Phase 2 module implementation.
- No database schema implementation.

## Related Documentation

- [ADR-010 Customer Workspace](docs/decisions/ADR-010-Customer-Workspace.md)
- [Customer Workspace](docs/business/CUSTOMER_WORKSPACE.md)
- [Navigation](docs/product/NAVIGATION.md)
- [Events](docs/technical/EVENTS.md)
- [Data Ownership](docs/technical/DATA_OWNERSHIP.md)
- [Dependencies](docs/technical/DEPENDENCIES.md)
- [Role Matrix](docs/security/ROLE_MATRIX.md)
- [Architecture Review](REVIEW.md)

