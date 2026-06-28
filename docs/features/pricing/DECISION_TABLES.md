# Pricing Decision Tables

## Decision Table: Resolve Price

| Customer selected | Product selected | Customer price exists | Tenant matches | Outcome |
| --- | --- | --- | --- | --- |
| Yes | Yes | Yes | Yes | Resolve customer-specific price |
| Yes | Yes | Yes | No | Reject or hide price |
| Yes | Yes | No | Yes | Block until missing-price rule is approved |
| No | Yes | Any | Any | Cannot resolve price |
| Yes | No | Any | Any | Cannot resolve price |

## Decision Table: Change Price

| Existing price exists | New price differs | Tenant matches | Outcome |
| --- | --- | --- | --- |
| Yes | Yes | Yes | Create new price version |
| Yes | No | Yes | No pricing change needed |
| Yes | Yes | No | Reject access |
| No | Yes | Yes | Create first price version |

## Decision Table: Saved Order After Price Change

| Order saved | Pricing snapshot exists | Price changed later | Outcome |
| --- | --- | --- | --- |
| Yes | Yes | Yes | Saved order price remains unchanged |
| Yes | Yes | No | Saved order price remains unchanged |
| Yes | No | Any | Invalid order state |

## Related Documents

- [V1](VERSIONS/V1.md)
- [Gherkin](pricing.feature)

