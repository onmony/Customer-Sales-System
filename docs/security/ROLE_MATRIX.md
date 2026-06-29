# Role Matrix

## Purpose

This matrix defines Phase 1 and future operational permissions before application and database authorization are implemented.

Related documents:

- [Navigation](../product/NAVIGATION.md)
- [Customer Workspace ADR](../decisions/ADR-010-Customer-Workspace.md)
- [Data Ownership](../technical/DATA_OWNERSHIP.md)
- [Dependencies](../technical/DEPENDENCIES.md)

## Roles

- Administrator
- Sales
- Warehouse
- Finance
- Management
- Future API

## Permission Legend

- View: Can read records.
- Create: Can create new records.
- Update: Can update mutable records.
- Approve: Can approve controlled workflows when approval exists.
- Delete: Can delete records when allowed. Immutable records should generally not support delete.
- Export: Can export records.
- Import: Can import records.
- No: Not allowed by default.
- Pending: Business policy is not finalized.

## Customer Permissions

| Role | View | Create | Update | Approve | Delete | Export | Import |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Administrator | Yes | Yes | Yes | Yes | Pending | Yes | Yes |
| Sales | Yes | Yes | Yes | No | No | Pending | No |
| Warehouse | Limited | No | No | No | No | No | No |
| Finance | Yes | No | Limited | No | No | Yes | No |
| Management | Yes | No | No | Yes | No | Yes | No |
| Future API | Scoped | Scoped | Scoped | Scoped | No | Scoped | Scoped |

## Product Permissions

| Role | View | Create | Update | Approve | Delete | Export | Import |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Administrator | Yes | Yes | Yes | Yes | Pending | Yes | Yes |
| Sales | Yes | No | No | No | No | No | No |
| Warehouse | Yes | No | Limited | No | No | No | No |
| Finance | Yes | No | No | No | No | Yes | No |
| Management | Yes | No | No | Yes | No | Yes | No |
| Future API | Scoped | Scoped | Scoped | Scoped | No | Scoped | Scoped |

## Pricing Permissions

| Role | View | Create | Update | Approve | Delete | Export | Import |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Administrator | Yes | Yes | Yes | Yes | No | Yes | Yes |
| Sales | Yes | Pending | Pending | No | No | No | No |
| Warehouse | No | No | No | No | No | No | No |
| Finance | Yes | Pending | Pending | Pending | No | Yes | Pending |
| Management | Yes | No | No | Yes | No | Yes | No |
| Future API | Scoped | Scoped | Scoped | Scoped | No | Scoped | Scoped |

## Order Permissions

| Role | View | Create | Update | Approve | Delete | Export | Import |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Administrator | Yes | Yes | Pending | Yes | Pending | Yes | Yes |
| Sales | Yes | Yes | Pending | No | No | Pending | No |
| Warehouse | Yes | No | No | Pending | No | No | No |
| Finance | Yes | No | No | No | No | Yes | No |
| Management | Yes | No | No | Yes | No | Yes | No |
| Future API | Scoped | Scoped | Scoped | Scoped | No | Scoped | Scoped |

## Invoice Permissions

| Role | View | Create | Update | Approve | Delete | Export | Import |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Administrator | Yes | Yes | Draft Only | Yes | No | Yes | Pending |
| Sales | Yes | Pending | No | No | No | Pending | No |
| Warehouse | Limited | No | No | No | No | No | No |
| Finance | Yes | Yes | Draft Only | Yes | No | Yes | Pending |
| Management | Yes | No | No | Yes | No | Yes | No |
| Future API | Scoped | Scoped | Scoped | Scoped | No | Scoped | Scoped |

## Warehouse Permissions

| Role | View | Create | Update | Approve | Delete | Export | Import |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Administrator | Yes | Yes | Yes | Yes | Pending | Yes | Yes |
| Sales | Customer Scoped | No | No | No | No | No | No |
| Warehouse | Yes | Yes | Yes | Yes | Pending | Yes | Pending |
| Finance | Limited | No | No | No | No | No | No |
| Management | Yes | No | No | Yes | No | Yes | No |
| Future API | Scoped | Scoped | Scoped | Scoped | No | Scoped | Scoped |

## Shipment Permissions

| Role | View | Create | Update | Approve | Delete | Export | Import |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Administrator | Yes | Yes | Yes | Yes | Pending | Yes | Yes |
| Sales | Customer Scoped | No | No | No | No | No | No |
| Warehouse | Yes | Yes | Yes | Yes | Pending | Yes | Pending |
| Finance | Limited | No | No | No | No | No | No |
| Management | Yes | No | No | Yes | No | Yes | No |
| Future API | Scoped | Scoped | Scoped | Scoped | No | Scoped | Scoped |

## Delivery Permissions

| Role | View | Create | Update | Approve | Delete | Export | Import |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Administrator | Yes | Yes | Yes | Yes | Pending | Yes | Yes |
| Sales | Customer Scoped | No | No | No | No | No | No |
| Warehouse | Yes | Yes | Yes | Yes | Pending | Yes | Pending |
| Finance | Limited | No | No | No | No | No | No |
| Management | Yes | No | No | Yes | No | Yes | No |
| Future API | Scoped | Scoped | Scoped | Scoped | No | Scoped | Scoped |

## Security Rules

- Tenant isolation is mandatory for every role.
- Future API access must be scoped by tenant, module, and action.
- Immutable records should not allow delete by default.
- Export and import permissions require separate approval before implementation.
- Permission checks must be enforced server-side, not only in navigation.

