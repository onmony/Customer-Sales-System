# Import Center

## Purpose

The Import Center provides the capability to onboard existing businesses by importing their master data from external systems. This is a critical business capability because most businesses transitioning to this ERP already have existing customers, products, and pricing data that must be migrated.

Related documents:

- [Vision](../VISION.md)
- [Domain](../DOMAIN.md)
- [Data Ownership](../technical/DATA_OWNERSHIP.md)
- [Dependencies](../technical/DEPENDENCIES.md)
- [Events](../technical/EVENTS.md)
- [Authorization](../security/AUTHORIZATION.md)

## Business Context

Onboarding a new business typically involves:

1. **Customer Import**: Migrating existing customer records from legacy systems
2. **Product Import**: Migrating product catalogs from existing systems
3. **Pricing Import**: Migrating customer-specific pricing from legacy systems
4. **Tally Import**: Importing data from Tally accounting software (future)

The Import Center must support these workflows with validation, preview, error reporting, and rollback capabilities to ensure data integrity during onboarding.

## Import Types

### Customer Import

**Purpose**: Import customer records from external systems.

**Supported Formats**:
- Excel (.xlsx, .xls)
- CSV (.csv)
- JSON (future)
- API integration (future)

**Required Fields**:
- Customer name
- Customer code (external reference)
- Contact email
- Contact phone
- Billing address
- Shipping address

**Optional Fields**:
- Customer type
- Industry
- Tax ID
- Credit limit
- Payment terms
- Preferred warehouse
- Preferred transport

**Validation Rules**:
- Customer name must be unique within tenant
- Customer code must be unique within tenant
- Email must be valid format
- Phone must be valid format
- At least one address must be provided
- Credit limit must be numeric and non-negative

**Duplicate Detection**:
- Match by customer name (exact match)
- Match by customer code (exact match)
- Match by email (exact match)
- Match by phone (exact match)
- Fuzzy match on name (similarity > 80%)

**Duplicate Resolution Options**:
- Skip duplicate records
- Update existing records
- Create as new record with suffix
- Manual review required

### Product Import

**Purpose**: Import product catalog from external systems.

**Supported Formats**:
- Excel (.xlsx, .xls)
- CSV (.csv)
- JSON (future)
- API integration (future)

**Required Fields**:
- Product name
- Product code (SKU)
- Unit of measure
- Base price

**Optional Fields**:
- Product category
- Product description
- Weight
- Dimensions
- Tax rate
- Active status

**Validation Rules**:
- Product name must be unique within tenant
- Product code must be unique within tenant
- Unit of measure must be valid
- Base price must be numeric and non-negative
- Tax rate must be numeric between 0 and 100

**Duplicate Detection**:
- Match by product code (exact match)
- Match by product name (exact match)
- Fuzzy match on name (similarity > 80%)

**Duplicate Resolution Options**:
- Skip duplicate records
- Update existing records
- Create as new record with suffix
- Manual review required

### Pricing Import

**Purpose**: Import customer-specific pricing from legacy systems.

**Supported Formats**:
- Excel (.xlsx, .xls)
- CSV (.csv)
- JSON (future)
- API integration (future)

**Required Fields**:
- Customer code or customer name
- Product code or product name
- Price

**Optional Fields**:
- Effective date
- Expiration date
- Minimum quantity
- Maximum quantity
- Discount percentage

**Validation Rules**:
- Customer must exist or be created in same import
- Product must exist or be created in same import
- Price must be numeric and non-negative
- Effective date must be valid date
- Expiration date must be after effective date (if provided)
- Minimum quantity must be non-negative
- Maximum quantity must be greater than minimum quantity (if both provided)

**Duplicate Detection**:
- Match by customer + product + effective date
- Match by customer + product (no effective date)

**Duplicate Resolution Options**:
- Skip duplicate records
- Update existing pricing version
- Create new pricing version
- Manual review required

### Tally Import (Future)

**Purpose**: Import data from Tally accounting software.

**Supported Data**:
- Customers
- Products
- Pricing
- Opening balances
- Tax configurations

**Integration Method**:
- Tally ODBC integration
- Tally XML export
- Tally API (if available)

**Validation**:
- Tally-specific validation rules
- Currency conversion (if needed)
- Tax mapping to system tax codes

## Import Workflow

### Step 1: Upload File

User selects import type and uploads file.

**UI Requirements**:
- File type selector
- Drag-and-drop upload zone
- File size limit (e.g., 10MB)
- File format validation
- Progress indicator

**Validation**:
- File format is supported
- File size is within limits
- File is not corrupted

### Step 2: Parse and Validate

System parses file and validates data.

**Validation Process**:
- Parse file structure
- Validate required fields
- Validate data types
- Validate business rules
- Detect duplicates
- Build error report

**Error Reporting**:
- Row-level errors
- Column-level errors
- File-level errors
- Error count and severity
- Suggested fixes

### Step 3: Preview

User previews data before import.

**Preview Display**:
- Show first 100 rows
- Highlight validation errors
- Show duplicate warnings
- Show statistics (total rows, valid rows, error rows)
- Allow filtering by error status

**Preview Actions**:
- Proceed with import
- Cancel import
- Fix errors and re-upload
- Exclude error rows

### Step 4: Confirm Import

User confirms import with options.

**Import Options**:
- Import all valid rows
- Import only valid rows (skip errors)
- Stop on first error
- Create backup before import
- Send notification on completion

**Confirmation Dialog**:
- Summary of what will be imported
- Warning about duplicates
- Warning about data overrides
- Estimated time to complete

### Step 5: Execute Import

System executes import transactionally.

**Import Process**:
- Begin transaction
- Create import job record
- Process rows in batches
- Apply duplicate resolution strategy
- Create aggregates
- Emit business events
- Commit transaction

**Progress Tracking**:
- Real-time progress updates
- Rows processed count
- Rows succeeded count
- Rows failed count
- Current batch number

### Step 6: Import Complete

System shows import results.

**Result Summary**:
- Total rows processed
- Rows successfully imported
- Rows skipped
- Rows failed
- Processing time

**Error Report**:
- Detailed error list
- Row numbers
- Error descriptions
- Suggested fixes
- Export error report as CSV

**Success Actions**:
- View imported records
- View import audit log
- Schedule another import
- Return to dashboard

## Rollback Capability

### Automatic Rollback

Rollback occurs automatically when:

- Critical error during import
- Transaction failure
- Database constraint violation
- User cancellation during import

**Rollback Scope**:
- All changes in current import job
- No partial data committed
- System returns to pre-import state

### Manual Rollback

User can manually rollback completed imports within a time window (e.g., 24 hours).

**Rollback Options**:
- Rollback entire import job
- Rollback specific records from import job
- Rollback to checkpoint (future)

**Rollback Process**:
- Identify import job
- Verify rollback eligibility
- Create rollback plan
- Execute rollback transaction
- Log rollback action
- Notify stakeholders

## Import Audit

### Audit Log

Every import job is logged with:

- Import job ID
- Import type
- User who initiated import
- File name and hash
- Start time
- End time
- Total rows processed
- Rows succeeded
- Rows failed
- Rollback status
- Error report reference

### Change Tracking

Imported records should track:

- Source system
- Source record ID
- Import job ID
- Import timestamp
- Imported by user

This enables traceability back to the original import source.

## Error Handling

### Error Types

**File Errors**:
- Invalid file format
- Corrupted file
- File too large
- Missing required columns

**Validation Errors**:
- Missing required fields
- Invalid data types
- Invalid business rules
- Constraint violations

**Duplicate Errors**:
- Duplicate records detected
- Conflicting duplicate resolution

**System Errors**:
- Database connection failure
- Transaction failure
- Memory limits exceeded

### Error Recovery

**File Errors**:
- Show clear error message
- Suggest file format correction
- Provide template download

**Validation Errors**:
- Show row-level errors
- Highlight problematic fields
- Suggest corrections
- Allow fix and re-upload

**Duplicate Errors**:
- Show duplicate records
- Show existing records
- Offer resolution options
- Allow manual review

**System Errors**:
- Log detailed error
- Show user-friendly message
- Offer retry option
- Escalate to support if needed

## Import Templates

### Template Provisioning

System should provide import templates for each import type:

- Customer import template (Excel/CSV)
- Product import template (Excel/CSV)
- Pricing import template (Excel/CSV)
- Tally import template (future)

**Template Features**:
- Pre-defined column headers
- Data validation rules
- Example data
- Instruction sheet
- Dropdown lists for valid values

### Template Download

Users can download templates from:

- Import Center page
- Help documentation
- Admin settings

## Performance Considerations

### Batch Processing

Large imports should be processed in batches:

- Batch size: 1000 rows per batch
- Parallel processing: Up to 5 concurrent batches
- Progress updates: Every 100 rows
- Memory management: Stream processing for large files

### Queue Management

Import jobs should be queued:

- Background job queue
- Priority queue (small jobs first)
- Concurrent processing limits
- Queue monitoring

### Caching

Cache frequently accessed data during import:

- Customer lookup cache
- Product lookup cache
- Validation rule cache
- Duplicate detection cache

## Security Considerations

### Authorization

Import capabilities require specific permissions:

- `import.customer` - Import customers
- `import.product` - Import products
- `import.pricing` - Import pricing
- `import.tally` - Import from Tally (future)
- `import.rollback` - Rollback imports
- `import.view_audit` - View import audit logs

### Data Privacy

- Import files should be encrypted at rest
- Import files should be deleted after processing
- Sensitive data should be masked in logs
- Import audit should track data access

### Tenant Isolation

- Imports must be tenant-scoped
- Cross-tenant imports must be explicitly prohibited
- Import jobs must be isolated per tenant

## Future Enhancements

### Scheduled Imports

- Schedule recurring imports
- Import from external URLs
- Import from SFTP servers
- Import from cloud storage

### API Integration

- REST API for programmatic imports
- Webhook notifications on import completion
- Integration with external systems

### Advanced Validation

- Custom validation rules
- Validation rule templates
- Machine learning for anomaly detection
- Data quality scoring

### Import Mapping

- Visual field mapping interface
- Save mapping templates
- Transform data during import
- Custom transformation scripts

## Cross References

- [Authorization](../security/AUTHORIZATION.md) - Import permissions
- [Business Events](../technical/EVENTS.md) - Import-related events
- [Data Ownership](../technical/DATA_OWNERSHIP.md) - Aggregate ownership during import
