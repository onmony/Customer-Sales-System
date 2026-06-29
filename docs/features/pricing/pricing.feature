Feature: Customer-specific pricing
  Pricing resolves the correct product price for a customer during order creation.

  Background:
    Given a tenant exists
    And a customer exists in the tenant
    And a product exists in the tenant

  Scenario: Resolve customer-specific price
    Given a customer-specific price exists for a customer and product
    When a user adds the product to an order for the customer
    Then the order item price should resolve from the customer-specific price
    And the resolved price should be visible before the order is saved

  Scenario: Preserve pricing history
    Given a customer-specific price exists
    When the price is changed
    Then a new pricing version should be created
    And the previous pricing version should remain available

  Scenario: Preserve saved order price after pricing changes
    Given an order item was saved with a resolved pricing snapshot
    When the customer-specific price changes
    Then the saved order item price should remain unchanged
    And the saved order item should remain traceable to the original pricing version

  Scenario: Save order item with pricing snapshot
    Given a customer-specific price exists for a customer and product
    And the product was added to an order for the customer
    When the order is saved
    Then the order item should store an immutable pricing snapshot
    And the snapshot should include the resolved price
    And the snapshot should identify the pricing version used

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

  Scenario: Reject pricing resolution without customer
    Given no customer has been selected
    When a user tries to resolve pricing for a product
    Then pricing should not be resolved

  Scenario: Reject pricing resolution without product
    Given a customer has been selected
    When a user tries to resolve pricing without a product
    Then pricing should not be resolved
