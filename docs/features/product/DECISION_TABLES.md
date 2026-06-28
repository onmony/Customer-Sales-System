# Product Decision Tables

## Decision Table: Product Selection For Order

| Product exists | Tenant matches | Product selectable | Outcome |
| --- | --- | --- | --- |
| Yes | Yes | Yes | Allow product selection |
| Yes | No | No | Hide or reject access |
| No | N/A | No | User must create or select another product |

## Decision Table: Product Change After Invoice

| Product changed | Historical invoice exists | Snapshot exists | Outcome |
| --- | --- | --- | --- |
| Yes | Yes | Yes | Historical invoice remains unchanged |
| Yes | Yes | No | Invalid historical document state |
| Yes | No | N/A | Product can be updated if tenant matches |

## Related Documents

- [V1](VERSIONS/V1.md)
- [Gherkin](product.feature)

