# Database Migration Strategy

## Purpose

This document defines the database migration strategy for the Customer-Sales-System, covering development, staging, and production environments.

**Status:** Authoritative - This is the source of truth for database migrations.

Related documents:
- [Architecture V1 Final](../ARCHITECTURE_V1_FINAL.md) - Architecture baseline
- [Tech Stack](../TECH_STACK.md) - Technology stack (Prisma, PostgreSQL)

## Migration Tool

**Tool:** Prisma Migrate

**Why:**
- Type-safe migrations
- Automatic migration generation from schema changes
- Migration history tracking
- Rollback capability
- PostgreSQL support
- Simple to use and maintain

## Migration Workflow

### Development

**Process:**
1. Make schema changes in `backend/prisma/schema.prisma`
2. Run `npm run prisma:migrate -- --name <migration_name>`
3. Prisma generates migration SQL in `backend/prisma/migrations/`
4. Prisma applies migration to local database
5. Review generated SQL
6. Commit migration files

**Commands:**
```bash
# Create and apply migration
npm run prisma:migrate -- --name <migration_name>

# Create migration without applying (for review)
npm run prisma:migrate -- --create-only --name <migration_name>

# Apply pending migrations
npm run prisma:migrate

# Reset database (WARNING: deletes all data)
npm run prisma:migrate -- --force-reset
```

### Staging

**Process:**
1. Pull latest migration files from repository
2. Review migration SQL
3. Run `npm run prisma:migrate deploy`
4. Verify migration success
5. Run seed if needed

**Commands:**
```bash
# Apply migrations (production-safe)
npm run prisma:migrate deploy
```

### Production

**Process:**
1. Create backup of production database
2. Pull latest migration files from repository
3. Review migration SQL in staging environment
4. Test migration in staging
5. Schedule production deployment window
6. Apply migration to production
7. Verify migration success
8. Monitor for issues

**Commands:**
```bash
# Apply migrations (production-safe)
npm run prisma:migrate deploy

# Check migration status
npx prisma migrate status
```

## Migration Naming Convention

**Format:** `<timestamp>_<description>`

**Examples:**
- `20240101_add_customer_credit_limit`
- `20240102_add_pricing_version_index`
- `20240103_add_delivery_proof_of_delivery`

**Guidelines:**
- Use lowercase letters
- Use underscores instead of spaces
- Be descriptive but concise
- Use present tense verbs (add, remove, update)

## Migration Best Practices

### Schema Changes

**Do:**
- Make small, incremental changes
- One logical change per migration
- Review generated SQL before committing
- Test migrations in staging before production
- Back up production database before migration

**Don't:**
- Make breaking changes without planning
- Combine multiple logical changes in one migration
- Modify existing migrations (create new migration instead)
- Skip migration review
- Migrate production without backup

### Data Migrations

For data migrations (changing existing data), use Prisma's `seed.ts` or create a custom script:

```bash
# Run custom data migration script
npx tsx prisma/migrations/<timestamp>/migration.ts
```

### Rollback Strategy

**Prisma does not support automatic rollbacks.**

**Manual Rollback Process:**
1. Identify the migration to rollback
2. Write SQL to reverse the migration
3. Apply SQL manually
4. Update `_prisma_migrations` table to reflect rollback
5. Document the rollback

**Alternative:** Create a new migration that reverses the previous change.

## Database Seeding

**Purpose:** Bootstrap default data (roles, permissions, statuses, feature flags)

**Seed Script:** `backend/prisma/seed.ts`

**Commands:**
```bash
# Run seed
npm run prisma:seed
```

**Seed Behavior:**
- Checks `system_config` table for `bootstrap_completed` flag
- If bootstrap is complete, seed skips execution
- Uses upsert operations to avoid duplicates
- Reads from `config/` directory YAML files

**Seed Data:**
- Roles (Administrator, Sales, Warehouse, Finance, Manager)
- Permissions (73 permissions across domains)
- Feature Flags (10 feature flags)
- Order Statuses (8 statuses)
- Invoice Statuses (10 statuses)
- Customer Statuses (4 statuses)
- Pricing Statuses (5 statuses)

## Multi-Tenancy Considerations

**Shared Database, Shared Schema Strategy:**

All tenant data is in the same database and schema, isolated by `tenant_id` column.

**Migration Impact:**
- Migrations apply to all tenants simultaneously
- No tenant-specific migrations
- All tables include `tenant_id` (except shared tables)
- Indexes include `tenant_id` for query performance

**Data Isolation:**
- Application-level enforcement (middleware, repository layer)
- Database-level constraints (unique constraints include `tenant_id`)
- Row-level security (future enhancement)

## Database Constraints

### Unique Constraints

**Tenant-Scoped Uniques:**
- `users`: `[tenantId, email]`
- `orders`: `[tenantId, orderNumber]`
- `invoices`: `[tenantId, invoiceNumber]`
- `pricings`: `[tenantId, customerId, productId, effectiveDate]`

**Global Uniques:**
- `tenants`: `subdomain`
- `roles`: `name`
- `permissions`: `name`
- `featureFlags`: `name`
- `orderStatuses`: `code`
- `invoiceStatuses`: `code`
- `customerStatuses`: `code`
- `pricingStatuses`: `code`

### Foreign Keys

All foreign keys use `onDelete: Cascade` to maintain referential integrity.

### Indexes

**Tenant Indexes:**
- All tenant-scoped tables have `tenantId` index
- All tenant-scoped tables have `deletedAt` index (for soft delete queries)

**Query Indexes:**
- `tenants`: `subdomain`
- `roles`: `name`
- `permissions`: `name`, `domain`
- `customers`: `statusId`, `displayName`, `gstNumber`
- `products`: `displayName`, `sku`
- `pricings`: `customerId`, `productId`, `effectiveDate`, `statusId`
- `orders`: `customerId`, `orderNumber`, `orderDate`, `statusId`
- `invoices`: `orderId`, `customerId`, `invoiceNumber`, `issuedAt`, `statusId`

## Soft Delete Strategy

**Implementation:**
- All tenant-scoped tables have `deletedAt` column (nullable DateTime)
- Soft delete sets `deletedAt` to current timestamp
- Hard delete removes the row
- Queries filter out records where `deletedAt` is not null

**Migration Considerations:**
- Add `deletedAt` column to new tables
- Add `deletedAt` index for query performance
- Update queries to filter soft-deleted records

## Audit Columns

**Standard Audit Columns:**
- `createdAt`: DateTime (auto-populated)
- `updatedAt`: DateTime (auto-updated)
- `createdBy`: String (nullable, user ID)
- `updatedBy`: String (nullable, user ID)
- `deletedAt`: DateTime (nullable, soft delete)

**Correlation ID:**
- Added to tables where traceability is required (Order, Invoice, WarehouseRequest, Shipment, Delivery, Payment)
- Used for request tracing and audit trails

## Money Value Object Persistence

**Strategy:** Store as Decimal with precision (15, 2)

**Fields:**
- `creditLimit` (Customer): Decimal(15, 2)
- `price` (Pricing): Decimal(15, 2)
- `totalAmount` (Order): Decimal(15, 2)
- `totalAmount` (Invoice): Decimal(15, 2)
- `amount` (Payment): Decimal(15, 2)

**Currency:**
- Stored as separate `currency` field (String, default "INR")
- Supports multi-currency in future

## UUID Strategy

**Implementation:** Use PostgreSQL UUID type with default UUID generation

**Primary Keys:** All tables use UUID primary keys

**Benefits:**
- Globally unique identifiers
- No sequential ID exposure
- Distributed system friendly
- No ID collision across tenants

## Timestamp Strategy

**Implementation:** Use PostgreSQL TIMESTAMP type

**Fields:**
- `createdAt`: DateTime @default(now())
- `updatedAt`: DateTime @updatedAt
- `effectiveDate`: DateTime (Pricing)
- `expiryDate`: DateTime? (Pricing)
- `orderDate`: DateTime @default(now()) (Order)
- `issuedAt`: DateTime? (Invoice)
- `dueDate`: DateTime? (Invoice)

**Timezone:** All timestamps stored in UTC

## Database Naming Conventions

**Table Names:** snake_case, plural
- `tenants`, `users`, `customers`, `products`, `orders`, `invoices`

**Column Names:** camelCase
- `tenantId`, `createdAt`, `updatedAt`, `deletedAt`

**Foreign Keys:** camelCase with "Id" suffix
- `tenantId`, `customerId`, `productId`, `orderId`

**Indexes:** Automatically named by Prisma

## Migration Checklist

**Before Migration:**
- [ ] Schema changes reviewed
- [ ] Migration SQL reviewed
- [ ] Migration tested in staging
- [ ] Database backup created (production)
- [ ] Migration window scheduled (production)

**After Migration:**
- [ ] Migration applied successfully
- [ ] Data integrity verified
- [ ] Application tested
- [ ] Performance verified
- [ ] Rollback plan documented (if needed)

## Migration Troubleshooting

### Common Issues

**Issue:** Migration fails due to data conflicts
**Solution:** Resolve data conflicts manually, then retry migration

**Issue:** Migration fails due to lock contention
**Solution:** Wait for locks to release, or retry during maintenance window

**Issue:** Migration SQL is incorrect
**Solution:** Create new migration to fix the issue, do not modify existing migration

**Issue:** Seed fails after migration
**Solution:** Check seed data conflicts, update seed script if needed

## Related Documents

- [Architecture V1 Final](../ARCHITECTURE_V1_FINAL.md) - Architecture baseline
- [Tech Stack](../TECH_STACK.md) - Technology stack
- [Multi-Tenant Strategy](../decisions/ADR-012-Multi-Tenant-Strategy.md) - Multi-tenancy ADR
- [Data Ownership](../technical/DATA_OWNERSHIP.md) - Data ownership rules
