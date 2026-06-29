# Business Rules Registry

## Purpose

This document assigns stable Rule IDs to all business rules across the system. Rule IDs are used for traceability from business intent to implementation verification.

Related documents:

- [Traceability](TRACEABILITY.md) - Traceability framework
- [Rules](RULES.md) - Documentation and product rules
- [Principles](PRINCIPLES.md) - Product principles
- [Workflows](business/WORKFLOWS.md) - Workflow state transitions
- [Decision Tables](security/DECISION_TABLES.md) - Authorization decision tables
- [Pricing Effective Date Policy](business/PRICING_EFFECTIVE_DATE_POLICY.md) - Authoritative pricing behavior

## Rule ID Convention

- **Format:** [Module]-[Number]
- **Examples:** PR-001 (Pricing Rule 001), ORD-001 (Order Rule 001)
- **Modules:**
  - DOC: Documentation rules
  - PRD: Product rules
  - CUS: Customer rules
  - PR: Pricing rules
  - ORD: Order rules
  - INV: Invoice rules
  - WH: Warehouse rules
  - SHP: Shipment rules
  - DEL: Delivery rules
  - PAY: Payment rules
  - AUTH: Authorization rules

## Documentation Rules

| Rule ID | Rule Name | Rule Description | Related Documents |
|---------|-----------|-------------------|-------------------|
| DOC-001 | Code After Documentation | Never generate application code before documentation | RULES.md |
| DOC-002 | Feature Documentation Approval | Never generate feature documentation without approval | RULES.md |
| DOC-003 | Module Documentation | Every module must be documented before implementation | RULES.md |
| DOC-004 | Business Documentation Purity | Business documentation must not contain implementation details | RULES.md |
| DOC-005 | Technical Documentation Purity | Technical documentation must not redefine business rules | RULES.md |
| DOC-006 | Gherkin First | Gherkin scenarios must be written before implementation | RULES.md |
| DOC-007 | Documentation Is Production Code | Documentation is production code | RULES.md |

## Product Rules

| Rule ID | Rule Name | Rule Description | Related Documents |
|---------|-----------|-------------------|-------------------|
| PRD-001 | Multi-Tenant Day One | The product must be multi-tenant from day one | RULES.md, DOMAIN.md |
| PRD-002 | Customer Center | The customer is the center of the product | RULES.md, VISION.md |
| PRD-003 | Customer-Specific Pricing | Customer-specific pricing is the primary business capability | RULES.md, DOMAIN.md |
| PRD-004 | Pricing History Preservation | Pricing history must never be lost | RULES.md, DOMAIN.md |
| PRD-005 | Order Snapshots | Orders must contain immutable snapshots | RULES.md, DOMAIN.md |
| PRD-006 | Invoice Immutability | Invoices are immutable | RULES.md, DOMAIN.md |
| PRD-007 | AI Support | Future AI modules must be supported without redesign | RULES.md |
| PRD-008 | Customer-Centered ERP | The product must organize workflows around the customer rather than around accounting records | PRINCIPLES.md |
| PRD-009 | Speed With Accuracy | The salesperson should be able to create an accurate order in under one minute | PRINCIPLES.md |
| PRD-010 | History Preservation | Business history must be preserved. Current state must not overwrite past truth | PRINCIPLES.md |
| PRD-011 | Immutable Business Snapshots | Orders and invoices must preserve the values that existed when the business event occurred | PRINCIPLES.md |
| PRD-012 | Multi-Tenant Foundation | Tenant isolation is a foundation, not a later enhancement | PRINCIPLES.md |
| PRD-013 | AI-First Documentation | Documentation must allow future AI agents to continue development without previous chat history | PRINCIPLES.md |

## Customer Rules

| Rule ID | Rule Name | Rule Description | Related Documents |
|---------|-----------|-------------------|-------------------|
| CUS-001 | Customer Activation | New customers start in Active state | WORKFLOWS.md |
| CUS-002 | Customer Deactivation | Active customers can be deactivated if no pending orders or outstanding balance | WORKFLOWS.md |
| CUS-003 | Customer Blocking | Active customers can be blocked due to credit limit exceeded or payment overdue | WORKFLOWS.md |
| CUS-004 | Customer Reactivation | Inactive customers can be reactivated after contact verification | WORKFLOWS.md |
| CUS-005 | Customer Unblocking | Blocked customers can be unblocked after credit limit restored or payment received | WORKFLOWS.md |
| CUS-006 | Customer Merge | Active customers can be merged into another customer if no pending orders | WORKFLOWS.md |
| CUS-007 | Customer Merge Precondition | Blocked customers cannot be merged (must unblock first) | WORKFLOWS.md |
| CUS-008 | Customer Merge Terminal | Merged customers cannot transition to any other state (merged is terminal) | WORKFLOWS.md |
| CUS-009 | Customer Inactivity | Inactive customers cannot be blocked (must reactivate first) | WORKFLOWS.md |

## Pricing Rules

| Rule ID | Rule Name | Rule Description | Related Documents |
|---------|-----------|-------------------|-------------------|
| PR-001 | Pricing Resolution | When resolving price for a customer-product pair, use the active pricing version with the latest effective date on or before the order date | WORKFLOWS.md |
| PR-002 | Pricing Versioning | Pricing versions are append-only. New versions do not overwrite old versions | DOMAIN.md, WORKFLOWS.md |
| PR-003 | Pricing Draft State | New pricing versions start in Draft state | WORKFLOWS.md |
| PR-004 | Pricing Activation | Draft pricing can be activated if effective date is valid | WORKFLOWS.md |
| PR-005 | Pricing Scheduling | Draft pricing can be scheduled for future activation if effective date is in future | WORKFLOWS.md |
| PR-006 | Pricing Auto-Activation | Future pricing versions auto-activate when effective date is reached | WORKFLOWS.md |
| PR-007 | Pricing Expiration | Active pricing versions auto-expire when expiry date is reached | WORKFLOWS.md |
| PR-008 | Pricing Version Creation | Active pricing can create new versions while keeping history | WORKFLOWS.md |
| PR-009 | Pricing Expiration Terminal | Expired pricing cannot be reactivated (must create new version) | WORKFLOWS.md |
| PR-010 | Pricing Future Terminal | Future pricing cannot revert to Draft (must cancel and recreate) | WORKFLOWS.md |
| PR-011 | Pricing Active Terminal | Active pricing cannot become Future (must create new version) | WORKFLOWS.md |

## Order Rules

| Rule ID | Rule Name | Rule Description | Related Documents |
|---------|-----------|-------------------|-------------------|
.ORD-001 | Order Draft State | New orders start in Draft state | WORKFLOWS.md |
| ORD-002 | Order Submission | Draft orders can be submitted for confirmation if order items are valid and pricing is resolved | WORKFLOWS.md |
| ORD-003 | Order Confirmation | Pending orders can be confirmed if customer credit check passes | WORKFLOWS.md |
| ORD-004 | Order Processing | Confirmed orders can begin processing if inventory is available | WORKFLOWS.md |
| ORD-005 | Order Shipment | Processing orders can be shipped when shipment is created | WORKFLOWS.md |
| ORD-006 | Order Delivery | Shipped orders can be delivered when proof of delivery is received | WORKFLOWS.md |
| ORD-007 | Order Draft Cancellation | Draft orders can be cancelled if no payment is processed | WORKFLOWS.md |
| ORD-008 | Order Pending Cancellation | Pending orders can be cancelled if no payment is processed | WORKFLOWS.md |
| ORD-009 | Order Hold | Confirmed orders can be placed on hold due to credit issue or inventory shortage | WORKFLOWS.md |
| ORD-010 | Order Hold Release | On-hold orders can be released when credit is restored or inventory is available | WORKFLOWS.md |
| ORD-011 | Order Hold Cancellation | On-hold orders can be cancelled if no payment is processed | WORKFLOWS.md |
| ORD-012 | Order Delivery Terminal | Delivered orders cannot transition to any other state (delivered is terminal) | WORKFLOWS.md |
| ORD-013 | Order Cancellation Terminal | Cancelled orders cannot transition to any other state (cancelled is terminal) | WORKFLOWS.md |
| ORD-014 | Order Processing Reversion | Processing orders cannot revert to Draft | WORKFLOWS.md |
| ORD-015 | Order Shipment Reversion | Shipped orders cannot revert to Processing | WORKFLOWS.md |
| ORD-016 | Order Snapshot Creation | Orders must create immutable snapshots when confirmed | DOMAIN.md, WORKFLOWS.md |
| ORD-017 | Order Snapshot Immutability | Order snapshots must not be changed by source aggregate changes | DATA_OWNERSHIP.md |

## Invoice Rules

| Rule ID | Rule Name | Rule Description | Related Documents |
|---------|-----------|-------------------|-------------------|
| INV-001 | Invoice Generation | Invoices are generated from confirmed orders | WORKFLOWS.md |
| INV-002 | Invoice Draft State | New invoices start in Draft state | WORKFLOWS.md |
| INV-003 | Invoice Saving | Draft invoices can be saved if invoice items match order | WORKFLOWS.md |
| INV-004 | Invoice Issuance | Generated invoices can be issued when invoice number is assigned | WORKFLOWS.md |
| INV-005 | Invoice Viewing | Issued invoices can be viewed by customer | WORKFLOWS.md |
| INV-006 | Invoice Partial Payment | Issued invoices can receive partial payment if payment amount is less than invoice total | WORKFLOWS.md |
| INV-007 | Invoice Full Payment | Partial or issued invoices can be fully paid when payment amount equals invoice total | WORKFLOWS.md |
| INV-008 | Invoice Overdue | Issued invoices become overdue when due date is exceeded | WORKFLOWS.md |
| INV-009 | Invoice Overdue Payment | Overdue invoices can be paid when payment is received | WORKFLOWS.md |
| INV-010 | Invoice Voiding | Generated invoices can be voided if no payment is received | WORKFLOWS.md |
| INV-011 | Invoice Write-Off | Overdue invoices can be written off as bad debt with management approval | WORKFLOWS.md |
| INV-012 | Invoice Paid Terminal | Paid invoices cannot transition to any other state (paid is terminal) | WORKFLOWS.md |
| INV-013 | Invoice Void Terminal | Void invoices cannot transition to any other state (void is terminal) | WORKFLOWS.md |
| INV-014 | Invoice Write-Off Terminal | Written-off invoices cannot transition to any other state (written-off is terminal) | WORKFLOWS.md |
| INV-015 | Invoice Draft Reversion | Issued invoices cannot revert to Draft | WORKFLOWS.md |
| INV-016 | Invoice Immutability | Issued invoices are immutable | DOMAIN.md, WORKFLOWS.md |
| INV-017 | Invoice Snapshot Copying | Invoices must copy from order snapshots, not current state | DATA_OWNERSHIP.md |

## Warehouse Rules

| Rule ID | Rule Name | Rule Description | Related Documents |
|---------|-----------|-------------------|-------------------|
| WH-001 | Warehouse Request Creation | Warehouse requests are created when order is confirmed | WORKFLOWS.md |
| WH-002 | Warehouse Request Pending | New warehouse requests start in Pending state | WORKFLOWS.md |
| WH-003 | Warehouse Picking | Pending warehouse requests can be picked if inventory is available | WORKFLOWS.md |
| WH-004 | Warehouse Packing | Picked warehouse requests can be packed when all items are picked | WORKFLOWS.md |
| WH-005 | Warehouse Ready | Packed warehouse requests can be marked ready for shipment when packing is complete | WORKFLOWS.md |
| WH-006 | Warehouse Request Cancellation | Pending warehouse requests can be cancelled if order is cancelled | WORKFLOWS.md |
| WH-007 | Warehouse Picked Cancellation | Picked warehouse requests can be cancelled if items are returned to inventory | WORKFLOWS.md |
| WH-008 | Warehouse Ready Terminal | Ready warehouse requests cannot transition to any state except handoff to shipment | WORKFLOWS.md |
| WH-009 | Warehouse Cancellation Terminal | Cancelled warehouse requests cannot transition to any other state (cancelled is terminal) | WORKFLOWS.md |

## Shipment Rules

| Rule ID | Rule Name | Rule Description | Related Documents |
|---------|-----------|-------------------|-------------------|
| SHP-001 | Shipment Creation | Shipments are created when warehouse request is ready | WORKFLOWS.md |
| SHP-002 | Shipment Pending | New shipments start in Pending state | WORKFLOWS.md |
| SHP-003 | Shipment Dispatch | Pending shipments can be dispatched when carrier is assigned | WORKFLOWS.md |
| SHP-004 | Shipment In Transit | Dispatched shipments become In Transit | WORKFLOWS.md |
| SHP-005 | Shipment Out for Delivery | In-transit shipments become Out for Delivery when near delivery destination | WORKFLOWS.md |
| SHP-006 | Shipment Delivery | Out-for-delivery shipments can be delivered when proof of delivery is received | WORKFLOWS.md |
| SHP-007 | Shipment Exception | In-transit shipments can report exception with details | WORKFLOWS.md |
| SHP-008 | Shipment Exception Resolution | Exception shipments can resume when exception is resolved | WORKFLOWS.md |
| SHP-009 | Shipment Cancellation | Pending shipments can be cancelled if order is cancelled | WORKFLOWS.md |
| SHP-010 | Shipment Return | Delivered shipments can be returned if return request is approved | WORKFLOWS.md |
| SHP-011 | Shipment Delivery Reversion | Delivered shipments cannot revert to In Transit | WORKFLOWS.md |
| SHP-012 | Shipment Return Terminal | Returned shipments cannot transition to any other state (returned is terminal) | WORKFLOWS.md |
| SHP-013 | Shipment Cancellation Terminal | Cancelled shipments cannot transition to any other state (cancelled is terminal) | WORKFLOWS.md |

## Delivery Rules

| Rule ID | Rule Name | Rule Description | Related Documents |
|---------|-----------|-------------------|-------------------|
| DEL-001 | Delivery Creation | Delivery records are created when shipment is dispatched | WORKFLOWS.md |
| DEL-002 | Delivery Pending | New deliveries start in Pending state | WORKFLOWS.md |
| DEL-003 | Delivery Attempt | Pending deliveries can record delivery attempt with details | WORKFLOWS.md |
| DEL-004 | Delivery Confirmation | Attempted deliveries can be confirmed when proof of delivery is received | WORKFLOWS.md |
| DEL-005 | Delivery Failure | Attempted deliveries can be marked failed when max attempts exceeded | WORKFLOWS.md |
| DEL-006 | Delivery Direct Confirmation | Pending deliveries can be confirmed directly when proof of delivery is received | WORKFLOWS.md |
| DEL-007 | Delivery Confirmation Terminal | Confirmed deliveries cannot transition to any other state (confirmed is terminal) | WORKFLOWS.md |
| DEL-008 | Delivery Failure Terminal | Failed deliveries cannot transition to any other state (failed is terminal) | WORKFLOWS.md |

## Payment Rules

| Rule ID | Rule Name | Rule Description | Related Documents |
|---------|-----------|-------------------|-------------------|
| PAY-001 | Payment Receipt | Payments are received against issued invoices | WORKFLOWS.md |
| PAY-002 | Payment Invoice Reference | Payments must reference the invoice being settled | WORKFLOWS.md |
| PAY-003 | Payment Amount Validation | Payment amount must be positive and not exceed invoice outstanding balance | WORKFLOWS.md |
| PAY-004 | Payment Receipt Recording | Payment receipts should be append-only or corrected by reversal | DATA_OWNERSHIP.md |

## Authorization Rules

| Rule ID | Rule Name | Rule Description | Related Documents |
|---------|-----------|-------------------|-------------------|
| AUTH-001 | User Existence Check | User must exist to have permissions | DECISION_TABLES.md |
| AUTH-002 | User Active Check | User must be active to have permissions | DECISION_TABLES.md |
| AUTH-003 | Role Assignment Check | User must have at least one role assigned | DECISION_TABLES.md |
| AUTH-004 | Role Enabled Check | At least one role must be enabled | DECISION_TABLES.md |
| AUTH-005 | Permission Explicit Grant | Permission must be explicitly granted in role | DECISION_TABLES.md |
| AUTH-006 | Permission Wildcard Match | Permission can be matched by wildcard pattern | DECISION_TABLES.md |
| AUTH-007 | Global Wildcard | `*` wildcard matches all permissions | DECISION_TABLES.md |
| AUTH-008 | Domain Wildcard | `domain.*` wildcard matches all permissions in domain | DECISION_TABLES.md |
| AUTH-009 | Action Wildcard | `*.action` wildcard matches all permissions with action | DECISION_TABLES.md |
| AUTH-010 | Disabled Role Ignore | Disabled roles are completely ignored | DECISION_TABLES.md |
| AUTH-011 | Orphaned Assignment Ignore | Orphaned role assignments are ignored | DECISION_TABLES.md |
| AUTH-012 | Inactive User Deny | Inactive users are denied all permissions | DECISION_TABLES.md |
| AUTH-013 | System Role Delete Protection | System roles cannot be deleted | DECISION_TABLES.md |
| AUTH-014 | System Role Rename Protection | System roles cannot be renamed | DECISION_TABLES.md |
| AUTH-015 | System Role Permission Edit | System roles can have permissions modified | DECISION_TABLES.md |
| AUTH-016 | System Role Enable Disable | System roles can be enabled/disabled | DECISION_TABLES.md |
| AUTH-017 | Last Administrator Protection | Prevent disabling the last role with administrative permissions | DECISION_TABLES.md |
| AUTH-018 | Permission Removal Warning | Higher warning for roles with many members and critical permissions | DECISION_TABLES.md |
| AUTH-019 | Fail-Safe Deny | Default to DENY on errors during permission checks | DECISION_TABLES.md |

## Rule Usage Guidelines

### Adding New Rules

1. Assign a new Rule ID following the convention
2. Add the rule to the appropriate module section
3. Update related documents to reference the Rule ID
4. Create decision tables if the rule has complex logic
5. Write Gherkin scenarios for the rule
6. Implement the rule with Rule ID reference
7. Write tests with Rule ID reference

### Modifying Existing Rules

1. Update the rule description in this registry
2. Update related documents to reflect the change
3. Update decision tables if the logic changes
4. Update Gherkin scenarios if the behavior changes
5. Update implementation to reflect the change
6. Update tests to verify the change

### Deprecating Rules

1. Mark the rule as deprecated in this registry
2. Document the reason for deprecation
3. Document the replacement rule (if any)
4. Update related documents to use the replacement rule
5. Update implementation to use the replacement rule
6. Update tests to verify the replacement rule

## Related Documents

- [Traceability](TRACEABILITY.md) - Traceability framework
- [Rules](RULES.md) - Documentation and product rules
- [Principles](PRINCIPLES.md) - Product principles
- [Workflows](business/WORKFLOWS.md) - Workflow state transitions
- [Decision Tables](security/DECISION_TABLES.md) - Authorization decision tables
