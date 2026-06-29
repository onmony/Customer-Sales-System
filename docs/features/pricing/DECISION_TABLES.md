# Pricing Decision Tables

## Purpose

Decision tables convert [Pricing V1 business rules](VERSIONS/V1.md#business-rules) into explicit outcomes before Gherkin or technical design.

## Rule References

- PRI-1: Tenant Scope.
- PRI-2: Customer-Specific Price.
- PRI-3: Customer And Product Required.
- PRI-4: Versioned Changes.
- PRI-5: History Preservation.
- PRI-6: Current Price Resolution.
- PRI-7: Missing Customer Price.
- PRI-8: Immutable Order Snapshot.
- PRI-9: Future Price Changes.
- PRI-10: Traceability.
- PRI-11: Pricing Boundary.

## Decision Table 1: Resolve Price For Order Item

| Customer selected | Product selected | Customer price exists | Tenant matches | Outcome |
| --- | --- | --- | --- | --- |
| Yes | Yes | Yes | Yes | Resolve customer-specific price |
| Yes | Yes | Yes | No | Reject or hide price |
| Yes | Yes | No | Yes | Block until missing-price rule is approved |
| No | Yes | Any | Any | Cannot resolve price |
| Yes | No | Any | Any | Cannot resolve price |

## Decision Table 2: Change Customer-Specific Price

| Existing price exists | New price differs | Tenant matches | Outcome |
| --- | --- | --- | --- |
| Yes | Yes | Yes | Create new price version and preserve previous version |
| Yes | No | Yes | No pricing change needed |
| Yes | Yes | No | Reject access |
| No | Yes | Yes | Create first price version |

## Decision Table 3: Saved Order After Price Change

| Order saved | Pricing snapshot exists | Price changed later | Outcome |
| --- | --- | --- | --- |
| Yes | Yes | Yes | Saved order price remains unchanged |
| Yes | Yes | No | Saved order price remains unchanged |
| Yes | No | Any | Invalid order state |

## Decision Table 4: Pricing History Availability

| Price changed | Previous version exists | Tenant matches | Outcome |
| --- | --- | --- | --- |
| Yes | Yes | Yes | Show previous version in history |
| Yes | No | Yes | Invalid pricing history state |
| Yes | Yes | No | Reject access |
| No | Yes | Yes | History remains unchanged |

## Decision Table 5: Pricing Snapshot Traceability

| Order item saved | Pricing snapshot exists | Pricing version reference exists | Outcome |
| --- | --- | --- | --- |
| Yes | Yes | Yes | Snapshot is traceable |
| Yes | Yes | No | Snapshot lacks required traceability |
| Yes | No | Any | Invalid saved order item state |

## Related Documents

- [V1](VERSIONS/V1.md)
- [Gherkin](pricing.feature)
- [API](API.md)
- [UI](UI.md)
- [Test Cases](TEST_CASES.md)
- [Checklist](CHECKLIST.md)
