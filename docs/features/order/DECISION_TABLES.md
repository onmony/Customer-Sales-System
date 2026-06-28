# Order Decision Tables

## Decision Table: Save Order

| Customer selected | At least one item | Pricing snapshots present | Tenant matches | Outcome |
| --- | --- | --- | --- | --- |
| Yes | Yes | Yes | Yes | Save order |
| No | Any | Any | Any | Block save |
| Yes | No | Any | Yes | Block save |
| Yes | Yes | No | Yes | Block save |
| Yes | Yes | Yes | No | Reject access |

## Decision Table: Create Invoice From Order

| Order saved | Pricing snapshots present | Tenant matches | Outcome |
| --- | --- | --- | --- |
| Yes | Yes | Yes | Allow invoice creation |
| Yes | No | Yes | Block invoice creation |
| No | Any | Yes | Block invoice creation |
| Yes | Yes | No | Reject access |

## Related Documents

- [V1](VERSIONS/V1.md)
- [Gherkin](order.feature)

