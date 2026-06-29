# Customer Decision Tables

## Purpose

Decision tables convert [Customer V1 business rules](VERSIONS/V1.md#business-rules) into explicit outcomes before Gherkin or technical design.

## Rule References

- CUS-1: Tenant Scope.
- CUS-2: Customer Identity.
- CUS-3: Customer Creation.
- CUS-4: Customer Search.
- CUS-5: Customer Selection For Order.
- CUS-6: Customer Contacts.
- CUS-7: Customer Addresses.
- CUS-8: Historical Snapshot Safety.
- CUS-9: Duplicate Customer Handling.
- CUS-10: Module Boundary.

## Decision Table 1: Customer Selection For Order

| Customer exists | Tenant matches | Customer selectable | Outcome |
| --- | --- | --- | --- |
| Yes | Yes | Yes | Allow order creation |
| Yes | No | No | Hide or reject access |
| No | N/A | No | User must create or select a customer |

## Decision Table 2: Customer Creation

| Customer exists in tenant | Required fields approved | Possible duplicate found | Outcome |
| --- | --- | --- | --- |
| No | Yes | No | Allow customer creation |
| No | Yes | Yes | Block duplicate policy decision until approved |
| No | No | Any | Block implementation until required fields are approved |
| Yes | Yes | Any | Use or update existing customer according to approved policy |

## Decision Table 3: Customer Update After Historical Documents

| Customer exists | Tenant matches | Change affects historical documents | Outcome |
| --- | --- | --- | --- |
| Yes | Yes | No | Allow update |
| Yes | Yes | Yes | Preserve historical snapshots |
| Yes | No | Any | Reject access |

## Decision Table 4: Customer Contact And Address Capture

| Customer exists | Tenant matches | Contact or address fields approved | Outcome |
| --- | --- | --- | --- |
| Yes | Yes | Yes | Allow capture or update |
| Yes | Yes | No | Block implementation of required-field validation until approved |
| Yes | No | Any | Reject access |
| No | N/A | Any | Customer must exist first |

## Decision Table 5: Cross-Tenant Customer Access

| Customer tenant | Current tenant | Action requested | Outcome |
| --- | --- | --- | --- |
| Same | Same | Search | Customer may appear in results |
| Same | Same | Select | Customer may be selected |
| Different | Current | Search | Customer must not appear |
| Different | Current | Select | Reject access |

## Related Documents

- [V1](VERSIONS/V1.md)
- [Gherkin](customer.feature)
- [API](API.md)
- [UI](UI.md)
- [Test Cases](TEST_CASES.md)
- [Checklist](CHECKLIST.md)
