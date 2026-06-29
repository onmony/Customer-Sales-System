# ADR-015 Import Center

## Status

Accepted for architecture hardening.

## Context

Onboarding existing businesses to the ERP requires migrating their master data from legacy systems. Common data to migrate includes:

- Customer records
- Product catalogs
- Customer-specific pricing
- Historical data (optional)

Without a structured import capability, onboarding becomes:
- Manual data entry (error-prone, time-consuming)
- Custom scripts for each customer (not scalable)
- No validation or error reporting
- No rollback capability
- No audit trail

## Decision

The system will include an **Import Center** that provides structured, validated import capabilities for master data onboarding.

### Import Types

**Phase 1:**
- Customer Import
- Product Import
- Pricing Import

**Phase 2 (Future):**
- Tally Import (accounting software integration)

### Import Workflow

**Step-by-Step Process:**
1. Upload file (Excel, CSV)
2. Parse and validate data
3. Preview data with error highlighting
4. Confirm import with options
5. Execute import transactionally
6. Show results with error report

**Validation Levels:**
- File format validation
- Required field validation
- Data type validation
- Business rule validation
- Duplicate detection

### Duplicate Detection

**Detection Methods:**
- Exact match on primary fields (customer name, product code)
- Exact match on secondary fields (email, phone)
- Fuzzy match on names (similarity > 80%)

**Resolution Options:**
- Skip duplicate records
- Update existing records
- Create as new record with suffix
- Manual review required

### Rollback Capability

**Automatic Rollback:**
- Triggered by critical errors during import
- Transaction failure
- Database constraint violations
- User cancellation during import

**Manual Rollback:**
- User can rollback completed imports within time window (e.g., 24 hours)
- Rollback entire import job
- Rollback specific records from import job

### Import Audit

**Audit Log:**
Every import job logs:
- Import job ID
- Import type
- User who initiated import
- File name and hash
- Start/end time
- Total rows processed
- Rows succeeded/failed
- Rollback status

**Change Tracking:**
Imported records track:
- Source system
- Source record ID
- Import job ID
- Import timestamp
- Imported by user

### Data Ownership During Import

**Aggregate Creation:**
- Customer import creates Customer aggregates
- Product import creates Product aggregates
- Pricing import creates Pricing aggregates

**Aggregate Rules:**
- Import respects aggregate ownership boundaries
- Import does not violate aggregate invariants
- Import emits appropriate business events
- Import follows dependency rules (Pricing requires Customer and Product)

### Error Handling

**Error Types:**
- File errors (invalid format, corrupted file)
- Validation errors (missing fields, invalid data)
- Duplicate errors (conflicting records)
- System errors (database failures)

**Error Recovery:**
- Show row-level errors
- Highlight problematic fields
- Suggest corrections
- Allow fix and re-upload

### Security

**Authorization:**
Import capabilities require specific permissions:
- `import.customer` - Import customers
- `import.product` - Import products
- `import.pricing` - Import pricing
- `import.rollback` - Rollback imports
- `import.view_audit` - View import audit logs

**Tenant Isolation:**
- Imports are tenant-scoped
- Cross-tenant imports are prohibited
- Import jobs are isolated per tenant

**Data Privacy:**
- Import files encrypted at rest
- Import files deleted after processing
- Sensitive data masked in logs

## Consequences

**Positive:**
- Structured onboarding process
- Validation and error reporting
- Rollback capability
- Audit trail for compliance
- Scalable to multiple customers
- Reduces manual data entry errors

**Negative:**
- Additional complexity (import workflow)
- Need to maintain import templates
- File format validation complexity
- Duplicate detection complexity
- Rollback complexity

**Risks:**
- Large file performance issues
- Duplicate detection false positives
- Rollback failures
- Data corruption during import
- Security vulnerabilities in file upload

## Implementation Guidelines

### Import Job Pattern

```typescript
class ImportJob {
  constructor(
    private id: string,
    private type: ImportType,
    private userId: string,
    private tenantId: string,
    private file: ImportFile
  ) {}

  async execute(): Promise<ImportResult> {
    const result = new ImportResult();
    
    await this.database.transaction(async (tx) => {
      const data = await this.parseFile(this.file);
      
      for (const row of data) {
        try {
          const validation = this.validateRow(row);
          if (!validation.isValid) {
            result.addError(row.rowNumber, validation.errors);
            continue;
          }

          const duplicate = await this.detectDuplicate(tx, row);
          if (duplicate) {
            const resolution = this.resolveDuplicate(duplicate, row);
            if (resolution === Resolution.Skip) {
              result.addSkipped(row.rowNumber);
              continue;
            }
          }

          await this.createAggregate(tx, row);
          result.addSuccess(row.rowNumber);
        } catch (error) {
          result.addError(row.rowNumber, [error.message]);
        }
      }
    });

    await this.logImportResult(result);
    return result;
  }
}
```

### Duplicate Detection Pattern

```typescript
class DuplicateDetector {
  async detectCustomer(customerData: CustomerData): Promise<Duplicate | null> {
    // Exact match on customer code
    const byCode = await this.customerRepository.findByCode(customerData.code);
    if (byCode) return { type: DuplicateType.Exact, record: byCode };

    // Exact match on email
    const byEmail = await this.customerRepository.findByEmail(customerData.email);
    if (byEmail) return { type: DuplicateType.Exact, record: byEmail };

    // Fuzzy match on name
    const byName = await this.customerRepository.findByNameSimilar(customerData.name, 0.8);
    if (byName) return { type: DuplicateType.Fuzzy, record: byName };

    return null;
  }
}
```

## Related Documentation

- [Import Center Business Context](../business/IMPORT_CENTER.md) - Detailed import requirements
- [Data Ownership](../technical/DATA_OWNERSHIP.md) - Aggregate ownership during import
- [Business Events](../technical/EVENTS.md) - Import-related events
- [Authorization](../security/AUTHORIZATION.md) - Import permissions
