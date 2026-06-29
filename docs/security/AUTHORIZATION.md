# Authorization Framework

## Philosophy

The authorization framework is designed around the principle of **configuration-driven security**. This approach ensures that:

- **No hardcoded permissions**: Business logic never contains hardcoded role names or permission strings
- **Database as source of truth**: After bootstrap, all authorization data lives in the database
- **YAML for bootstrap only**: The YAML configuration file is used exclusively for initial system setup
- **Future-proof**: The architecture supports tenant-specific customization without code changes
- **Business-friendly**: Role management is accessible through a UI, not just code

### Core Principles

1. **Separation of Concerns**: Authorization logic is separate from business logic
2. **Explicit over Implicit**: All permissions must be explicitly granted
3. **Least Privilege**: Roles should only contain necessary permissions
4. **Flexibility**: Wildcard permissions allow for granular or broad access control
5. **Auditability**: All role and permission changes are tracked

## Architecture

### Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Application Layer                        │
├─────────────────────────────────────────────────────────────┤
│  Frontend              │  Backend API                       │
│  - Page Visibility     │  - Endpoint Authorization          │
│  - Feature Toggles     │  - Business Logic Guards           │
├─────────────────────────────────────────────────────────────┤
│                  Authorization Service                       │
│  - Permission Resolution                                    │
│  - Role Resolution                                         │
│  - Wildcard Expansion                                       │
├─────────────────────────────────────────────────────────────┤
│                  Database (Source of Truth)                  │
│  - roles table                                               │
│  - permissions table                                         │
│  - role_permissions table                                   │
│  - user_roles table                                          │
├─────────────────────────────────────────────────────────────┤
│                  Bootstrap Configuration                     │
│  config/roles.yaml (used only during bootstrap)             │
└─────────────────────────────────────────────────────────────┘
```

### Data Model

#### Roles Table
- `id`: Primary key
- `name`: Unique role identifier (e.g., "Administrator")
- `description`: Human-readable description
- `is_system`: Boolean flag for system roles
- `is_enabled`: Boolean flag for active/inactive status
- `created_at`: Timestamp
- `updated_at`: Timestamp
- `created_by`: User who created the role
- `updated_by`: User who last modified the role

#### Permissions Table
- `id`: Primary key
- `name`: Permission identifier (e.g., "customer.view")
- `description`: Human-readable description
- `created_at`: Timestamp
- `updated_at`: Timestamp

#### Role Permissions Table
- `role_id`: Foreign key to roles
- `permission_id`: Foreign key to permissions
- `created_at`: Timestamp
- `created_by`: User who assigned the permission

#### User Roles Table
- `user_id`: Foreign key to users
- `role_id`: Foreign key to roles
- `assigned_at`: Timestamp
- `assigned_by`: User who assigned the role

## Bootstrap Flow

### Initial Startup

The bootstrap process occurs only once when the application first starts:

```
Application Startup
        ↓
Check if bootstrap complete
        ↓
   [No] ────→ Read config/roles.yaml
        ↓
   Parse YAML structure
        ↓
   Create roles from YAML
        ↓
   Create permissions from YAML
        ↓
   Create role-permission mappings
        ↓
   Mark bootstrap complete
        ↓
   Database becomes source of truth
        ↓
   [Yes] ────→ Skip bootstrap
        ↓
   Normal operation
```

### Bootstrap Details

1. **Bootstrap Check**: Query database for bootstrap completion flag
2. **YAML Parsing**: Read and validate `config/roles.yaml` structure
3. **Role Creation**: Insert roles defined in YAML
4. **Permission Creation**: Insert permissions defined in YAML
5. **Mapping Creation**: Link roles to their permissions
6. **Completion Flag**: Set bootstrap complete flag in database

### Post-Bootstrap

After bootstrap completes:
- The YAML file is never read again during normal operation
- All role and permission modifications happen through the database
- A synchronization command can be run to re-import from YAML if needed
- The database is the single source of truth for authorization data

## Permission Resolution

### Resolution Algorithm

```
User Request
    ↓
Get User Roles
    ↓
For Each Role:
    ↓
    Get Role Permissions
    ↓
    Expand Wildcards (e.g., customer.* → customer.view, customer.create, etc.)
    ↓
    Collect All Permissions
    ↓
Merge All Permissions
    ↓
Check if Required Permission Exists
    ↓
Return: ALLOW or DENY
```

### Wildcard Expansion

Wildcard permissions are expanded at resolution time:

- `customer.*` expands to all permissions starting with `customer.`
- `*` expands to all permissions (use sparingly, typically for Administrator only)
- Wildcards are stored as-is in the database
- Expansion happens in-memory during permission checks

### Caching Strategy

- User permissions are cached per session
- Cache is invalidated when:
  - User roles are modified
  - Role permissions are modified
  - Permissions are created/deleted
  - Roles are enabled/disabled

## Future Tenant Overrides

### Multi-Tenant Architecture

The framework is designed to support tenant-specific customization:

```
┌─────────────────────────────────────────────────────────────┐
│                  Global System Roles                         │
│  (Bootstrap from YAML, shared across all tenants)           │
├─────────────────────────────────────────────────────────────┤
│                  Tenant Overrides                            │
│  - Custom tenant roles                                       │
│  - Modified role permissions                                 │
│  - Additional permissions                                    │
├─────────────────────────────────────────────────────────────┤
│                  Resolution Logic                            │
│  1. Check tenant-specific overrides                          │
│  2. Fall back to global system roles                         │
│  3. Merge permissions with tenant taking precedence          │
└─────────────────────────────────────────────────────────────┘
```

### Override Strategy

1. **Inheritance**: Tenant roles inherit from global system roles
2. **Additive**: Tenants can add permissions to existing roles
3. **Restrictive**: Tenants can remove permissions from inherited roles
4. **Custom**: Tenants can create entirely new roles

## Why YAML is Bootstrap Only

### Single Source of Truth

Having both YAML and database as sources of truth creates:
- **Confusion**: Which one is authoritative?
- **Synchronization issues**: Changes in one not reflected in the other
- **Deployment complexity**: Need to sync YAML across environments
- **Merge conflicts**: Multiple environments diverge over time

### Database Advantages

- **Dynamic**: Changes can be made through UI without code deployment
- **Auditable**: All changes are tracked with user and timestamp
- **Transactional**: Changes are atomic and can be rolled back
- **Queryable**: Easy to query for reports and analytics
- **Scalable**: Supports complex relationships and constraints

### YAML Purpose

The YAML file serves a single purpose:
- **Initial setup**: Provides default roles and permissions
- **Documentation**: Shows the intended baseline configuration
- **Recovery**: Can be used to restore system to known state
- **Testing**: Provides test fixtures for authorization tests

### When to Use YAML

- **Initial deployment**: Bootstrap the system with default roles
- **System reset**: Restore to factory defaults (with warning)
- **Testing**: Load test configurations
- **Documentation**: Reference for intended baseline

### When NOT to Use YAML

- **Runtime authorization**: Never read YAML during permission checks
- **Role modifications**: Never edit YAML to change roles
- **Permission changes**: Never edit YAML to modify permissions
- **Production updates**: Use the UI or API instead

## Cross References

- [PERMISSIONS.md](./PERMISSIONS.md) - Permission naming conventions
- [ROLE_MANAGEMENT_UI.md](./ROLE_MANAGEMENT_UI.md) - UI design specifications
- [BOOTSTRAP.md](./BOOTSTRAP.md) - Detailed bootstrap flow
- [FUTURE_EVOLUTION.md](./FUTURE_EVOLUTION.md) - Evolution roadmap
- [DECISION_TABLES.md](./DECISION_TABLES.md) - Resolution logic
- [security.feature](./security.feature) - Gherkin test scenarios
