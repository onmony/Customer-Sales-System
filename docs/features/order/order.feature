Feature: Order creation
  Order captures a customer request and preserves resolved pricing.

  Scenario: Create order for selected customer
    Given a customer exists in the current tenant
    When a user starts an order for the customer
    Then the order should be associated with that customer

  Scenario: Add product to order
    Given an order exists for a customer
    And a product exists in the current tenant
    When a user adds the product to the order
    Then an order item should be created for the product

  Scenario: Save order with pricing snapshots
    Given an order has at least one item
    And every item has resolved pricing
    When a user saves the order
    Then every order item should store an immutable pricing snapshot

  Scenario: Block order save without pricing snapshot
    Given an order has an item without resolved pricing
    When a user saves the order
    Then the order save should be blocked

  Scenario: Prevent cross-tenant order access
    Given an order exists in another tenant
    When a user views orders in the current tenant
    Then the other tenant order should not be visible

