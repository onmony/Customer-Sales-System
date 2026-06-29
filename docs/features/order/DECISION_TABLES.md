# Order Decision Tables

## Purpose

Decision tables convert [Order V1 business rules](VERSIONS/V1.md#business-rules) into explicit outcomes before Gherkin or technical design.

## Rule References

- ORD-1: Tenant Scope.
- ORD-2: Customer Required.
- ORD-3: Order Creation From Customer.
- ORD-4: Items Required.
- ORD-5: Product Required.
- ORD-6: Quantity Required.
- ORD-7: Pricing Resolution Required.
- ORD-8: Pricing Snapshot Required.
- ORD-9: Customer And Product Snapshot Safety.
- ORD-10: Historical Safety.
- ORD-11: Invoice Readiness.
- ORD-12: Draft, Edit, Status, And Cancellation Policy.
- ORD-13: Module Boundary.

## Decision Table 1: Create Order

| Customer selected | Customer tenant matches | Current tenant exists | Outcome |
| --- | --- | --- | --- |
| Yes | Yes | Yes | Allow order creation |
| Yes | No | Yes | Reject access |
| No | N/A | Yes | Block order creation |
| Any | Any | No | Block order creation |

## Decision Table 2: Save Order

| Customer selected | At least one item | Pricing snapshots present | Tenant matches | Outcome |
| --- | --- | --- | --- | --- |
| Yes | Yes | Yes | Yes | Save order |
| No | Any | Any | Any | Block save |
| Yes | No | Any | Yes | Block save |
| Yes | Yes | No | Yes | Block save |
| Yes | Yes | Yes | No | Reject access |

## Decision Table 3: Create Invoice From Order

| Order saved | Pricing snapshots present | Tenant matches | Outcome |
| --- | --- | --- | --- |
| Yes | Yes | Yes | Allow invoice creation |
| Yes | No | Yes | Block invoice creation |
| No | Any | Yes | Block invoice creation |
| Yes | Yes | No | Reject access |

## Decision Table 4: Saved Order After Source Changes

| Order saved | Source data changed later | Required snapshots exist | Outcome |
| --- | --- | --- | --- |
| Yes | Yes | Yes | Saved order remains unchanged |
| Yes | Yes | No | Invalid saved order state |
| Yes | No | Yes | Saved order remains unchanged |

## Decision Table 5: Draft Edit Status And Cancellation Policy

| Policy area | Policy approved | User action requested | Outcome |
| --- | --- | --- | --- |
| Draft order | Yes | Create or update draft | Follow approved policy |
| Draft order | No | Create or update draft | Block implementation of draft behavior |
| Saved order edit | Yes | Edit saved order | Follow approved policy |
| Saved order edit | No | Edit saved order | Block implementation of edit behavior |
| Cancellation | Yes | Cancel order | Follow approved policy |
| Cancellation | No | Cancel order | Block implementation of cancellation behavior |
| Status | Yes | Change status | Follow approved policy |
| Status | No | Change status | Block implementation of status behavior |

## Decision Table 6: Cross-Tenant Order Access

| Order tenant | Current tenant | Action requested | Outcome |
| --- | --- | --- | --- |
| Same | Same | View | Order may be visible |
| Same | Same | Save | Order may be saved if validation passes |
| Different | Current | View | Order must not be visible |
| Different | Current | Save | Reject access |

## Related Documents

- [V1](VERSIONS/V1.md)
- [Gherkin](order.feature)
- [API](API.md)
- [UI](UI.md)
- [Test Cases](TEST_CASES.md)
- [Checklist](CHECKLIST.md)
