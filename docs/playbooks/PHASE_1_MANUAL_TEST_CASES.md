# Phase 1 Manual Test Cases

## Purpose

Manual test cases verify the Phase 1 implementation against the approved Customer, Product, Pricing, Order, and Invoice documentation.

These cases do not define new features.

## References

- [Customer Feature](../features/customer/customer.feature)
- [Product Feature](../features/product/product.feature)
- [Pricing Feature](../features/pricing/pricing.feature)
- [Order Feature](../features/order/order.feature)
- [Invoice Feature](../features/invoice/invoice.feature)

## Customer

| ID | Case | Expected Result |
| --- | --- | --- |
| M-CUS-001 | Search customers in Tenant A after creating customers in Tenant A and Tenant B. | Only Tenant A customers are returned. |
| M-CUS-002 | Select a Tenant A customer for order creation. | Selection succeeds and order creation can start. |
| M-CUS-003 | Attempt to select a Tenant B customer from Tenant A. | Selection is rejected. |
| M-CUS-004 | Update customer after creating a customer snapshot. | Snapshot remains unchanged. |
| M-CUS-005 | Attempt duplicate customer creation while duplicate policy is not approved. | Creation is blocked by duplicate policy gate. |

## Product

| ID | Case | Expected Result |
| --- | --- | --- |
| M-PRO-001 | Search products in Tenant A after creating products in Tenant A and Tenant B. | Only Tenant A products are returned. |
| M-PRO-002 | Select a Tenant A product for an order item. | Selection succeeds. |
| M-PRO-003 | Attempt to select a Tenant B product from Tenant A. | Selection is rejected. |
| M-PRO-004 | Update product after creating a product snapshot. | Snapshot remains unchanged. |
| M-PRO-005 | Attempt to select an inactive product while inactive policy is not approved. | Selection is blocked by inactive policy gate. |

## Pricing

| ID | Case | Expected Result |
| --- | --- | --- |
| M-PRI-001 | Create a customer-specific price and resolve it for the matching customer and product. | Resolved price matches current customer-specific price. |
| M-PRI-002 | Change a customer-specific price. | A new version is created and previous version remains in history. |
| M-PRI-003 | Create an order item pricing snapshot, then change price. | Snapshot price remains unchanged and traceable to original version. |
| M-PRI-004 | Resolve pricing in Tenant A when only Tenant B pricing exists. | Tenant B pricing is not used. |
| M-PRI-005 | Resolve pricing when no customer-specific price exists. | Resolution is blocked by missing-price policy gate. |

## Order

| ID | Case | Expected Result |
| --- | --- | --- |
| M-ORD-001 | Create order from selected customer. | Order is associated with that customer and tenant. |
| M-ORD-002 | Create order without customer. | Creation is blocked. |
| M-ORD-003 | Add selected product to order. | Order item is created. |
| M-ORD-004 | Save order without items. | Save is blocked. |
| M-ORD-005 | Save order with item but no pricing snapshot. | Save is blocked. |
| M-ORD-006 | Save order with pricing snapshots. | Order is saved and invoice-ready. |
| M-ORD-007 | Change customer, product, and price after order save. | Saved order snapshots remain unchanged. |

## Invoice

| ID | Case | Expected Result |
| --- | --- | --- |
| M-INV-001 | Create invoice from saved invoice-ready order. | Invoice is created with copied order item snapshots. |
| M-INV-002 | Create invoice without saved order. | Creation is blocked. |
| M-INV-003 | Create invoice from incomplete order. | Creation is blocked. |
| M-INV-004 | Issue invoice with required snapshots. | Invoice becomes issued and immutable. |
| M-INV-005 | Attempt to edit issued invoice. | Edit is blocked. |
| M-INV-006 | Change customer, product, pricing, or source order after invoice issue. | Issued invoice remains unchanged. |
| M-INV-007 | Attempt draft, numbering, cancellation, or credit-note action while policy is not approved. | Action is blocked by lifecycle policy gate. |

## Smoke Test

| ID | Case | Expected Result |
| --- | --- | --- |
| M-SMOKE-001 | Create Customer -> Product -> Pricing -> Order -> Invoice -> Issue Invoice. | Flow completes with an issued immutable invoice. |

## Regression Focus

| ID | Case | Expected Result |
| --- | --- | --- |
| M-REG-001 | Repeat cross-tenant checks across all modules. | Tenant data remains isolated. |
| M-REG-002 | Repeat source-change checks after order save and invoice issue. | Historical snapshots remain unchanged. |
| M-REG-003 | Repeat unresolved-policy checks. | Policy gates remain active. |
