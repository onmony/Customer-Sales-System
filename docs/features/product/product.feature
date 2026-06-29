Feature: Product management
  Product represents sellable items in the customer order workflow.

  Background:
    Given a tenant exists

  Scenario: Search products in the current tenant
    Given products exist in the current tenant
    When a user searches products
    Then matching current-tenant products should be shown

  Scenario: Create product when the product does not exist
    Given no matching product exists in the current tenant
    And required product fields have been approved
    When a user creates a product
    Then the product should be created in the current tenant

  Scenario: Add a product to an order
    Given a product exists in the current tenant
    And a customer has been selected
    When a user adds the product to an order
    Then the product should appear as an order item

  Scenario: Prevent cross-tenant product access
    Given a product exists in another tenant
    When a user searches products in the current tenant
    Then the other tenant product should not be visible

  Scenario: Reject cross-tenant product selection
    Given a product exists in another tenant
    When a user attempts to add that product to an order in the current tenant
    Then product selection should be rejected

  Scenario: Preserve historical documents after product change
    Given an invoice was issued with a product snapshot
    When the product information changes
    Then the issued invoice product snapshot should remain unchanged

  Scenario: Do not invent inactive product behavior
    Given a product is inactive
    And inactive product behavior has not been approved
    When a user tries to add the product to an order
    Then the system should not invent inactive product behavior
    And product selection should wait for an approved inactive product policy

  Scenario: Do not invent required product fields
    Given required product fields have not been approved
    When implementation is planned
    Then the implementation should not invent mandatory product fields
