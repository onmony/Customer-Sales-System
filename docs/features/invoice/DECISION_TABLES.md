# Invoice Decision Tables

## Decision Table: Create Invoice

| Saved order exists | Order has pricing snapshots | Tenant matches | Outcome |
| --- | --- | --- | --- |
| Yes | Yes | Yes | Create invoice |
| Yes | No | Yes | Block invoice creation |
| No | Any | Yes | Block invoice creation |
| Yes | Yes | No | Reject access |

## Decision Table: Edit Invoice

| Invoice exists | Invoice issued | Tenant matches | Outcome |
| --- | --- | --- | --- |
| Yes | Yes | Yes | Block edit |
| Yes | No | Yes | Draft behavior pending approval |
| Yes | Any | No | Reject access |

## Decision Table: Source Data Changes After Invoice

| Invoice issued | Source data changed later | Invoice snapshot exists | Outcome |
| --- | --- | --- | --- |
| Yes | Yes | Yes | Invoice remains unchanged |
| Yes | Yes | No | Invalid invoice state |
| No | Yes | Any | Draft behavior pending approval |

## Related Documents

- [V1](VERSIONS/V1.md)
- [Gherkin](invoice.feature)

