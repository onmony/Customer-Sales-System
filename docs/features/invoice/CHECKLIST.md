# Invoice Checklist

## Documentation

- [x] Purpose documented.
- [x] Scope documented.
- [x] Business rules documented.
- [x] Decision tables documented.
- [x] Gherkin documented.
- [x] API documented.
- [x] UI documented.
- [x] Test cases documented.
- [x] Version history documented.
- [x] Evolution documented.
- [x] Cross-references documented.

## Pending Decisions

- [ ] Invoice numbering.
- [ ] Draft behavior.
- [ ] Status list.
- [ ] Cancellation or credit-note policy.
- [ ] Issue preconditions.
- [ ] Partial invoicing.
- [ ] Tax display.
- [ ] Print or export format.

## Business Readiness

- [x] Invoice tenant scope defined.
- [x] Source order requirement defined.
- [x] Order invoice readiness dependency defined.
- [x] Invoice snapshot requirement defined.
- [x] Issued invoice immutability defined.
- [x] Historical safety defined.
- [ ] Invoice lifecycle policy approved.
- [ ] Invoice numbering policy approved.

## Technical Documentation Readiness

- [x] API resource boundaries documented.
- [x] UI states documented.
- [x] Validation categories documented.
- [x] Error categories documented.
- [x] Test cases mapped to acceptance scenarios.

## Implementation Gate

Implementation must not begin until pending business decisions required for the implementation path are approved.

## Related Documents

- [README](README.md)
- [Skill](SKILL.md)
- [V1](VERSIONS/V1.md)
- [Decision Tables](DECISION_TABLES.md)
- [Gherkin](invoice.feature)
- [API](API.md)
- [UI](UI.md)
- [Test Cases](TEST_CASES.md)
- [Evolution](VERSIONS/EVOLUTION.md)
