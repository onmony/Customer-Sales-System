# ADR-014 Authorization Bootstrap

## Status

Accepted for architecture hardening.

## Context

The authorization system requires default roles and permissions to be available when the system starts. Two approaches exist:

1. **Hardcoded Roles**: Define roles and permissions in application code
2. **Configuration-Driven Roles**: Define roles in YAML, bootstrap into database

Hardcoded roles have drawbacks:
- Requires code deployment to change roles
- Cannot be customized per tenant
- Business users cannot manage roles
- Violates configuration-driven philosophy

Configuration-driven roles require:
- A bootstrap process to load YAML into database
- A strategy for when YAML is read vs. database
- A strategy for future tenant-specific overrides

## Decision

The authorization system will use a **configuration-driven bootstrap** approach where:

1. `config/roles.yaml` provides default roles only
2. On first startup, roles are bootstrapped into database
3. After bootstrap, database becomes the single source of truth
4. YAML file is never read again during normal operation
5. UI manages roles and permissions after bootstrap
6. Future tenant-specific overrides are supported

### Bootstrap Process

**Bootstrap Flow:**
```
Application Startup
    ↓
Check Bootstrap Status
    ↓
[Not Complete] → Read config/roles.yaml
    ↓
Validate YAML Structure
    ↓
Begin Transaction
    ↓
Create Roles
    ↓
Create Permissions
    ↓
Create Role-Permission Mappings
    ↓
Mark Bootstrap Complete
    ↓
Commit Transaction
    ↓
Database Becomes Source of Truth
```

**Bootstrap Check:**
```sql
SELECT bootstrap_complete FROM system_config WHERE id = 1
```

If `bootstrap_complete` is `TRUE`, skip bootstrap.

### YAML Structure

**config/roles.yaml:**
```yaml
roles:
  - name: Administrator
    description: Full system access with all permissions
    is_system: true
    is_enabled: true
    permissions:
      - "*"

  - name: Sales
    description: Sales team access for customer management
    is_system: true
    is_enabled: true
    permissions:
      - customer.view
      - customer.create
      - customer.edit
      - order.view
      - order.create
      - pricing.view
```

**Validation Rules:**
- All roles must have unique names
- All permissions must follow naming conventions
- System roles cannot be deleted (only modified)
- Wildcard permissions allowed (`*`, `customer.*`)

### Database Schema

**Roles Table:**
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

**Permissions Table:**
```sql
CREATE TABLE permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Role Permissions Table:**
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

**System Config Table:**
```sql
CREATE TABLE system_config (
  id INT PRIMARY KEY,
  bootstrap_complete BOOLEAN DEFAULT FALSE,
  bootstrap_completed_at TIMESTAMP,
  bootstrap_version VARCHAR(50)
);
```

### Source of Truth Strategy

**Pre-Bootstrap:**
- YAML file is the source of truth
- Database has no roles/permissions

**Post-Bootstrap:**
- Database is the single source of truth
- YAML file is never read again
- All role/permission changes happen through database
- A synchronization command can re-import from YAML if needed

**YAML Purpose:**
- Initial system setup
- Documentation of intended baseline
- Recovery to factory defaults (with warning)
- Test fixtures for authorization tests

### Role Management UI

**UI Capabilities:**
- Create custom roles
- Edit role permissions
- Assign users to roles
- Enable/disable roles
- Clone roles
- View audit history

**System Role Restrictions:**
- System roles cannot be deleted
- System roles cannot be renamed
- System roles can have permissions modified
- System roles can be enabled/disabled

### Future Tenant Overrides

**Version 3 Support:**
- Tenant-specific roles can inherit from global system roles
- Tenant-specific roles can add/remove permissions
- Tenant-specific roles are stored in database with `tenant_id`
- Global roles remain in database without `tenant_id`

**Resolution Logic:**
1. Check tenant-specific role overrides
2. Fall back to global system roles
3. Merge permissions with tenant taking precedence

## Consequences

**Positive:**
- No hardcoded role names in application code
- Business users can manage roles through UI
- Database is single source of truth
- Supports future tenant customization
- Clear separation between configuration and business logic
- YAML provides documented baseline

**Negative:**
- Additional complexity (bootstrap process)
- Need to maintain YAML and database in sync
- Risk of YAML and database diverging
- Additional database tables
- Need for role management UI

**Risks:**
- Bootstrap process failures
- YAML validation errors
- Database corruption during bootstrap
- Accidental re-bootstrap overwriting custom roles

## Implementation Guidelines

### Bootstrap Service

```typescript
class AuthorizationBootstrapService {
  constructor(
    private yamlLoader: YamlLoader,
    private database: Database,
    private logger: Logger
  ) {}

  async bootstrap(): Promise<void> {
    const isBootstrapped = await this.checkBootstrapStatus();
    if (isBootstrapped) {
      this.logger.info("Bootstrap already complete, skipping");
      return;
    }

    const yaml = await this.yamlLoader.load('config/roles.yaml');
    this.validateYaml(yaml);

    await this.database.transaction(async (tx) => {
      await this.createRoles(tx, yaml.roles);
      await this.createPermissions(tx, yaml.roles);
      await this.createRolePermissions(tx, yaml.roles);
      await this.markBootstrapComplete(tx);
    });

    this.logger.info("Bootstrap completed successfully");
  }

  private async checkBootstrapStatus(): Promise<boolean> {
    const result = await this.database.query(
      "SELECT bootstrap_complete FROM system_config WHERE id = 1"
    );
    return result.bootstrap_complete;
  }

  private validateYaml(yaml: any): void {
    // Validate YAML structure
    // Validate role names are unique
    // Validate permission naming conventions
  }
}
```

### Synchronization Command

```typescript
class AuthorizationSyncCommand {
  constructor(
    private yamlLoader: YamlLoader,
    private database: Database
  ) {}

  async sync(): Promise<void> {
    const yaml = await this.yamlLoader.load('config/roles.yaml');
    
    // Add new roles from YAML
    // Add new permissions from YAML
    // Update role descriptions
    // Do not remove existing roles/permissions
  }
}
```

## Related Documentation

- [Authorization](../security/AUTHORIZATION.md) - Authorization framework
- [Permissions](../security/PERMISSIONS.md) - Permission naming conventions
- [Role Management UI](../security/ROLE_MANAGEMENT_UI.md) - UI design
- [Bootstrap](../security/BOOTSTRAP.md) - Detailed bootstrap process
- [Future Evolution](../security/FUTURE_EVOLUTION.md) - Multi-tenant support
