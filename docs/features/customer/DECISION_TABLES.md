# Customer Decision Tables

## Decision Table: Customer Selection For Order

| Customer exists | Tenant matches | Customer selectable | Outcome |
| --- | --- | --- | --- |
| Yes | Yes | Yes | Allow order creation |
| Yes | No | No | Hide or reject access |
| No | N/A | No | User must create or select a customer |

## Decision Table: Customer Update

| Customer exists | Tenant matches | Change affects historical documents | Outcome |
| --- | --- | --- | --- |
| Yes | Yes | No | Allow update |
| Yes | Yes | Yes | Preserve historical snapshots |
| Yes | No | Any | Reject access |

## Related Documents

- [V1](VERSIONS/V1.md)
- [Gherkin](customer.feature)

