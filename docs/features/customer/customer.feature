Feature: Customer management
  Customer is the starting point for the order-to-delivery workflow.

  Background:
    Given a tenant exists

  Scenario: Search for a customer in the current tenant
    Given customers exist in the current tenant
    When a user searches customers
    Then matching current-tenant customers should be shown

  Scenario: Create customer when the customer does not exist
    Given no matching customer exists in the current tenant
    And required customer fields have been approved
    When a user creates a customer
    Then the customer should be created in the current tenant

  Scenario: Select a customer before creating an order
    Given a customer exists in the current tenant
    When a user selects the customer
    Then the user can start an order for that customer

  Scenario: Prevent cross-tenant customer access
    Given a customer exists in another tenant
    When a user searches customers in the current tenant
    Then the other tenant customer should not be visible

  Scenario: Reject cross-tenant customer selection
    Given a customer exists in another tenant
    When a user attempts to select that customer in the current tenant
    Then customer selection should be rejected

  Scenario: Preserve historical documents after customer change
    Given an invoice was issued for a customer
    When the customer information changes
    Then the issued invoice customer snapshot should remain unchanged

  Scenario: Do not invent duplicate customer policy
    Given a possible duplicate customer is found
    When a user creates a customer
    Then the system should not invent duplicate handling behavior
    And customer creation should wait for an approved duplicate policy

  Scenario: Do not invent required customer fields
    Given required customer fields have not been approved
    When implementation is planned
    Then the implementation should not invent mandatory customer fields
