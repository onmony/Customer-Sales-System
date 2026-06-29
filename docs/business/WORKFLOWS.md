# Workflows

## Purpose

This document defines the lifecycle and allowed transitions for core business entities. This is documentation only - no workflow engine implementation is required.

Related documents:

- [Domain](../DOMAIN.md)
- [Data Ownership](../technical/DATA_OWNERSHIP.md)
- [Dependencies](../technical/DEPENDENCIES.md)
- [Business Events](../technical/EVENTS.md)

## Customer Workflow

### States

- **Active**: Customer can create orders and receive shipments
- **Inactive**: Customer cannot create new orders but existing orders continue
- **Blocked**: Customer is blocked from creating orders due to credit or policy reasons
- **Merged**: Customer record has been merged into another customer (historical only)

### Allowed Transitions

| From | To | Triggering Action | Responsible Role | Business Validation Rules |
| --- | --- | --- | --- | --- |
| (New) | Active | Create customer | Sales, Administrator | Customer name, contact, address required |
| Active | Inactive | Deactivate customer | Administrator | No pending orders or outstanding balance |
| Active | Blocked | Block customer | Administrator, Finance | Credit limit exceeded or payment overdue |
| Inactive | Active | Reactivate customer | Administrator | Customer contact verified |
| Blocked | Active | Unblock customer | Administrator, Finance | Credit limit restored or payment received |
| Active | Merged | Merge customer | Administrator | Target customer exists, no pending orders |

### Invalid Transitions

- Blocked → Merged (must unblock first)
- Merged → Any state (merged is terminal)
- Inactive → Blocked (must reactivate first)

### Future Automation Opportunities

- Automatic block when credit limit exceeded
- Automatic unblock when payment received
- Duplicate customer detection and merge suggestion

## Pricing Workflow

### States

- **Draft**: Pricing version is being created or edited
- **Active**: Pricing version is currently in effect for order resolution
- **Expired**: Pricing version is no longer in effect
- **Future**: Pricing version is scheduled to become active in the future

### Allowed Transitions

| From | To | Triggering Action | Responsible Role | Business Validation Rules |
| --- | --- | --- | --- | --- |
| (New) | Draft | Create pricing version | Pricing Manager | Customer, product, price required |
| Draft | Active | Activate pricing | Pricing Manager | Effective date must be valid |
| Draft | Future | Schedule pricing | Pricing Manager | Effective date must be in future |
| Future | Active | Auto-activate on effective date | System | Effective date reached |
| Active | Expired | Auto-expire on expiry date | System | Expiry date reached |
| Active | Draft | Create new version | Pricing Manager | Creates new version, keeps history |

### Invalid Transitions

- Expired → Active (must create new version)
- Future → Draft (must cancel and recreate)
- Active → Future (must create new version)

### Future Automation Opportunities

- Bulk pricing import with validation
- Pricing approval workflow for large changes
- Automatic pricing suggestions based on order history

## Order Workflow

### States

- **Draft**: Order is being created but not yet confirmed
- **Pending**: Order is awaiting confirmation
- **Confirmed**: Order is confirmed and ready for invoice generation
- **Processing**: Order is being processed for fulfillment
- **Shipped**: Order has been shipped
- **Delivered**: Order has been delivered
- **Cancelled**: Order has been cancelled
- **On Hold**: Order is on hold due to credit or inventory issues

### Allowed Transitions

| From | To | Triggering Action | Responsible Role | Business Validation Rules |
| --- | --- | --- | --- | --- |
| (New) | Draft | Create order | Sales | Customer, products, quantities required |
| Draft | Pending | Submit for confirmation | Sales | Order items valid, pricing resolved |
| Pending | Confirmed | Confirm order | Sales, Manager | Customer credit check passed |
| Confirmed | Processing | Begin processing | Warehouse | Inventory available |
| Processing | Shipped | Ship order | Warehouse | Shipment created |
| Shipped | Delivered | Confirm delivery | Delivery, Customer | Proof of delivery received |
| Draft | Cancelled | Cancel order | Sales, Manager | No payment processed |
| Pending | Cancelled | Cancel order | Sales, Manager | No payment processed |
| Confirmed | On Hold | Place on hold | Finance, Manager | Credit issue or inventory shortage |
| On Hold | Confirmed | Release hold | Finance, Manager | Credit restored or inventory available |
| On Hold | Cancelled | Cancel order | Sales, Manager | No payment processed |

### Invalid Transitions

- Delivered → Any state (delivered is terminal)
- Cancelled → Any state (cancelled is terminal)
- Processing → Draft (cannot revert to draft)
- Shipped → Processing (cannot revert to processing)

### Future Automation Opportunities

- Automatic credit hold when outstanding balance exceeds limit
- Automatic cancellation after X days in pending state
- Automatic delivery confirmation from tracking integration

## Invoice Workflow

### States

- **Draft**: Invoice is being generated from order
- **Generated**: Invoice is generated but not yet issued
- **Issued**: Invoice is issued and sent to customer
- **Viewed**: Customer has viewed the invoice
- **Partial**: Partial payment received
- **Paid**: Invoice is fully paid
- **Overdue**: Invoice is past due date
- **Void**: Invoice is voided (correction)
- **Written Off**: Invoice is written off as bad debt

### Allowed Transitions

| From | To | Triggering Action | Responsible Role | Business Validation Rules |
| --- | --- | --- | --- | --- |
| (New) | Draft | Generate from order | Finance, System | Order must be confirmed |
| Draft | Generated | Save invoice | Finance | Invoice items match order |
| Generated | Issued | Issue invoice | Finance | Invoice number assigned |
| Issued | Viewed | Customer views invoice | Customer | Customer accessed invoice |
| Issued | Partial | Partial payment received | Finance | Payment amount < invoice total |
| Partial | Paid | Full payment received | Finance | Payment amount = invoice total |
| Issued | Paid | Full payment received | Finance | Payment amount = invoice total |
| Issued | Overdue | Payment due date passed | System | Due date exceeded |
| Overdue | Paid | Payment received | Finance | Payment received |
| Generated | Void | Void invoice | Finance, Manager | No payment received |
| Overdue | Written Off | Write off bad debt | Finance, Manager | Management approval required |

### Invalid Transitions

- Paid → Any state (paid is terminal)
- Void → Any state (void is terminal)
- Written Off → Any state (written off is terminal)
- Issued → Draft (cannot revert to draft)

### Future Automation Opportunities

- Automatic overdue status when due date passed
- Automatic payment reconciliation from bank integration
- Automatic reminder notifications for overdue invoices

## Warehouse Workflow

### States

- **Pending**: Warehouse request is created but not yet picked
- **Picked**: Items are picked from inventory
- **Packed**: Items are packed for shipment
- **Ready**: Order is ready for handoff to shipment
- **Cancelled**: Warehouse request is cancelled

### Allowed Transitions

| From | To | Triggering Action | Responsible Role | Business Validation Rules |
| --- | --- | --- | --- | --- |
| (New) | Pending | Create warehouse request | System | Order confirmed |
| Pending | Picked | Pick items | Warehouse | Inventory available |
| Picked | Packed | Pack items | Warehouse | All items picked |
| Packed | Ready | Mark ready for shipment | Warehouse | Packing complete |
| Pending | Cancelled | Cancel request | Sales, Manager | Order cancelled |
| Picked | Cancelled | Cancel request | Sales, Manager | Return items to inventory |

### Invalid Transitions

- Ready → Any state except handoff to shipment
- Cancelled → Any state (cancelled is terminal)

### Future Automation Opportunities

- Automatic inventory reservation on order confirmation
- Automatic picking list generation
- Integration with warehouse management systems

## Shipment Workflow

### States

- **Pending**: Shipment is planned but not yet dispatched
- **In Transit**: Shipment is in transit to delivery destination
- **Out for Delivery**: Shipment is out for final delivery
- **Delivered**: Shipment has been delivered
- **Exception**: Shipment has an exception (delay, damage, etc.)
- **Returned**: Shipment has been returned

### Allowed Transitions

| From | To | Triggering Action | Responsible Role | Business Validation Rules |
| --- | --- | --- | --- | --- |
| (New) | Pending | Create shipment | Warehouse | Warehouse request ready |
| Pending | In Transit | Dispatch shipment | Warehouse, Carrier | Carrier assigned |
| In Transit | Out for Delivery | Out for delivery | Carrier | Near delivery destination |
| Out for Delivery | Delivered | Confirm delivery | Delivery, Customer | Proof of delivery received |
| In Transit | Exception | Report exception | Carrier, Operations | Exception details recorded |
| Exception | In Transit | Resume shipment | Carrier, Operations | Exception resolved |
| Pending | Cancelled | Cancel shipment | Warehouse | Order cancelled |
| Delivered | Returned | Return shipment | Customer, Operations | Return request approved |

### Invalid Transitions

- Delivered → In Transit (cannot revert)
- Returned → Any state (returned is terminal)
- Cancelled → Any state (cancelled is terminal)

### Future Automation Opportunities

- Automatic tracking updates from carrier integration
- Automatic delivery confirmation from proof of delivery
- Automatic exception notification to customer

## Delivery Workflow

### States

- **Pending**: Delivery is pending
- **Attempted**: Delivery attempt was made but unsuccessful
- **Confirmed**: Delivery is confirmed
- **Failed**: Delivery failed

### Allowed Transitions

| From | To | Triggering Action | Responsible Role | Business Validation Rules |
| --- | --- | --- | --- | --- |
| (New) | Pending | Create delivery record | System | Shipment dispatched |
| Pending | Attempted | Record delivery attempt | Delivery, Customer | Attempt details recorded |
| Attempted | Confirmed | Confirm delivery | Delivery, Customer | Proof of delivery received |
| Attempted | Failed | Mark delivery failed | Delivery, Operations | Max attempts exceeded |
| Pending | Confirmed | Confirm delivery | Delivery, Customer | Proof of delivery received |

### Invalid Transitions

- Confirmed → Any state (confirmed is terminal)
- Failed → Any state (failed is terminal)

### Future Automation Opportunities

- Automatic delivery confirmation from carrier API
- Automatic rescheduling for failed deliveries
- Customer notification for delivery status updates

## Related Documents

- [Business Events](../technical/EVENTS.md) - Events emitted during state transitions
- [Data Ownership](../technical/DATA_OWNERSHIP.md) - Aggregate ownership boundaries
- [Dependencies](../technical/DEPENDENCIES.md) - Module dependency rules
