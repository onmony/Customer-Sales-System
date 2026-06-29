# Bootstrap Process

## Overview

The bootstrap process initializes the authorization system with default roles and permissions from the YAML configuration file. This process runs only once on first application startup, after which the database becomes the single source of truth.

## Bootstrap Flow

```
Application Startup
        ↓
Check Bootstrap Status
        ↓
   ┌────────┴────────┐
   │                 │
 [Complete]     [Not Complete]
   │                 │
   │            Read config/roles.yaml
   │                 ↓
   │            Validate YAML Structure
   │                 ↓
   │            Begin Transaction
   │                 ↓
   │            Create Roles
   │                 ↓
   │            Create Permissions
   │                 ↓
   │            Create Role-Permission Mappings
   │                 ↓
   │            Mark Bootstrap Complete
   │                 ↓
   │            Commit Transaction
   │                 ↓
   └─────────→   Normal Operation
```

## Detailed Steps

### 1. Application Startup

When the application starts, the bootstrap service checks if the authorization system has been initialized.

**Implementation:**
```python
def check_bootstrap_status():
    return database.query("SELECT bootstrap_complete FROM system_config WHERE id = 1")
```

### 2. Check Bootstrap Status

Query the database to determine if bootstrap has already been completed.

**Database Table:**
```sql
CREATE TABLE system_config (
    id INT PRIMARY KEY,
    bootstrap_complete BOOLEAN DEFAULT FALSE,
    bootstrap_completed_at TIMESTAMP,
    bootstrap_version VARCHAR(50)
);
```

**Decision Logic:**
- If `bootstrap_complete` is `TRUE`: Skip bootstrap, proceed to normal operation
- If `bootstrap_complete` is `FALSE` or row doesn't exist: Proceed with bootstrap

### 3. Read config/roles.yaml

Load the YAML configuration file containing default roles and permissions.

**File Location:**
```
config/roles.yaml
```

**Validation:**
- File exists
- File is valid YAML
- File contains required structure
- All role names are unique
- All permission names follow naming conventions

**Error Handling:**
- If file is missing: Log error, abort bootstrap
- If file is invalid: Log error, abort bootstrap
- If validation fails: Log specific errors, abort bootstrap

### 4. Validate YAML Structure

Ensure the YAML file conforms to the expected schema.

**Required Structure:**
```yaml
roles:
  - name: string
    description: string
    is_system: boolean
    is_enabled: boolean
    permissions:
      - string
```

**Validation Rules:**
- `roles` array must be present
- Each role must have `name`, `description`, `is_system`, `is_enabled`
- `permissions` array must be present for each role
- Permission names must follow `domain.entity.action` format
- No duplicate role names
- No duplicate permission names within a role

### 5. Begin Transaction

Start a database transaction to ensure atomic bootstrap operation.

**Implementation:**
```python
transaction = database.begin_transaction()
```

**Rationale:**
- Ensures all-or-nothing operation
- Allows rollback on errors
- Maintains data consistency

### 6. Create Roles

Insert each role from the YAML into the database.

**Implementation:**
```python
for role in yaml_roles:
    database.execute(
        "INSERT INTO roles (name, description, is_system, is_enabled, created_at, created_by) VALUES (?, ?, ?, ?, ?, ?)",
        [role.name, role.description, role.is_system, role.is_enabled, now(), 'system']
    )
    role_id = database.last_insert_id()
    role_map[role.name] = role_id
```

**Database Table:**
```sql
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT FALSE,
    is_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);
```

**Error Handling:**
- If role name already exists: Log error, rollback transaction
- If insertion fails: Log error, rollback transaction

### 7. Create Permissions

Insert each unique permission from all roles into the database.

**Implementation:**
```python
permissions = set()
for role in yaml_roles:
    for permission in role.permissions:
        permissions.add(permission)

for permission in permissions:
    database.execute(
        "INSERT INTO permissions (name, description, created_at) VALUES (?, ?, ?)",
        [permission, generate_description(permission), now()]
    )
    permission_id = database.last_insert_id()
    permission_map[permission] = permission_id
```

**Database Table:**
```sql
CREATE TABLE permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Description Generation:**
- `customer.view` → "View customer details"
- `order.create` → "Create new order"
- `pricing.edit` → "Modify pricing information"

**Error Handling:**
- If permission name already exists: Log error, rollback transaction
- If insertion fails: Log error, rollback transaction

### 8. Create Role-Permission Mappings

Link each role to its permissions in the junction table.

**Implementation:**
```python
for role in yaml_roles:
    role_id = role_map[role.name]
    for permission in role.permissions:
        permission_id = permission_map[permission]
        database.execute(
            "INSERT INTO role_permissions (role_id, permission_id, created_at, created_by) VALUES (?, ?, ?, ?)",
            [role_id, permission_id, now(), 'system']
        )
```

**Database Table:**
```sql
CREATE TABLE role_permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_id INT NOT NULL,
    permission_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id),
    UNIQUE KEY (role_id, permission_id)
);
```

**Error Handling:**
- If mapping already exists: Log warning, continue
- If insertion fails: Log error, rollback transaction

### 9. Mark Bootstrap Complete

Update the system configuration to indicate bootstrap is complete.

**Implementation:**
```python
database.execute(
    "UPDATE system_config SET bootstrap_complete = TRUE, bootstrap_completed_at = ?, bootstrap_version = ? WHERE id = 1",
    [now(), '1.0.0']
)
```

**Version Tracking:**
- Store the bootstrap version for future reference
- Allows for schema migrations and updates

### 10. Commit Transaction

Commit all changes to make them permanent.

**Implementation:**
```python
transaction.commit()
```

**Error Handling:**
- If commit fails: Log error, attempt rollback
- If rollback fails: Log critical error, alert administrators

### 11. Normal Operation

Proceed with normal application startup.

**Post-Bootstrap:**
- Database is now the source of truth
- YAML file is no longer read
- All role/permission changes happen through database

## Error Handling

### Bootstrap Failures

If bootstrap fails at any point:

1. **Rollback Transaction**: Undo all database changes
2. **Log Error**: Record detailed error information
3. **Alert Administrators**: Notify system administrators
4. **Prevent Startup**: Stop application from starting
5. **Provide Guidance**: Log instructions for fixing the issue

### Common Failure Scenarios

**YAML File Missing:**
```
ERROR: Bootstrap failed - config/roles.yaml not found
ACTION: Ensure config/roles.yaml exists in the application directory
```

**Invalid YAML:**
```
ERROR: Bootstrap failed - Invalid YAML structure
ACTION: Validate YAML syntax and structure
DETAIL: Line 15: Expected mapping but found sequence
```

**Duplicate Role Names:**
```
ERROR: Bootstrap failed - Duplicate role name: Sales
ACTION: Ensure all role names in YAML are unique
```

**Invalid Permission Format:**
```
ERROR: Bootstrap failed - Invalid permission format: customer-view
ACTION: Use dot-separated format: domain.entity.action
```

**Database Connection Error:**
```
ERROR: Bootstrap failed - Cannot connect to database
ACTION: Check database connection settings
```

## Manual Bootstrap

### Re-running Bootstrap

If bootstrap needs to be re-run (e.g., after schema changes):

**Warning:** This will reset all roles and permissions to YAML defaults.

**Command:**
```bash
# CLI command to re-run bootstrap
app bootstrap --force
```

**Safety Measures:**
- Requires `--force` flag to prevent accidental execution
- Prompts for confirmation before proceeding
- Creates backup of current database state
- Logs all changes for audit trail

### Bootstrap Synchronization

To synchronize YAML changes with database without full reset:

**Command:**
```bash
# CLI command to sync YAML changes
app bootstrap --sync
```

**Behavior:**
- Adds new roles from YAML
- Adds new permissions from YAML
- Updates role descriptions
- Does not remove existing roles/permissions
- Does not modify role-permission mappings

## Bootstrap Verification

### Verification Steps

After bootstrap completes, verify:

1. **Role Count**: Expected number of roles created
2. **Permission Count**: Expected number of permissions created
3. **Mapping Count**: Expected number of role-permission mappings
4. **System Roles**: All system roles marked correctly
5. **Enabled Status**: All roles enabled as expected

### Verification Query

```sql
-- Check bootstrap status
SELECT bootstrap_complete, bootstrap_completed_at, bootstrap_version 
FROM system_config 
WHERE id = 1;

-- Count roles
SELECT COUNT(*) FROM roles;

-- Count permissions
SELECT COUNT(*) FROM permissions;

-- Count mappings
SELECT COUNT(*) FROM role_permissions;

-- Verify system roles
SELECT name, is_system, is_enabled FROM roles WHERE is_system = TRUE;
```

## Bootstrap Configuration

### Configuration Options

Environment variables to control bootstrap behavior:

```bash
# Bootstrap mode
BOOTSTRAP_MODE=auto  # auto, manual, disabled

# YAML file location
BOOTSTRAP_CONFIG_PATH=config/roles.yaml

# Force re-bootstrap
BOOTSTRAP_FORCE=false

# Create backup before bootstrap
BOOTSTRAP_BACKUP=true
```

### Bootstrap Modes

**auto**: Automatically run bootstrap on first startup (default)
**manual**: Require explicit command to run bootstrap
**disabled**: Skip bootstrap entirely (for existing installations)

## Cross References

- [AUTHORIZATION.md](./AUTHORIZATION.md) - Authorization framework overview
- [config/roles.yaml](../../config/roles.yaml) - Bootstrap configuration file
- [FUTURE_EVOLUTION.md](./FUTURE_EVOLUTION.md) - Evolution roadmap
