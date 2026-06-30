# Module 2 - Database Foundation Summary

**Date:** June 30, 2026
**Status:** Completed

## Objective

Implement the complete database foundation for the application, establishing the persistence layer without any business workflows, REST APIs, or React pages.

---

## Files Created

### Database Schema
- `backend/prisma/schema.prisma` - Complete Prisma schema with 23 models

### Seed Framework
- `backend/prisma/seed.ts` - Database bootstrap script
- `config/customer-statuses.yaml` - Customer statuses configuration
- `config/pricing-statuses.yaml` - Pricing statuses configuration

### Repository Interfaces
- `backend/src/repositories/TenantRepository.ts`
- `backend/src/repositories/CustomerRepository.ts`
- `backend/src/repositories/ProductRepository.ts`
- `backend/src/repositories/PricingRepository.ts`
- `backend/src/repositories/OrderRepository.ts`
- `backend/src/repositories/InvoiceRepository.ts`
- `backend/src/repositories/WarehouseRepository.ts`
- `backend/src/repositories/ShipmentRepository.ts`
- `backend/src/repositories/DeliveryRepository.ts`
- `backend/src/repositories/PaymentRepository.ts`
- `backend/src/repositories/UserRepository.ts`
- `backend/src/repositories/RoleRepository.ts`
- `backend/src/repositories/PermissionRepository.ts`
- `backend/src/repositories/index.ts` - Barrel export

### Documentation
- `docs/technical/MIGRATION_STRATEGY.md` - Migration strategy documentation

### Configuration Updates
- `backend/package.json` - Added `js-yaml` and `@types/js-yaml` dependencies

---

## Migration Summary

**Migration Name:** `20260630052919_init`
**Status:** Applied successfully
**Database:** PostgreSQL (postgres schema at localhost:5432)

**Migration Details:**
- Created 23 tables
- Applied all foreign key constraints
- Applied all unique constraints
- Created all indexes

---

## Tables Created

### Shared Tables (No tenant_id)
1. `tenants` - Tenant configuration
2. `roles` - System roles
3. `permissions` - System permissions
4. `user_roles` - User-role assignments with tenant scope
5. `role_permissions` - Role-permission mappings
6. `system_config` - System configuration key-value store
7. `feature_flags` - Feature flag configuration
8. `order_statuses` - Order workflow statuses
9. `invoice_statuses` - Invoice workflow statuses
10. `customer_statuses` - Customer workflow statuses
11. `pricing_statuses` - Pricing workflow statuses

### Tenant-Scoped Tables (With tenant_id and audit columns)
12. `users` - User accounts
13. `customers` - Customer records
14. `products` - Product catalog
15. `pricings` - Customer-specific pricing
16. `orders` - Sales orders
17. `invoices` - Invoices
18. `warehouse_requests` - Warehouse processing requests
19. `shipments` - Shipping records
20. `deliveries` - Delivery records
21. `payments` - Payment records

---

## Indexes Created

### Tenant Indexes
All tenant-scoped tables have `tenantId` index for query performance:
- `users`, `customers`, `products`, `pricings`, `orders`, `invoices`, `warehouse_requests`, `shipments`, `deliveries`, `payments`

### Soft Delete Indexes
All tenant-scoped tables have `deletedAt` index for soft delete queries:
- `users`, `customers`, `products`, `pricings`, `orders`, `invoices`, `warehouse_requests`, `shipments`, `deliveries`, `payments`

### Query-Specific Indexes
- `tenants`: `subdomain`
- `roles`: `name`
- `permissions`: `name`, `domain`
- `user_roles`: `userId`, `roleId`, `tenantId`
- `role_permissions`: `roleId`, `permissionId`
- `system_config`: `key`
- `feature_flags`: `name`
- `order_statuses`: `code`
- `invoice_statuses`: `code`
- `customer_statuses`: `code`
- `pricing_statuses`: `code`
- `customers`: `statusId`, `displayName`, `gstNumber`
- `products`: `displayName`, `sku`
- `pricings`: `customerId`, `productId`, `effectiveDate`, `statusId`
- `orders`: `customerId`, `orderNumber`, `orderDate`, `statusId`
- `invoices`: `orderId`, `customerId`, `invoiceNumber`, `issuedAt`, `statusId`
- `warehouse_requests`: `orderId`, `status`
- `shipments`: `customerId`, `status`
- `deliveries`: `shipmentId`, `customerId`, `status`
- `payments`: `invoiceId`

**Total Indexes:** 50+

---

## Constraints Created

### Unique Constraints

#### Global Uniques
- `tenants.subdomain`
- `roles.name`
- `permissions.name`
- `feature_flags.name`
- `order_statuses.code`
- `invoice_statuses.code`
- `customer_statuses.code`
- `pricing_statuses.code`

#### Tenant-Scoped Uniques
- `users`: `[tenantId, email]`
- `customers`: `[tenantId, id]`
- `products`: `[tenantId, id]`
- `pricings`: `[tenantId, customerId, productId, effectiveDate]`
- `orders`: `[tenantId, orderNumber]`
- `invoices`: `[tenantId, invoiceNumber]`
- `user_roles`: `[userId, roleId, tenantId]`
- `role_permissions`: `[roleId, permissionId]`

### Foreign Keys
All foreign keys use `onDelete: Cascade` to maintain referential integrity across all 21 tables with relations.

---

## Seed Summary

**Seed Status:** Completed successfully
**Bootstrap Flag:** `bootstrap_completed = true` in `system_config`

### Seeded Data

#### Permissions (73)
- Customer permissions (6)
- Product permissions (6)
- Order permissions (8)
- Pricing permissions (7)
- Invoice permissions (9)
- Warehouse permissions (6)
- Shipment permissions (7)
- Reporting permissions (4)
- User management permissions (6)
- Role management permissions (6)
- Import permissions (5)
- System permissions (3)

#### Roles (5)
- Administrator (wildcard permissions)
- Sales (customer, order, pricing, invoice permissions)
- Warehouse (warehouse, shipment, order permissions)
- Finance (pricing, invoice, report permissions)
- Manager (oversight permissions)

#### Feature Flags (10)
- customer_workspace (enabled)
- import_center (enabled)
- global_search (enabled)
- ai_suggestions (disabled - Phase 4)
- pricing_templates (disabled - Phase 4)
- customer_groups (disabled - Phase 4)
- field_level_permissions (disabled - Phase 4)
- multi_tenant_overrides (disabled - Phase 3)
- event_outbox (disabled - Phase 3)
- background_jobs (disabled - Phase 3)

#### Order Statuses (8)
- draft, pending, confirmed, processing, shipped, delivered, cancelled, on_hold

#### Invoice Statuses (10)
- draft, generated, issued, sent, viewed, partial, paid, overdue, void, written_off

#### Customer Statuses (4)
- active, inactive, on_hold, blocked

#### Pricing Statuses (5)
- draft, active, future, expired, cancelled

---

## Repository Interfaces Created

### Core Business Repositories
1. `TenantRepository` - Tenant management
2. `CustomerRepository` - Customer CRUD with soft delete
3. `ProductRepository` - Product CRUD with soft delete
4. `PricingRepository` - Pricing with effective date resolution
5. `OrderRepository` - Order CRUD with soft delete
6. `InvoiceRepository` - Invoice CRUD with soft delete

### Operational Repositories
7. `WarehouseRepository` - Warehouse request management
8. `ShipmentRepository` - Shipment tracking
9. `DeliveryRepository` - Delivery confirmation
10. `PaymentRepository` - Payment processing

### Authorization Repositories
11. `UserRepository` - User management with role assignment
12. `RoleRepository` - Role management with permission assignment
13. `PermissionRepository` - Permission management

**Key Features:**
- All repositories use Prisma types for type safety
- Tenant-scoped queries where applicable
- Soft delete support for tenant-scoped entities
- Common CRUD operations
- Domain-specific query methods (e.g., `findByOrderNumber`, `findActivePricing`)

---

## Database Standards Implemented

### Multi-Tenancy
- Shared database, shared schema strategy (ADR-012)
- Row-level isolation via `tenant_id` column
- Tenant-scoped unique constraints
- Tenant-scoped indexes for query performance

### Audit Columns
All tenant-scoped tables include:
- `createdAt` - Auto-populated timestamp
- `updatedAt` - Auto-updated timestamp
- `createdBy` - Nullable user ID
- `updatedBy` - Nullable user ID
- `deletedAt` - Nullable timestamp (soft delete)

### Correlation ID
Added to tables requiring traceability:
- Order, Invoice, WarehouseRequest, Shipment, Delivery, Payment

### Optimistic Locking
- `version` field added to Pricing table for version control

### Soft Delete Strategy
- `deletedAt` column on all tenant-scoped tables
- Index on `deletedAt` for query performance
- Repository methods for soft delete

### Money Value Object Persistence
- Decimal(15, 2) for all monetary fields
- Separate `currency` field (default "INR")
- Fields: `creditLimit`, `price`, `totalAmount` (Order/Invoice), `amount` (Payment)

### UUID Strategy
- PostgreSQL UUID type for all primary keys
- Default UUID generation
- Globally unique identifiers

### Timestamp Strategy
- PostgreSQL TIMESTAMP type
- All timestamps in UTC
- Auto-populated `createdAt` and `updatedAt`

### Database Naming Conventions
- Table names: snake_case, plural
- Column names: camelCase
- Foreign keys: camelCase with "Id" suffix

---

## Verification Results

### Build
✅ **PASS** - TypeScript compilation successful

### Lint
✅ **PASS** - ESLint passed with TypeScript version warning (non-blocking)

### Migration
✅ **PASS** - Migration `20260630052919_init` applied successfully
✅ **PASS** - Database schema is up to date

### Seed
✅ **PASS** - Seed completed successfully
- 73 permissions seeded
- 5 roles seeded
- 10 feature flags seeded
- 8 order statuses seeded
- 10 invoice statuses seeded
- 4 customer statuses seeded
- 5 pricing statuses seeded
- System config bootstrap flag set

---

## Manual Review Required

### Environment Configuration
- `.env` file was created manually with local PostgreSQL credentials
- **Action Required:** Ensure `.env` is properly configured for production deployment
- **Action Required:** Add `.env` to `.gitignore` if not already present (backend/.gitignore)

### TypeScript Version Warning
- TypeScript 5.9.3 is not officially supported by @typescript-eslint (supports >=4.3.5 <5.4.0)
- **Impact:** Non-blocking warning, tools work correctly
- **Recommendation:** Consider downgrading to TypeScript 5.3.x or upgrading @typescript-eslint when compatible

### Dependency Vulnerabilities
- 12 vulnerabilities (2 moderate, 7 high, 3 critical) in dev dependencies
- **Impact:** Non-blocking for development
- **Recommendation:** Run `npm audit fix` to address security vulnerabilities

---

## Out of Scope (Not Implemented)

As per Module 2 requirements, the following were intentionally not implemented:

- ❌ Customer business logic
- ❌ Product business logic
- ❌ Pricing business logic
- ❌ Order business logic
- ❌ Invoice business logic
- ❌ Authentication
- ❌ Authorization
- ❌ Warehouse business logic
- ❌ Shipment business logic
- ❌ WhatsApp integration
- ❌ AI features
- ❌ REST APIs
- ❌ React UI
- ❌ Demo customers
- ❌ Demo products
- ❌ Demo pricing

---

## Next Steps

Module 2 is complete. The database foundation is ready for business logic implementation in future modules.

**Recommended Next Module:**
- Module 3: Authentication & Authorization (if following architecture roadmap)
- Module 4: Customer Module (if prioritizing core business features)

**Before Proceeding:**
1. Review repository interfaces and adjust if needed
2. Verify database constraints match business requirements
3. Test seed data in staging environment
4. Update `.env` for production deployment

---

## Architecture Compliance

✅ **ADR-012 Multi-Tenant Strategy** - Shared database, shared schema with row-level isolation
✅ **ADR-017 Correlation ID** - Added to relevant tables for traceability
✅ **Audit Columns** - All tenant-scoped tables have full audit trail
✅ **Soft Delete** - Implemented with `deletedAt` column
✅ **Money Value Object** - Decimal(15, 2) with currency field
✅ **UUID Strategy** - PostgreSQL UUID for all primary keys
✅ **Timestamp Strategy** - UTC timestamps with auto-population
✅ **Repository Pattern** - Interfaces only, no business logic
✅ **Seed Framework** - Configuration-driven bootstrap from `config/` directory
✅ **Database Naming Conventions** - Followed approved conventions

---

## Definition of Done

✅ Prisma schema implemented
✅ Migration generated and applied
✅ Repository interfaces created
✅ Seed framework implemented
✅ Database bootstrap completed
✅ Database indexes added
✅ Database constraints added
✅ Money value object persistence strategy defined
✅ UUID strategy implemented
✅ Timestamp strategy implemented
✅ Prisma configuration updated
✅ Database naming conventions followed
✅ Migration strategy documentation created
✅ Build passes
✅ Migration succeeds
✅ Seed succeeds

**Module 2 Status:** ✅ COMPLETED
