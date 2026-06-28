Feature: Invoice creation
  Invoice formalizes the amount charged for a saved order.

  Scenario: Create invoice from saved order
    Given a saved order exists with pricing snapshots
    When a user creates an invoice from the order
    Then an invoice should be created for the order
    And invoice items should preserve order item pricing

  Scenario: Block invoice creation from incomplete order
    Given an order exists without pricing snapshots
    When a user creates an invoice from the order
    Then invoice creation should be blocked

  Scenario: Prevent edits to issued invoice
    Given an invoice has been issued
    When a user attempts to edit the invoice
    Then the edit should be blocked

  Scenario: Preserve issued invoice after pricing changes
    Given an invoice has been issued
    When customer-specific pricing changes later
    Then the issued invoice should remain unchanged

  Scenario: Prevent cross-tenant invoice access
    Given an invoice exists in another tenant
    When a user views invoices in the current tenant
    Then the other tenant invoice should not be visible

