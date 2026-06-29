Feature: Invoice creation
  Invoice formalizes the amount charged for a saved order.

  Background:
    Given a tenant exists

  Scenario: Create invoice from saved order
    Given a saved order exists with pricing snapshots
    When a user creates an invoice from the order
    Then an invoice should be created for the order
    And invoice items should preserve order item pricing

  Scenario: Block invoice creation without saved order
    Given no saved order exists
    When a user creates an invoice
    Then invoice creation should be blocked

  Scenario: Block invoice creation from incomplete order
    Given an order exists without pricing snapshots
    When a user creates an invoice from the order
    Then invoice creation should be blocked

  Scenario: Issue invoice with required snapshots
    Given an invoice exists with invoice items
    And required invoice snapshots exist
    When a user issues the invoice
    Then the invoice should become issued
    And the issued invoice should become immutable

  Scenario: Prevent edits to issued invoice
    Given an invoice has been issued
    When a user attempts to edit the invoice
    Then the edit should be blocked

  Scenario: Preserve issued invoice after pricing changes
    Given an invoice has been issued
    When customer-specific pricing changes later
    Then the issued invoice should remain unchanged

  Scenario: Preserve issued invoice after customer, product, or order changes
    Given an invoice has been issued
    When customer, product, or source order information changes later
    Then the issued invoice should remain unchanged

  Scenario: Prevent cross-tenant invoice access
    Given an invoice exists in another tenant
    When a user views invoices in the current tenant
    Then the other tenant invoice should not be visible

  Scenario: Reject cross-tenant invoice issue
    Given an invoice exists in another tenant
    When a user attempts to issue the invoice in the current tenant
    Then invoice issue should be rejected

  Scenario: Do not invent invoice numbering, draft, cancellation, or credit-note behavior
    Given invoice numbering, draft, cancellation, and credit-note policies are not approved
    When implementation is planned
    Then the implementation should not invent invoice lifecycle behavior
