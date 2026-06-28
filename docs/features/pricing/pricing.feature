Feature: Customer-specific pricing
  Pricing resolves the correct product price for a customer during order creation.

  Scenario: Resolve customer-specific price
    Given a customer-specific price exists for a customer and product
    When a user adds the product to an order for the customer
    Then the order item price should resolve from the customer-specific price

  Scenario: Preserve pricing history
    Given a customer-specific price exists
    When the price is changed
    Then a new pricing version should be created
    And the previous pricing version should remain available

  Scenario: Preserve saved order price after pricing changes
    Given an order item was saved with a resolved pricing snapshot
    When the customer-specific price changes
    Then the saved order item price should remain unchanged

  Scenario: Prevent cross-tenant pricing access
    Given another tenant has pricing for a customer and product
    When a user resolves pricing in the current tenant
    Then the other tenant pricing should not be visible
    And the other tenant pricing should not be used

  Scenario: Do not invent missing-price fallback
    Given no customer-specific price exists for the customer and product
    When a user adds the product to an order
    Then the system should not invent a fallback rule
    And the order item should wait for an approved missing-price policy

