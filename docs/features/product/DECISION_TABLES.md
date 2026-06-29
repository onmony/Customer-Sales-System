# Product Decision Tables

## Purpose

Decision tables convert [Product V1 business rules](VERSIONS/V1.md#business-rules) into explicit outcomes before Gherkin or technical design.

## Rule References

- PRO-1: Tenant Scope.
- PRO-2: Product Identity.
- PRO-3: Product Creation.
- PRO-4: Product Search.
- PRO-5: Product Selection For Order.
- PRO-6: Product Unit.
- PRO-7: Snapshot Safety.
- PRO-8: Inactive Product Behavior.
- PRO-9: Pricing Boundary.
- PRO-10: Module Boundary.

## Decision Table 1: Product Selection For Order

| Product exists | Tenant matches | Product selectable | Outcome |
| --- | --- | --- | --- |
| Yes | Yes | Yes | Allow product selection |
| Yes | No | No | Hide or reject access |
| No | N/A | No | User must create or select another product |

## Decision Table 2: Product Creation

| Product exists in tenant | Required fields approved | Possible duplicate found | Outcome |
| --- | --- | --- | --- |
| No | Yes | No | Allow product creation |
| No | Yes | Yes | Block duplicate policy decision until approved |
| No | No | Any | Block implementation until required fields are approved |
| Yes | Yes | Any | Use or update existing product according to approved policy |

## Decision Table 3: Product Change After Historical Documents

| Product changed | Historical invoice exists | Snapshot exists | Outcome |
| --- | --- | --- | --- |
| Yes | Yes | Yes | Historical invoice remains unchanged |
| Yes | Yes | No | Invalid historical document state |
| Yes | No | N/A | Product can be updated if tenant matches |

## Decision Table 4: Product Unit Capture

| Product exists | Tenant matches | Unit policy approved | Outcome |
| --- | --- | --- | --- |
| Yes | Yes | Yes | Allow unit capture or update |
| Yes | Yes | No | Block implementation of unit behavior until approved |
| Yes | No | Any | Reject access |
| No | N/A | Any | Product must exist first |

## Decision Table 5: Inactive Product Behavior

| Product inactive | Historical document exists | Inactive policy approved | Outcome |
| --- | --- | --- | --- |
| Yes | Yes | Yes | Follow approved inactive policy and preserve snapshots |
| Yes | Yes | No | Preserve historical visibility but block new behavior decision |
| Yes | No | No | Block ordering behavior until policy is approved |
| No | Any | Any | Product may be selectable if tenant matches |

## Decision Table 6: Cross-Tenant Product Access

| Product tenant | Current tenant | Action requested | Outcome |
| --- | --- | --- | --- |
| Same | Same | Search | Product may appear in results |
| Same | Same | Select | Product may be selected |
| Different | Current | Search | Product must not appear |
| Different | Current | Select | Reject access |

## Related Documents

- [V1](VERSIONS/V1.md)
- [Gherkin](product.feature)
- [API](API.md)
- [UI](UI.md)
- [Test Cases](TEST_CASES.md)
- [Checklist](CHECKLIST.md)
