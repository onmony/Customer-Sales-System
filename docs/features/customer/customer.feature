Feature: Customer management
  Customer is the starting point for the order-to-delivery workflow.

  Scenario: Select a customer before creating an order
    Given a customer exists in the current tenant
    When a user selects the customer
    Then the user can start an order for that customer

  Scenario: Prevent cross-tenant customer access
    Given a customer exists in another tenant
    When a user searches customers in the current tenant
    Then the other tenant customer should not be visible

  Scenario: Preserve historical documents after customer change
    Given an invoice was issued for a customer
    When the customer information changes
    Then the issued invoice customer snapshot should remain unchanged

