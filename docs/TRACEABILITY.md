# Documentation Traceability

## Purpose

This document defines the traceability matrix for business rules, decision tables, Gherkin scenarios, APIs, implementation, and tests. Every future module should follow this structure to ensure complete traceability from business intent to implementation verification.

Related documents:

- [Rules](RULES.md)
- [Principles](PRINCIPLES.md)
- [Domain](DOMAIN.md)
- [Workflows](business/WORKFLOWS.md)

## Traceability Flow

```
Business Rule
    ↓
Decision Table
    ↓
Gherkin Scenario
    ↓
API Contract
    ↓
Implementation
    ↓
Tests
```

## Traceability Components

### 1. Business Rule

**Definition:** A business rule is a statement that defines or constrains some aspect of the business. It is intended to assert business structure or to control or influence the behavior of the business.

**Format:**
- Rule ID: Unique identifier (e.g., PR-001, ORD-001)
- Rule Name: Descriptive name
- Rule Description: Clear statement of the rule
- Business Rationale: Why this rule exists
- Related Documents: Cross-references to other documentation

**Example:**
```
Rule ID: PR-001
Rule Name: Customer Pricing Resolution
Rule Description: When resolving price for a customer-product pair, use the active pricing version with the latest effective date on or before the order date.
Business Rationale: Ensures customers receive the correct price based on when the order was placed, not when pricing was last changed.
Related Documents: PRICING.md, WORKFLOWS.md
```

### 2. Decision Table

**Definition:** A decision table is a tabular representation of business rules that shows the conditions and actions for different scenarios.

**Format:**
- Table ID: Unique identifier
- Table Name: Descriptive name
- Conditions: Input conditions
- Actions: Output actions
- Rule References: Links to business rules

**Example:**
```
Table ID: DT-PR-001
Table Name: Pricing Resolution Decision Table

Conditions:
| Customer Has Pricing? | Pricing Version Active? | Effective Date <= Order Date? |
|-----------------------|-------------------------|-------------------------------|
| Yes                   | Yes                     | Yes                           |
| Yes                   | Yes                     | No                            |
| No                    | N/A                     | N/A                           |

Actions:
| Use Customer Price | Use Standard Price | Error |
|--------------------|--------------------|-------|
| Yes                | No                 | No    |
| No                 | Yes                | No    |
| No                 | Yes                | No    |

Rule References: PR-001, PR-002
```

### 3. Gherkin Scenario

**Definition:** A Gherkin scenario is a human-readable test case that describes the behavior of the system using Given-When-Then format.

**Format:**
- Feature: High-level feature description
- Scenario: Specific scenario
- Given: Preconditions
- When: Action
- Then: Expected outcome
- Rule References: Links to business rules and decision tables

**Example:**
```gherkin
Feature: Pricing Resolution

Scenario: Use customer-specific pricing when available and active
  Given customer "CUST-001" has pricing version "V1" for product "PROD-001"
  And pricing version "V1" is active with effective date "2024-01-01"
  And order date is "2024-01-15"
  When I resolve price for customer "CUST-001" and product "PROD-001"
  Then the resolved price should be from pricing version "V1"
  And the resolved price should be $100.00

Rule References: PR-001, DT-PR-001
```

### 4. API Contract

**Definition:** An API contract defines the request/response format, validation rules, and error handling for an API endpoint.

**Format:**
- Endpoint: API path and method
- Request: Request schema
- Response: Response schema
- Validation: Validation rules
- Error Handling: Error responses
- Rule References: Links to business rules, decision tables, and Gherkin scenarios

**Example:**
```
Endpoint: POST /api/pricing/resolve

Request:
{
  "customerId": "string",
  "productId": "string",
  "orderDate": "date"
}

Response:
{
  "price": "number",
  "currency": "string",
  "pricingVersionId": "string",
  "effectiveDate": "date"
}

Validation:
- customerId: required, valid UUID
- productId: required, valid UUID
- orderDate: required, valid date, not in future

Error Handling:
- 400: Invalid request
- 404: Customer or product not found
- 500: Server error

Rule References: PR-001, PR-002, DT-PR-001, GH-PR-001
```

### 5. Implementation

**Definition:** Implementation is the actual code that fulfills the business rule, decision table, Gherkin scenario, and API contract.

**Format:**
- Module: Code module or file
- Function/Method: Specific function or method
- Logic: Implementation logic
- Rule References: Links to all upstream artifacts

**Example:**
```
Module: src/pricing/pricing-service.ts
Function: resolvePrice

Logic:
1. Find active pricing versions for customer-product pair
2. Filter by effective date <= order date
3. Sort by effective date descending
4. Return latest pricing version
5. If no customer pricing, return standard product pricing

Rule References: PR-001, PR-002, DT-PR-001, GH-PR-001, API-PR-001
```

### 6. Tests

**Definition:** Tests verify that the implementation correctly fulfills the business rule, decision table, Gherkin scenario, and API contract.

**Format:**
- Test Type: Unit, integration, or end-to-end
- Test Name: Descriptive test name
- Test Cases: Specific test cases
- Rule References: Links to all upstream artifacts

**Example:**
```
Test Type: Unit Test
Test Name: PricingService.resolvePrice

Test Cases:
- Should use customer pricing when available and active
- Should use standard pricing when customer pricing not available
- Should use latest effective date when multiple versions exist
- Should return error when customer not found
- Should return error when product not found

Rule References: PR-001, PR-002, DT-PR-001, GH-PR-001, API-PR-001, IMP-PR-001
```

## Traceability Matrix Example

| Rule ID | Rule Name | Decision Table | Gherkin | API | Implementation | Tests |
|---------|-----------|----------------|---------|-----|----------------|-------|
| PR-001 | Customer Pricing Resolution | DT-PR-001 | GH-PR-001 | API-PR-001 | IMP-PR-001 | TEST-PR-001 |
| PR-002 | Pricing Versioning | DT-PR-002 | GH-PR-002 | API-PR-002 | IMP-PR-002 | TEST-PR-002 |
| ORD-001 | Order Snapshot | DT-ORD-001 | GH-ORD-001 | API-ORD-001 | IMP-ORD-001 | TEST-ORD-001 |
| INV-001 | Invoice Immutability | DT-INV-001 | GH-INV-001 | API-INV-001 | IMP-INV-001 | TEST-INV-001 |

## Traceability Benefits

### For Business

- Clear link between business intent and implementation
- Easy to verify that all business rules are implemented
- Easy to understand impact of business rule changes

### For Development

- Clear requirements for implementation
- Easy to write tests that cover all scenarios
- Easy to debug issues by tracing back to business rules

### For Testing

- Clear test coverage based on business rules
- Easy to identify missing test cases
- Easy to verify that tests cover all scenarios

### For Maintenance

- Easy to understand impact of code changes
- Easy to update documentation when business rules change
- Easy to onboard new team members

## Traceability Best Practices

### Rule ID Assignment

- Use consistent naming convention: [Module]-[Number]
- Example: PR-001 (Pricing Rule 001), ORD-001 (Order Rule 001)
- Maintain a central registry of rule IDs

### Documentation Updates

- When a business rule changes, update all downstream artifacts
- When an implementation changes, verify that it still fulfills the business rule
- When tests fail, trace back to the business rule to understand the expected behavior

### Tooling

- Use automated tools to generate traceability reports
- Use automated tools to detect missing traceability links
- Use automated tools to verify that tests cover all business rules

## Traceability for Future Modules

Every future module should follow this traceability structure:

1. Define business rules with Rule IDs
2. Create decision tables for complex logic
3. Write Gherkin scenarios for acceptance criteria
4. Define API contracts for external interfaces
5. Implement the logic with clear references
6. Write tests that cover all scenarios

## Related Documents

- [Rules](RULES.md) - Business rule definitions
- [Workflows](business/WORKFLOWS.md) - Workflow state transitions
- [Security Decision Tables](security/DECISION_TABLES.md) - Authorization decision tables
- [Security Features](security/security.feature) - Gherkin scenarios for security
