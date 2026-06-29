# Business Events

## Purpose

Business events describe meaningful changes in the operational workflow. They are not implementation messages yet. They define what the system must be able to audit, notify, integrate, and explain later.

Related documents:

- [Vision](../VISION.md)
- [Domain](../DOMAIN.md)
- [Data Ownership](DATA_OWNERSHIP.md)
- [Dependencies](DEPENDENCIES.md)
- [Customer Workspace ADR](../decisions/ADR-010-Customer-Workspace.md)

## Event Principles

- Every event is tenant-scoped.
- Events should be append-only.
- Events should carry enough context for audit and future AI explanation.
- Events should not mutate another aggregate directly.
- Consumers react to events through explicit application workflows.

## Event Catalog

| Event | Producer | Consumers | Payload | Future Integrations | Audit Implications | Notification Implications | AI Implications |
| --- | --- | --- | --- | --- | --- | --- | --- |
| CustomerCreated | Customer | Customer Workspace, Pricing, Order | tenantId, customerId, displayName, createdAt | CRM import, customer portal | Records customer origin | Notify sales owner when assigned later | Customer onboarding context |
| CustomerUpdated | Customer | Order, Invoice, Customer Workspace | tenantId, customerId, changedFields, updatedAt | CRM sync | Proves current data changed without rewriting snapshots | Notify users watching customer | Explain differences between current customer and snapshots |
| ProductCreated | Product | Pricing, Order | tenantId, productId, displayName, createdAt | Catalog import | Records product origin | Notify pricing owner when roles exist | Suggest pricing setup later |
| ProductUpdated | Product | Order, Invoice, Customer Workspace | tenantId, productId, changedFields, updatedAt | Catalog sync | Proves product changed without rewriting snapshots | Notify sales if product status changes later | Explain current product versus order snapshots |
| PricingCreated | Pricing | Order, Customer Workspace | tenantId, customerId, productId, pricingVersionId, price | Pricing import | Starts pricing history | Notify sales that pricing exists | Establishes baseline customer-price pattern |
| PricingChanged | Pricing | Order, Customer Workspace, Management | tenantId, customerId, productId, oldVersionId, newVersionId, oldPrice, newPrice | Bulk import, approval workflow | Append-only pricing history | Notify sales or management for large changes later | Future pricing suggestions and variance explanation |
| PriceResolved | Pricing | Order | tenantId, customerId, productId, pricingVersionId, price | Quotation workflow later | Proves which version was used | Usually no notification | Explain why order item price was chosen |
| OrderCreated | Order | Customer Workspace | tenantId, orderId, customerId, createdAt | Mobile sales app | Records order origin | Notify salesperson or manager later | Order intent signal |
| OrderItemAdded | Order | Pricing, Customer Workspace | tenantId, orderId, orderItemId, productId, quantity | Product recommendations | Records selected products | Usually no notification | Learn frequently ordered products |
| OrderConfirmed | Order | Invoice, Warehouse, Customer Workspace | tenantId, orderId, customerId, itemCount, confirmedAt | Warehouse planning | Locks operational order intent | Notify warehouse when module exists | Predict fulfillment risk later |
| OrderSnapshotCreated | Order | Invoice, Audit | tenantId, orderId, snapshotSummary | Audit export | Proves immutable snapshot creation | Usually no notification | Explain historical order truth |
| InvoiceGenerated | Invoice | Customer Workspace, Finance | tenantId, invoiceId, orderId, customerId, generatedAt | Accounting export later | Records invoice creation | Notify finance | Revenue workflow context |
| InvoiceIssued | Invoice | Finance, Customer Workspace, Payment | tenantId, invoiceId, orderId, issuedAt | E-invoicing, accounting export | Marks immutable commercial record | Notify customer or finance when channel exists | Explain outstanding and customer activity |
| WarehouseRequestCreated | Warehouse | Warehouse, Customer Workspace | tenantId, orderId, warehouseId, requestedAt | WMS integration | Records handoff request | Notify warehouse | Fulfillment readiness signal |
| ShipmentCreated | Shipment | Customer Workspace, Delivery | tenantId, shipmentId, orderId, carrier, createdAt | Transport integration | Records shipment plan | Notify operations | Delivery risk prediction later |
| ShipmentDispatched | Shipment | Delivery, Customer Workspace | tenantId, shipmentId, dispatchedAt | Transport tracking | Records goods movement | Notify customer or salesperson | Estimate delivery timelines |
| DeliveryConfirmed | Delivery | Customer Workspace, Payment | tenantId, deliveryId, orderId, confirmedAt | Proof of delivery | Records fulfillment completion | Notify sales and finance | Customer reliability and fulfillment patterns |
| PaymentReceived | Payment | Finance, Customer Workspace | tenantId, paymentId, invoiceId, amount, receivedAt | Accounting, bank reconciliation | Records settlement | Notify finance and sales | Payment behavior insights |

## Future Event Rules

- New events must name the aggregate that produced them.
- Events must not contain secrets or unnecessary personally identifiable information.
- Events that represent immutable business facts must never be rewritten.
- Events used for notifications should be safe to replay without duplicate business effects.
- Events used for AI should carry provenance and snapshot references.

