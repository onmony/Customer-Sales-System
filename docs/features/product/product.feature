Feature: Product management
  Product represents sellable items in the customer order workflow.

  Scenario: Search products in the current tenant
    Given products exist in the current tenant
    When a user searches products
    Then matching current-tenant products should be shown

  Scenario: Add a product to an order
    Given a product exists in the current tenant
    And a customer has been selected
    When a user adds the product to an order
    Then the product should appear as an order item

  Scenario: Prevent cross-tenant product access
    Given a product exists in another tenant
    When a user searches products in the current tenant
    Then the other tenant product should not be visible

