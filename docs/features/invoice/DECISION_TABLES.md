# Invoice Decision Tables

## Purpose

Decision tables convert [Invoice V1 business rules](VERSIONS/V1.md#business-rules) into explicit outcomes before Gherkin or technical design.

## Rule References

- INV-1: Tenant Scope.
- INV-2: Source Order Required.
- INV-3: Order Invoice Readiness.
- INV-4: Invoice Items Required.
- INV-5: Snapshot Required.
- INV-6: Issue Invoice.
- INV-7: Issued Invoice Immutability.
- INV-8: Historical Safety.
- INV-9: Draft Invoice Policy.
- INV-10: Invoice Numbering Policy.
- INV-11: Cancellation And Credit Policy.
- INV-12: Module Boundary.

## Decision Table 1: Create Invoice

| Saved order exists | Order has pricing snapshots | Tenant matches | Outcome |
| --- | --- | --- | --- |
| Yes | Yes | Yes | Create invoice |
| Yes | No | Yes | Block invoice creation |
| No | Any | Yes | Block invoice creation |
| Yes | Yes | No | Reject access |

## Decision Table 2: Issue Invoice

| Invoice exists | Invoice has items | Required snapshots exist | Tenant matches | Outcome |
| --- | --- | --- | --- | --- |
| Yes | Yes | Yes | Yes | Allow issue when issue preconditions are approved |
| Yes | No | Any | Yes | Block issue |
| Yes | Yes | No | Yes | Block issue |
| Yes | Yes | Yes | No | Reject access |
| No | Any | Any | Any | Block issue |

## Decision Table 3: Edit Issued Invoice

| Invoice exists | Invoice issued | Tenant matches | Outcome |
| --- | --- | --- | --- |
| Yes | Yes | Yes | Block edit |
| Yes | No | Yes | Draft behavior pending approval |
| Yes | Any | No | Reject access |

## Decision Table 4: Source Data Changes After Invoice

| Invoice issued | Source data changed later | Invoice snapshot exists | Outcome |
| --- | --- | --- | --- |
| Yes | Yes | Yes | Invoice remains unchanged |
| Yes | Yes | No | Invalid invoice state |
| No | Yes | Any | Draft behavior pending approval |

## Decision Table 5: Draft Numbering Cancellation And Credit Policies

| Policy area | Policy approved | User action requested | Outcome |
| --- | --- | --- | --- |
| Draft invoice | Yes | Create or edit draft | Follow approved policy |
| Draft invoice | No | Create or edit draft | Block implementation of draft behavior |
| Invoice numbering | Yes | Assign number | Follow approved policy |
| Invoice numbering | No | Assign number | Block implementation of numbering behavior |
| Cancellation | Yes | Cancel or void invoice | Follow approved policy |
| Cancellation | No | Cancel or void invoice | Block implementation of cancellation behavior |
| Credit note | Yes | Create credit note | Follow approved policy |
| Credit note | No | Create credit note | Block implementation of credit-note behavior |

## Decision Table 6: Cross-Tenant Invoice Access

| Invoice tenant | Current tenant | Action requested | Outcome |
| --- | --- | --- | --- |
| Same | Same | View | Invoice may be visible |
| Same | Same | Issue | Invoice may be issued if validation passes |
| Different | Current | View | Invoice must not be visible |
| Different | Current | Issue | Reject access |

## Related Documents

- [V1](VERSIONS/V1.md)
- [Gherkin](invoice.feature)
- [API](API.md)
- [UI](UI.md)
- [Test Cases](TEST_CASES.md)
- [Checklist](CHECKLIST.md)
