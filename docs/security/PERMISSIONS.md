# Permission Naming Conventions

## Philosophy

Permission names follow a hierarchical, dot-separated naming convention that reflects the domain structure and action granularity. This approach provides:

- **Readability**: Permission names are self-documenting
- **Organization**: Related permissions are grouped by domain
- **Flexibility**: Wildcard support allows for broad or granular control
- **Consistency**: Uniform naming across the application
- **Scalability**: Easy to add new permissions as the system grows

## Naming Convention

### Format

```
<domain>.<entity>.<action>
```

### Components

- **domain**: Top-level business domain (e.g., customer, order, pricing)
- **entity**: Specific entity within the domain (optional for simple domains)
- **action**: Specific operation being performed

### Actions

Standard actions across all domains:

- `view` - Read-only access to view data
- `create` - Create new records
- `edit` - Modify existing records
- `delete` - Remove records
- `list` - View lists/summaries (distinct from detailed view)
- `export` - Export data to external formats
- `import` - Import data from external sources
- `approve` - Approve records or workflows
- `reject` - Reject records or workflows
- `history` - View audit history or change logs

## Domain Examples

### Customer Domain

```
customer.view          # View customer details
customer.create        # Create new customer
customer.edit          # Edit customer information
customer.delete        # Delete customer
customer.list          # View customer list
customer.export        # Export customer data
customer.import        # Import customer data
customer.history       # View customer change history
```

### Order Domain

```
order.view             # View order details
order.create           # Create new order
order.edit             # Modify order
order.delete           # Delete order
order.list             # View order list
order.cancel           # Cancel order
order.approve          # Approve order
order.reject           # Reject order
order.history          # View order history
```

### Pricing Domain

```
pricing.view           # View pricing information
pricing.edit           # Modify pricing
pricing.history        # View pricing change history
pricing.approve        # Approve pricing changes
pricing.export         # Export pricing data
```

### Invoice Domain

```
invoice.view           # View invoice details
invoice.issue          # Issue/create invoice
invoice.edit           # Modify invoice
invoice.delete         # Delete invoice
invoice.list           # View invoice list
invoice.approve        # Approve invoice
invoice.reject         # Reject invoice
invoice.history        # View invoice history
```

### Warehouse Domain

```
warehouse.view         # View warehouse information
warehouse.dispatch     # Dispatch items from warehouse
warehouse.receive      # Receive items into warehouse
warehouse.inventory    # View inventory levels
warehouse.adjust       # Adjust inventory counts
warehouse.history      # View warehouse history
```

### Shipment Domain

```
shipment.view          # View shipment details
shipment.create        # Create shipment
shipment.edit          # Modify shipment
shipment.complete      # Mark shipment as complete
shipment.cancel        # Cancel shipment
shipment.track         # Track shipment status
shipment.history       # View shipment history
```

### Reporting Domain

```
report.view            # View reports
report.create          # Create custom reports
report.edit            # Modify reports
report.delete          # Delete reports
report.export          # Export reports
report.schedule        # Schedule report generation
```

### User Management Domain

```
user.view              # View user information
user.create            # Create new user
user.edit              # Edit user information
user.delete            # Delete user
user.list              # View user list
user.assign_roles      # Assign roles to users
user.history           # View user change history
```

### Role Management Domain

```
role.view              # View role details
role.create            # Create new role
role.edit              # Edit role permissions
role.delete            # Delete role
role.list              # View role list
role.clone             # Clone existing role
role.enable            # Enable role
role.disable           # Disable role
role.assign_users      # Assign users to role
role.history           # View role change history
```

### System Domain

```
system.view            # View system information
system.configure       # Configure system settings
system.backup          # Perform system backup
system.restore         # Restore from backup
system.logs            # View system logs
system.audit           # View audit logs
```

## Wildcard Permissions

### Single-Level Wildcard

Grant all actions within a domain:

```
customer.*             # All customer permissions
order.*                # All order permissions
pricing.*              # All pricing permissions
```

### Global Wildcard

Grant all permissions (use sparingly):

```
*                      # All permissions in the system
```

### Wildcard Resolution

Wildcards are resolved at runtime:

```
Role has: customer.*
Expands to:
  - customer.view
  - customer.create
  - customer.edit
  - customer.delete
  - customer.list
  - customer.export
  - customer.import
  - customer.history
```

### Wildcard Best Practices

- **Use specific permissions when possible**: `customer.view` is better than `customer.*` when only view access is needed
- **Use wildcards for broad roles**: Administrator roles benefit from wildcard permissions
- **Avoid global wildcards**: Only use `*` for system administrator roles
- **Document wildcard usage**: Clearly document why a wildcard is used in role descriptions

## Permission Granularity

### Fine-Grained Permissions

For complex operations, use more granular permissions:

```
order.edit.basic       # Edit basic order information
order.edit.pricing     # Edit order pricing
order.edit.shipping    # Edit shipping information
order.edit.items       # Edit order items
```

### Coarse-Grained Permissions

For simple operations, use broader permissions:

```
order.edit             # Edit any aspect of an order
```

### Choosing Granularity

Consider:
- **Business complexity**: More complex domains need finer granularity
- **Security requirements**: Higher security needs require more specific permissions
- **User experience**: Too many permissions can be confusing to manage
- **Performance**: More permissions mean more checks (though caching mitigates this)

## Permission Groups

### Logical Grouping

Related permissions can be grouped conceptually:

```
# Customer Management Group
customer.view
customer.create
customer.edit
customer.delete
customer.list

# Customer Data Operations Group
customer.export
customer.import
customer.history
```

### Role Assignment

Roles are assigned groups of permissions:

```
Sales Role:
  - customer.view
  - customer.create
  - customer.edit
  - order.view
  - order.create
  - order.edit
```

## Future Extensions

### Field-Level Permissions

Future versions may support field-level permissions:

```
customer.edit.name         # Edit customer name
customer.edit.email        # Edit customer email
customer.edit.phone        # Edit customer phone
customer.edit.address      # Edit customer address
```

### Conditional Permissions

Future versions may support conditional permissions:

```
order.edit.own             # Edit own orders
order.edit.team            # Edit team orders
order.edit.all             # Edit all orders
```

### Approval Workflow Permissions

Future versions may support workflow-specific permissions:

```
order.approve.level1       # Approve at level 1
order.approve.level2       # Approve at level 2
order.approve.level3       # Approve at level 3
```

## Cross References

- [AUTHORIZATION.md](./AUTHORIZATION.md) - Authorization framework overview
- [config/roles.yaml](../../config/roles.yaml) - Default role definitions
- [ROLE_MANAGEMENT_UI.md](./ROLE_MANAGEMENT_UI.md) - UI for managing permissions
- [DECISION_TABLES.md](./DECISION_TABLES.md) - Permission resolution logic
