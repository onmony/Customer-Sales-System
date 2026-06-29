# Role Management UI

## Overview

The Role Management UI provides a business-friendly interface for managing roles and permissions without requiring code changes. The UI is designed to be intuitive for non-technical users while providing powerful capabilities for security administrators.

## Design Principles

- **Business-friendly**: Use clear language, avoid technical jargon
- **Visual clarity**: Use icons, colors, and layout to convey information
- **Efficient workflows**: Minimize clicks for common operations
- **Safety first**: Require confirmation for destructive actions
- **Audit trail**: Show who made changes and when
- **Responsive**: Work on desktop and tablet devices

## Navigation Structure

```
Settings
└── Security
    └── Roles
        ├── Role List
        ├── Permission Matrix
        └── Audit History
```

## Role List Page

### Purpose

Display all roles in the system with key information and quick actions.

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Roles                                      [+ New Role] [Search] │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Administrator                    [System] [Enabled]  [Edit] │ │
│ │ Full system access with all permissions                      │ │
│ │ 15 members • Last modified 2 days ago by admin              │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Sales                           [System] [Enabled]  [Edit] │ │
│ │ Sales team access for customer and order management         │ │
│ │ 42 members • Last modified 1 week ago by manager            │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Warehouse                       [System] [Enabled]  [Edit] │ │
│ │ Warehouse operations for inventory and shipping             │ │
│ │ 8 members • Last modified 3 days ago by admin                │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Features

- **Search**: Filter roles by name or description
- **Filter by status**: Show enabled/disabled roles
- **Filter by type**: Show system/custom roles
- **Sort options**: By name, member count, last modified
- **Quick actions**: Edit, clone, enable/disable from list
- **Member count**: Shows number of users assigned to role
- **Status indicators**: Visual badges for system roles and enabled status

### Columns

- **Role Name**: Clickable to view role details
- **Type**: System or Custom badge
- **Status**: Enabled or Disabled badge
- **Members**: Count of assigned users
- **Last Modified**: Date and user who last modified
- **Actions**: Edit, Clone, Enable/Disable, Delete (for custom roles)

## Role Details Page

### Purpose

View and edit a single role's details and permissions.

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to Roles    Sales Role                    [Save] [Cancel]│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Role Information                                                │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ Name:                    Sales                               ││
│ │ Description:             Sales team access for customer...   ││
│ │ Type:                    System Role                         ││
│ │ Status:                  ✓ Enabled                           ││
│ │ Created:                 Jan 15, 2026 by admin               ││
│ │ Last Modified:           Feb 20, 2026 by manager             ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ Permissions (12)                                    [+ Add]     │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ ✓ customer.view          [Remove]                           ││
│ │ ✓ customer.create        [Remove]                           ││
│ │ ✓ customer.edit          [Remove]                           ││
│ │ ✓ customer.list          [Remove]                           ││
│ │ ✓ customer.history       [Remove]                           ││
│ │ ✓ order.view             [Remove]                           ││
│ │ ✓ order.create           [Remove]                           ││
│ │ ✓ order.edit             [Remove]                           ││
│ │ ✓ order.list             [Remove]                           ││
│ │ ✓ order.history          [Remove]                           ││
│ │ ✓ pricing.view           [Remove]                           ││
│ │ ✓ pricing.history        [Remove]                           ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ Members (42)                                       [View All]   │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ John Smith          john@example.com         [Remove]       ││
│ │ Jane Doe            jane@example.com         [Remove]       ││
│ │ Bob Johnson         bob@example.com          [Remove]       │
│ │ ... 39 more                                                  ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ Audit History                                                    │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ Feb 20, 2026 - manager added permission: pricing.history     ││
│ │ Feb 15, 2026 - admin removed permission: customer.delete    ││
│ │ Jan 15, 2026 - admin created role                           ││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### Features

- **Edit role name and description**: For custom roles only
- **Enable/disable role**: Toggle role status
- **Add permissions**: Search and select from available permissions
- **Remove permissions**: Individual or bulk removal
- **View members**: List of users assigned to role
- **Assign users**: Search and add users to role
- **Remove users**: Remove users from role
- **Audit history**: Track all changes to role

### Validation

- **System roles**: Cannot be deleted or renamed
- **Last administrator**: Prevent disabling the last role with admin permissions
- **Permission conflicts**: Warn when removing critical permissions
- **Member count**: Show warning when disabling role with active members

## Permission Matrix Page

### Purpose

Visual grid showing all roles and their permissions in a matrix format.

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Permission Matrix                                    [Export]   │
├─────────────────────────────────────────────────────────────────┤
│                     Administrator  Sales  Warehouse  Finance    │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ customer.view         ✓       ✓       -         ✓          ││
│ │ customer.create       ✓       ✓       -         -          ││
│ │ customer.edit         ✓       ✓       -         -          ││
│ │ customer.delete       ✓       -       -         -          ││
│ │ order.view            ✓       ✓       ✓         ✓          ││
│ │ order.create          ✓       ✓       -         -          ││
│ │ order.edit            ✓       ✓       -         -          ││
│ │ pricing.view          ✓       ✓       -         ✓          ││
│ │ pricing.edit          ✓       -       -         ✓          ││
│ │ warehouse.dispatch    ✓       -       ✓         -          ││
│ │ shipment.complete     ✓       -       ✓         -          ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ Legend: ✓ Granted  - Not Granted  * Wildcard                    │
└─────────────────────────────────────────────────────────────────┘
```

### Features

- **Filter by domain**: Show permissions for specific domain only
- **Filter by role**: Show specific role's permissions
- **Search permissions**: Find specific permissions quickly
- **Export to CSV**: Download matrix for offline review
- **Click to edit**: Click cell to toggle permission
- **Wildcard indicators**: Show which permissions are granted via wildcard

### Interactions

- **Click cell**: Toggle permission on/off
- **Click column header**: Filter by role
- **Click row header**: Filter by permission
- **Right-click**: Context menu for bulk actions

## Permission Search Page

### Purpose

Search and browse available permissions by domain, action, or keyword.

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Permission Search                                    [Search]    │
├─────────────────────────────────────────────────────────────────┤
│ Search: [customer view                    ]                    │
│ Filter: [Domain ▼] [Action ▼] [All Permissions ▼]               │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ customer.view                                                ││
│ │ View customer details                                       ││
│ │ Domain: customer • Action: view                             ││
│ │ Used in: Sales, Finance, Manager (3 roles)                  ││
│ └─────────────────────────────────────────────────────────────┘│
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ customer.list                                                ││
│ │ View customer list                                          ││
│ │ Domain: customer • Action: list                             ││
│ │ Used in: Sales, Warehouse, Manager (3 roles)                 ││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### Features

- **Full-text search**: Search by permission name or description
- **Domain filter**: Filter by business domain
- **Action filter**: Filter by action type (view, create, edit, etc.)
- **Usage statistics**: Show how many roles use each permission
- **View roles**: See which roles have the permission
- **Wildcard detection**: Identify permissions covered by wildcards

## Clone Role Dialog

### Purpose

Create a new role based on an existing role's permissions.

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Clone Role                                                   [X]│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Source Role: Sales                                              │
│                                                                 │
│ New Role Name: [Sales Copy___________________]                 │
│                                                                 │
│ Description: [Copy of Sales role_______________]                │
│                                                                 │
│ Copy Permissions:                                               │
│ ☑ Include all permissions from source role                     │
│ ☑ Include wildcard permissions                                 │
│                                                                 │
│ [Cancel]                                              [Clone]   │
└─────────────────────────────────────────────────────────────────┘
```

### Features

- **Name validation**: Ensure unique role name
- **Permission selection**: Choose which permissions to copy
- **Wildcard handling**: Option to include or exclude wildcards
- **Preview**: Show what will be cloned before confirming

## Duplicate Role Dialog

### Purpose

Quick duplicate of a role with identical permissions.

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Duplicate Role                                                [X]│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Duplicating: Sales                                              │
│                                                                 │
│ New Role Name: [Sales Copy___________________]                 │
│                                                                 │
│ This will create a new role with all permissions from Sales.   │
│ The new role will not have any members assigned.                │
│                                                                 │
│ [Cancel]                                          [Duplicate]   │
└─────────────────────────────────────────────────────────────────┘
```

### Features

- **Auto-generated name**: Suggest name with "Copy" suffix
- **Member handling**: Clarify that members are not copied
- **System role warning**: Warn when duplicating system roles

## Enable/Disable Role Dialog

### Purpose

Enable or disable a role with safety checks.

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Disable Role                                                  [X]│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Are you sure you want to disable the Sales role?               │
│                                                                 │
│ ⚠ This role has 42 active members.                             │
│ ⚠ Disabling this role will remove all permissions from these   │
│   users immediately.                                            │
│                                                                 │
│ Affected users:                                                 │
│ • John Smith (john@example.com)                                │
│ • Jane Doe (jane@example.com)                                  │
│ • Bob Johnson (bob@example.com)                                │
│ ... and 39 more                                                 │
│                                                                 │
│ Type "DISABLE" to confirm: [DISABLE____________]               │
│                                                                 │
│ [Cancel]                                            [Disable]   │
└─────────────────────────────────────────────────────────────────┘
```

### Features

- **Member count warning**: Show how many users will be affected
- **Affected users list**: Show sample of affected users
- **Confirmation requirement**: Type confirmation to prevent accidents
- **Impact assessment**: Explain what will happen

## Assign Users Dialog

### Purpose

Assign users to a role.

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Assign Users to Sales Role                                    [X]│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ Search users: [john___________________]                        │
│                                                                 │
│ Available Users (156)                                           │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ ☐ John Smith          john@example.com                      ││
│ │ ☐ Jane Doe            jane@example.com                      ││
│ │ ☐ Bob Johnson         bob@example.com                       ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ Selected Users (3)                                              │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ ✓ John Smith          john@example.com         [Remove]     ││
│ │ ✓ Jane Doe            jane@example.com         [Remove]     ││
│ │ ✓ Bob Johnson         bob@example.com          [Remove]     ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ [Cancel]                                               [Assign] │
└─────────────────────────────────────────────────────────────────┘
```

### Features

- **User search**: Search by name or email
- **Filter by role**: Exclude users already in role
- **Bulk selection**: Select multiple users at once
- **Preview**: Show selected users before assigning

## View Members Page

### Purpose

View all users assigned to a role with management actions.

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to Sales Role    Members (42)              [+ Assign]   │
├─────────────────────────────────────────────────────────────────┤
│ Search: [john___________________]  Filter: [Active ▼]          │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ John Smith          john@example.com    Active  [Remove]    ││
│ │ Assigned: Jan 15, 2026 by admin                              ││
│ └─────────────────────────────────────────────────────────────┘│
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ Jane Doe            jane@example.com    Active  [Remove]    ││
│ │ Assigned: Feb 1, 2026 by manager                             ││
│ └─────────────────────────────────────────────────────────────┘│
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ Bob Johnson         bob@example.com    Inactive [Remove]   ││
│ │ Assigned: Feb 10, 2026 by admin                              ││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### Features

- **Search members**: Filter by name or email
- **Filter by status**: Show active/inactive users
- **Remove members**: Remove users from role
- **View assignment history**: See when user was assigned
- **Bulk actions**: Remove multiple users at once

## Audit History Page

### Purpose

View all changes made to roles and permissions.

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Audit History                                    [Export]       │
├─────────────────────────────────────────────────────────────────┤
│ Filter: [Role ▼] [User ▼] [Action ▼] [Date Range ▼]           │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ Feb 20, 2026 2:34 PM                                         ││
│ │ manager added permission pricing.history to Sales role       ││
│ └─────────────────────────────────────────────────────────────┘│
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ Feb 15, 2026 10:15 AM                                        ││
│ │ admin removed permission customer.delete from Sales role      ││
│ └─────────────────────────────────────────────────────────────┘│
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ Jan 15, 2026 9:00 AM                                         ││
│ │ admin created Sales role                                     ││
│ └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### Features

- **Comprehensive logging**: Track all role and permission changes
- **Multiple filters**: Filter by role, user, action, date range
- **Export to CSV**: Download audit trail for compliance
- **Detailed information**: Show before/after state for changes
- **User attribution**: Show who made each change

### Audit Events

- Role created
- Role updated
- Role deleted
- Role enabled/disabled
- Permission added to role
- Permission removed from role
- User assigned to role
- User removed from role
- Role cloned
- Role duplicated

## UI Components

### Badges

- **System Role**: Blue badge with "System" label
- **Custom Role**: Green badge with "Custom" label
- **Enabled**: Green checkmark
- **Disabled**: Red X or grayed out

### Icons

- **Edit**: Pencil icon
- **Clone**: Copy icon
- **Delete**: Trash icon
- **Enable**: Power on icon
- **Disable**: Power off icon
- **View**: Eye icon
- **Add**: Plus icon
- **Remove**: Minus icon
- **Search**: Magnifying glass icon
- **Export**: Download icon

### Color Scheme

- **Primary action**: Blue (#0066CC)
- **Destructive action**: Red (#DC3545)
- **Success**: Green (#28A745)
- **Warning**: Orange (#FFC107)
- **Neutral**: Gray (#6C757D)

## Responsive Design

### Desktop (1024px+)

- Full layout with all columns
- Side-by-side panels where appropriate
- Maximum information density

### Tablet (768px - 1023px)

- Collapsible side panels
- Simplified tables with key columns
- Touch-friendly buttons

### Mobile (< 768px)

- Single column layout
- Stacked panels
- Simplified views
- Bottom navigation for key actions

## Accessibility

- **Keyboard navigation**: Full keyboard support for all actions
- **Screen reader support**: Proper ARIA labels and roles
- **High contrast mode**: Support for high contrast themes
- **Focus indicators**: Clear focus states for all interactive elements
- **Error messages**: Descriptive error messages with suggestions

## Performance Considerations

- **Lazy loading**: Load role list with pagination
- **Caching**: Cache permission matrix for quick access
- **Debounced search**: Debounce search input to reduce API calls
- **Optimistic updates**: Update UI immediately, sync with server in background
- **Bulk operations**: Support bulk actions to reduce round trips

## Cross References

- [AUTHORIZATION.md](./AUTHORIZATION.md) - Authorization framework
- [PERMISSIONS.md](./PERMISSIONS.md) - Permission naming conventions
- [config/roles.yaml](../../config/roles.yaml) - Default role definitions
- [BOOTSTRAP.md](./BOOTSTRAP.md) - Bootstrap process
- [DECISION_TABLES.md](./DECISION_TABLES.md) - Permission resolution logic
