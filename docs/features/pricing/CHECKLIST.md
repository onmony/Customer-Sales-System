# Pricing Checklist

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

- [ ] Missing-price fallback.
- [ ] Pricing permissions.
- [ ] Effective dates.
- [ ] Change reason policy.
- [ ] Currency policy.
- [ ] Price precision and rounding policy.

## Business Readiness

- [x] Customer-specific pricing defined.
- [x] Versioned pricing defined.
- [x] History preservation defined.
- [x] Immutable order snapshot defined.
- [x] Tenant isolation defined.
- [ ] Missing-price behavior approved.

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
- [Gherkin](pricing.feature)
- [API](API.md)
- [UI](UI.md)
- [Test Cases](TEST_CASES.md)
- [Evolution](VERSIONS/EVOLUTION.md)
