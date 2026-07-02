# ADR 002: Phase-Aware Order Workflow

## Status

Accepted

## Context

The database schema includes OrderStatus records that span multiple phases of the ERP implementation:
- Draft, Confirmed, Cancelled (Module 6 - Order)
- Pending, Processing, Shipped, Delivered (Future modules)
- On Hold (Future modules)

Module 6 (Order) scope is limited to Draft → Confirmed → Cancelled workflow. However, the database is designed to be future-ready with all statuses pre-populated.

## Decision

### Phase-Aware Workflow

The application will be phase-aware, treating the database as future-ready but restricting business logic to the current module's scope.

### Module 6 (Order) Valid Business States

Only these statuses are valid for Module 6:
- **Draft** (code: `draft`) - Initial state, order being created
- **Confirmed** (code: `confirmed`) - Order confirmed, immutable
- **Cancelled** (code: `cancelled`) - Order cancelled, terminal state

### Module 6 Allowed Transitions

- Draft → Confirmed (via confirm order)
- Draft → Cancelled (via cancel order)
- Confirmed → (No transitions allowed - immutable)
- Cancelled → (No transitions allowed - terminal)

### Module 6 Blocked Transitions

Any transition to these statuses is rejected:
- Pending (belongs to future modules)
- Processing (belongs to future modules)
- Shipped (belongs to future modules)
- Delivered (belongs to future modules)
- On Hold (belongs to future modules)

### Implementation Constraints

- Do not expose future statuses in UI
- Do not expose future statuses in APIs
- Do not implement transitions for future statuses
- Do not modify database status master
- Do not delete existing status records

### Validation Rules

Order service will validate:
1. Only Draft orders can be edited
2. Only Draft orders can be confirmed
3. Only Draft orders can be cancelled
4. Confirmed orders are immutable
5. Cancelled orders are immutable
6. Any attempt to transition to future status is rejected with error

### Order History Strategy

**Module 6 (Current):**
- Draft orders use audit columns only: `createdAt`, `updatedAt`, `createdBy`, `updatedBy`
- No dedicated OrderRevision table
- Audit columns provide sufficient technical history for compliance and debugging
- Immutable snapshots preserve historical business state

**Module 10+ (Future):**
- Introduce OrderRevision table when warehouse/invoice integration adds value
- SMB users rarely need draft history until later modules
- Business revision history becomes valuable only after warehouse/invoice workflows
- OrderRevision will track business state transitions for decision support

**Rationale:**
- Audit columns provide universal value with minimal complexity
- Business history tables add complexity; defer until customer value justifies cost
- Warehouse and invoice integration create scenarios where revision comparison is valuable
- Phase-aware approach keeps Module 6 focused on core order management

## Consequences

### Positive

- Database is future-ready without schema changes
- Clear phase boundaries in application logic
- No data migration needed when future modules are added
- Existing status records can be leveraged in future phases

### Negative

- Application logic must explicitly filter valid statuses per phase
- Database contains unused status records in current phase
- Status codes must be hardcoded in validation logic

### Future Modules

When future modules are implemented:
- Warehouse module can use Processing, Shipped statuses
- Delivery module can use Delivered status
- Order management can use Pending, On Hold statuses
- No database changes required
- Only application logic needs to be extended

## Related Documents

- [Order V1 Business Rules](../features/order/VERSIONS/V1.md)
- [Order Decision Tables](../features/order/DECISION_TABLES.md)
- [ADR 001: Business Actions vs System Versioning](001-business-actions-vs-system-versioning.md)
