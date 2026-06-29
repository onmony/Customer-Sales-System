# Decision Tables

## Overview

This document defines the decision logic for permission resolution, role resolution, and edge case handling in the authorization framework. Decision tables provide a clear, unambiguous specification of authorization behavior.

## Permission Resolution

### Basic Permission Check

Determines if a user has a specific permission.

**Inputs:**
- User ID
- Required Permission
- Context (optional)

**Output:**
- ALLOW
- DENY

**Decision Table:**

| User Exists | User Active | User Has Roles | Role Enabled | Permission in Role | Wildcard Match | Result |
|-------------|-------------|----------------|--------------|-------------------|----------------|--------|
| No          | -           | -              | -            | -                 | -              | DENY   |
| Yes         | No          | -              | -            | -                 | -              | DENY   |
| Yes         | Yes         | No             | -            | -                 | -              | DENY   |
| Yes         | Yes         | Yes            | No           | -                 | -              | DENY   |
| Yes         | Yes         | Yes            | Yes          | Yes               | -              | ALLOW  |
| Yes         | Yes         | Yes            | Yes          | No                | Yes            | ALLOW  |
| Yes         | Yes         | Yes            | Yes          | No                | No             | DENY   |

**Logic:**
1. User must exist and be active
2. User must have at least one role assigned
3. At least one role must be enabled
4. Permission must be explicitly granted or matched by wildcard

### Wildcard Permission Resolution

Resolves wildcard permissions to concrete permissions.

**Inputs:**
- Wildcard Permission (e.g., `customer.*`)
- Available Permissions

**Output:**
- List of matching permissions

**Decision Table:**

| Wildcard Pattern | Permission Pattern | Match | Example |
|------------------|-------------------|-------|---------|
| `*`              | `customer.view`    | Yes   | Global wildcard matches all |
| `customer.*`     | `customer.view`    | Yes   | Domain wildcard matches domain permissions |
| `customer.*`     | `order.view`       | No    | Different domain |
| `customer.*`     | `customer`         | No    | No action specified |
| `customer.view`  | `customer.view`    | Yes   | Exact match |
| `customer.view`  | `customer.edit`    | No    | Different action |
| `*.view`         | `customer.view`    | Yes   | Action wildcard matches action |
| `*.view`         | `customer.edit`    | No    | Different action |

**Logic:**
- `*` matches all permissions
- `domain.*` matches all permissions in domain
- `*.action` matches all permissions with action
- Exact match required if no wildcard

## Role Resolution

### Role Assignment Check

Determines if a user has a specific role.

**Inputs:**
- User ID
- Role Name

**Output:**
- HAS_ROLE
- NO_ROLE

**Decision Table:**

| User Exists | User Active | Role Exists | Role Enabled | Assignment Exists | Assignment Active | Result |
|-------------|-------------|-------------|--------------|-------------------|------------------|--------|
| No          | -           | -           | -            | -                 | -                | NO_ROLE|
| Yes         | No          | -           | -            | -                 | -                | NO_ROLE|
| Yes         | Yes         | No          | -            | -                 | -                | NO_ROLE|
| Yes         | Yes         | Yes         | No           | -                 | -                | NO_ROLE|
| Yes         | Yes         | Yes         | Yes          | No                | -                | NO_ROLE|
| Yes         | Yes         | Yes         | Yes          | Yes               | No               | NO_ROLE|
| Yes         | Yes         | Yes         | Yes          | Yes               | Yes              | HAS_ROLE|

**Logic:**
1. User must exist and be active
2. Role must exist and be enabled
3. Assignment must exist and be active

### Effective Permissions Calculation

Calculates all effective permissions for a user across all roles.

**Inputs:**
- User ID

**Output:**
- Set of effective permissions

**Decision Table:**

| User Roles | Role Enabled | Role Permissions | Wildcard Expansion | Duplicate Permissions | Result |
|------------|--------------|------------------|---------------------|-----------------------|--------|
| None       | -            | -                | -                   | -                     | Empty  |
| 1+         | All disabled | -                | -                   | -                     | Empty  |
| 1+         | Some enabled | None             | -                   | -                     | Empty  |
| 1+         | Some enabled | Some             | Yes                 | Yes                   | Deduped|
| 1+         | Some enabled | Some             | No                  | Yes                   | Deduped|
| 1+         | All enabled  | Some             | Yes                 | Yes                   | Deduped|

**Logic:**
1. Collect all enabled roles for user
2. Collect all permissions from enabled roles
3. Expand wildcard permissions
4. Remove duplicates
5. Return unique set of permissions

## Edge Cases

### Unknown Permission

Behavior when checking a permission that doesn't exist in the system.

**Decision Table:**

| Permission Exists | User Has Wildcard | Result |
|-------------------|-------------------|--------|
| Yes               | -                 | Normal check |
| No                | Yes               | ALLOW (if wildcard matches) |
| No                | No                | DENY |

**Logic:**
- If permission doesn't exist and no wildcard matches, deny
- If permission doesn't but wildcard matches, allow
- This allows for future permissions to be granted via wildcard

### Disabled Role

Behavior when a user has a disabled role.

**Decision Table:**

| User Has Disabled Role | User Has Other Enabled Roles | Result |
|------------------------|------------------------------|--------|
| Yes                    | Yes                          | Use enabled roles only |
| Yes                    | No                           | DENY (no active roles) |

**Logic:**
- Disabled roles are completely ignored
- User must have at least one enabled role to have permissions

### Deleted Role

Behavior when a user has a deleted role (orphaned assignment).

**Decision Table:**

| Role Exists | Assignment Exists | Result |
|-------------|-------------------|--------|
| Yes         | Yes               | Normal check |
| No          | Yes               | Ignore assignment (treat as no role) |
| No          | No                | Normal check |

**Logic:**
- Orphaned assignments are ignored
- Consider adding cleanup job to remove orphaned assignments

### Inactive User

Behavior when checking permissions for an inactive user.

**Decision Table:**

| User Status | Result |
|-------------|--------|
| Active      | Normal check |
| Inactive    | DENY |
| Suspended   | DENY |
| Deleted     | DENY |

**Logic:**
- Inactive users are denied all permissions
- This applies regardless of role assignments

### System Role Modification

Behavior when attempting to modify a system role.

**Decision Table:**

| Role Is System | Action | Result |
|----------------|--------|--------|
| Yes            | Delete | DENY |
| Yes            | Rename | DENY |
| Yes            | Edit permissions | ALLOW |
| Yes            | Enable/Disable | ALLOW |
| No             | Any action | ALLOW |

**Logic:**
- System roles cannot be deleted or renamed
- System roles can have permissions modified
- System roles can be enabled/disabled

### Last Administrator Protection

Prevents disabling the last role with administrative permissions.

**Decision Table:**

| Role Has Admin Permissions | Enabled Admin Roles Count | Action | Result |
|----------------------------|---------------------------|--------|--------|
| Yes                        | > 1                       | Disable | ALLOW |
| Yes                        | = 1                       | Disable | DENY |
| Yes                        | = 0                       | Disable | DENY (already none) |
| No                         | Any                       | Disable | ALLOW |

**Logic:**
- Prevent disabling the last role with admin permissions
- Ensure at least one admin role remains enabled

### Permission Removal Impact

Warning levels when removing permissions from a role.

**Decision Table:**

| Permission Type | Role Member Count | Warning Level |
|-----------------|-------------------|---------------|
| Non-critical    | 0                 | None          |
| Non-critical    | 1-10              | Low           |
| Non-critical    | 11-50             | Medium        |
| Non-critical    | 50+               | High          |
| Critical        | Any               | High          |

**Critical Permissions:**
- `*` (global wildcard)
- `role.*` (role management)
- `user.*` (user management)
- `system.*` (system configuration)

**Logic:**
- Higher warning for roles with many members
- Highest warning for critical permissions
- Require confirmation for high warnings

## Multi-Tenant Resolution (Future)

### Tenant Permission Resolution

Determines permissions in a multi-tenant environment.

**Decision Table:**

| Tenant Context | Global Role Exists | Tenant Role Exists | Global Permission | Tenant Permission | Result |
|----------------|-------------------|-------------------|-------------------|-------------------|--------|
| None           | Yes               | No                | Yes               | -                 | Use global |
| None           | Yes               | No                | No                | -                 | DENY |
| Tenant A       | Yes               | No                | Yes               | -                 | Use global |
| Tenant A       | Yes               | Yes               | Yes               | Yes               | Use tenant |
| Tenant A       | Yes               | Yes               | Yes               | No                | Use global |
| Tenant A       | Yes               | Yes               | No                | Yes               | Use tenant |
| Tenant A       | No                | Yes               | -                 | Yes               | Use tenant |
| Tenant A       | No                | Yes               | -                 | No                | DENY |

**Logic:**
- Tenant-specific permissions override global permissions
- If no tenant override, use global permissions
- If neither exists, deny

## Caching Decisions

### Cache Invalidation

When to invalidate permission cache.

**Decision Table:**

| Event | Cache Action |
|-------|--------------|
| User role assigned | Invalidate user cache |
| User role removed | Invalidate user cache |
| Role permission added | Invalidate all users with role |
| Role permission removed | Invalidate all users with role |
| Role enabled/disabled | Invalidate all users with role |
| Permission created/deleted | Invalidate all caches |
| Role created/deleted | Invalidate all caches |
| User status changed | Invalidate user cache |

**Logic:**
- User-specific changes invalidate user cache
- Role changes invalidate all users with that role
- Global changes invalidate all caches

## Error Handling

### Permission Check Errors

How to handle errors during permission checks.

**Decision Table:**

| Error Type | Default Behavior | Configurable |
|------------|------------------|--------------|
| Database connection failed | DENY (fail-safe) | Yes |
| Cache unavailable | Fallback to database | Yes |
| Invalid permission format | DENY | No |
| Timeout | DENY (fail-safe) | Yes |
| User not found | DENY | No |

**Logic:**
- Default to DENY on errors (fail-safe)
- Allow configuration for some error types
- Log all errors for troubleshooting

## Cross References

- [AUTHORIZATION.md](./AUTHORIZATION.md) - Authorization framework overview
- [PERMISSIONS.md](./PERMISSIONS.md) - Permission naming conventions
- [ROLE_MANAGEMENT_UI.md](./ROLE_MANAGEMENT_UI.md) - UI design
- [BOOTSTRAP.md](./BOOTSTRAP.md) - Bootstrap process
- [FUTURE_EVOLUTION.md](./FUTURE_EVOLUTION.md) - Multi-tenant evolution
