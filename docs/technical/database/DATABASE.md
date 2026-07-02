# Database Documentation

## Overview

This document describes the database architecture, workflow, and operational procedures for the Customer Sales System.

## Prisma Workflow

### Source of Truth

**`backend/prisma/schema.prisma`** is the single source of truth for the database schema.

- All schema changes must be made in `schema.prisma`
- Never modify the database directly
- Never write manual SQL DDL/DML for schema changes
- Prisma migrations are the only approved mechanism for schema changes

### Migration Philosophy

**Forward-Only Migrations**

- Migrations are always forward-only
- Never rollback migrations in production
- If a migration is incorrect, create a corrective migration
- Rollback strategy: restore from backup or create corrective migration

**Migration Lifecycle**

1. Developer modifies `schema.prisma`
2. Run `npx prisma migrate dev --name <description>` to create migration
3. Review generated SQL in `backend/prisma/migrations/`
4. Commit both schema change and migration
5. In production, run `npx prisma migrate deploy` to apply pending migrations

### Development Workflow

**Local Development**

```bash
# 1. Configure DATABASE_URL in .env
DATABASE_URL="postgresql://user:password@localhost:5432/customer_sales_system"

# 2. Generate Prisma client
npm run prisma:generate

# 3. Apply migrations (creates database if needed)
npm run prisma:migrate

# 4. Seed master data
npm run prisma:seed

# 5. Start application
npm run dev
```

**Making Schema Changes**

```bash
# 1. Modify schema.prisma
# 2. Create migration
npx prisma migrate dev --name add_new_field

# 3. Review migration SQL
# 4. Regenerate Prisma client
npm run prisma:generate

# 5. Test changes
```

**Reset Development Database**

```bash
# WARNING: Drops and recreates database
npm run db:reset
```

### Production Workflow

**Deployment**

```bash
# 1. Deploy code with new migrations
# 2. Apply migrations
npm run prisma:deploy

# 3. Generate Prisma client
npm run prisma:generate

# 4. Restart application
```

**Pre-Deployment Checklist**

- [ ] Review all pending migrations
- [ ] Test migrations in staging environment
- [ ] Backup production database
- [ ] Verify migration SQL is correct
- [ ] Ensure no data loss in migration
- [ ] Plan corrective migration if needed

### Seed Workflow

**Seed Data Types**

1. **Master Data**: Status codes, reference data (required for application to function)
2. **Test Data**: Sample tenants, customers, products (for development/testing only)

**Seeding Process**

```bash
# Seed master data (safe for production)
npm run prisma:seed

# The seed script is idempotent - can be run multiple times safely
```

**Seed File Location**

- `backend/prisma/seed.ts` - Main seed script
- Uses Prisma Client to insert master data
- Checks for existing data before inserting (idempotent)

### Deployment Workflow

**Local PostgreSQL**

```bash
# 1. Install PostgreSQL
# 2. Create database
createdb customer_sales_system

# 3. Configure .env
DATABASE_URL="postgresql://user:password@localhost:5432/customer_sales_system"

# 4. Run setup
npm run db:setup
```

**Docker PostgreSQL**

```bash
# 1. Start PostgreSQL container
docker run --name postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=customer_sales_system \
  -p 5432:5432 \
  -d postgres:16

# 2. Configure .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/customer_sales_system"

# 3. Run setup
npm run db:setup
```

**Cloud PostgreSQL**

```bash
# 1. Create PostgreSQL instance in cloud provider
# 2. Get connection string
# 3. Configure .env
DATABASE_URL="postgresql://user:password@host:port/database"

# 4. Run setup
npm run db:setup
```

### Backup Recommendations

**Development**

- Backup before running `db:reset`
- Backup before applying major schema changes
- Use `pg_dump` for logical backups

```bash
pg_dump customer_sales_system > backup.sql
```

**Production**

- Daily automated backups
- Point-in-time recovery enabled
- Backups stored in multiple locations
- Test restore procedures regularly

**Backup Strategy**

- Full backup: Daily
- WAL archiving: Continuous (for point-in-time recovery)
- Retention: 30 days
- Offsite: Yes

### Recovery Recommendations

**Development Recovery**

```bash
# Restore from backup
psql customer_sales_system < backup.sql

# Or use db:reset to start fresh
npm run db:reset
```

**Production Recovery**

1. Stop application
2. Restore from latest backup
3. Apply WAL logs to reach recovery point
4. Verify data integrity
5. Restart application
6. Monitor for errors

**Recovery Testing**

- Test restore procedures monthly
- Document recovery time objectives (RTO)
- Document recovery point objectives (RPO)

### Rollback Strategy

**Forward-Only Approach**

- Never rollback migrations in production
- If migration is incorrect, create corrective migration
- Example: If migration adds wrong column, create migration to drop column and add correct one

**Rollback Scenarios**

**Scenario 1: Migration has SQL error**

```bash
# 1. Stop application
# 2. Restore from backup
# 3. Fix migration SQL
# 4. Create new migration
# 5. Apply new migration
# 6. Restart application
```

**Scenario 2: Migration has data loss**

```bash
# 1. Stop application
# 2. Restore from backup
# 3. Create corrective migration
# 4. Apply corrective migration
# 5. Restart application
```

**Scenario 3: Application bug after migration**

```bash
# 1. Rollback application code (not database)
# 2. Database remains in new state
# 3. Fix application code
# 4. Deploy fixed code
```

### Prisma Studio

**Database GUI**

```bash
# Open Prisma Studio (development only)
npm run db:studio
```

- Provides web-based database viewer
- Useful for development and debugging
- Never use in production

### Environment Variables

**Required Variables**

```bash
# Database connection string
DATABASE_URL="postgresql://user:password@host:port/database"

# Environment (development, staging, production)
NODE_ENV="development"
```

**Optional Variables**

```bash
# Prisma binary path (if needed)
PRISMA_SCHEMA_PATH="backend/prisma/schema.prisma"
```

### Troubleshooting

**Migration Conflicts**

```bash
# If multiple developers create migrations with same name
# Rename migration folder manually
# Then run:
npx prisma migrate resolve --applied <migration-name>
```

**Prisma Client Generation Issues**

```bash
# Delete generated client
rm -rf node_modules/.prisma

# Regenerate
npm run prisma:generate
```

**Connection Issues**

```bash
# Test database connection
npx prisma db push --accept-data-loss

# Check DATABASE_URL is correct
# Check database is running
# Check network connectivity
```

### Best Practices

1. **Always review generated migration SQL** before committing
2. **Test migrations in staging** before production
3. **Backup before major changes** in production
4. **Never modify database directly** - always use Prisma
5. **Keep migrations small** - one logical change per migration
6. **Document complex migrations** in comments
7. **Use transactions** for data migrations
8. **Monitor migration performance** in production

### Related Documentation

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TECH_STACK.md](../../TECH_STACK.md)
- [ARCHITECTURE_V1_FINAL.md](../../ARCHITECTURE_V1_FINAL.md)
