Feature: Order creation
  Order captures a customer request and preserves resolved pricing.

  Background:
    Given a tenant exists

  Scenario: Create order for selected customer
    Given a customer exists in the current tenant
    When a user starts an order for the customer
    Then the order should be associated with that customer

  Scenario: Block order creation without customer
    Given no customer has been selected
    When a user starts an order
    Then order creation should be blocked

  Scenario: Add product to order
    Given an order exists for a customer
    And a product exists in the current tenant
    When a user adds the product to the order
    Then an order item should be created for the product

  Scenario: Block order save without items
    Given an order exists for a customer
    And the order has no items
    When a user saves the order
    Then the order save should be blocked

  Scenario: Save order with pricing snapshots
    Given an order has at least one item
    And every item has resolved pricing
    When a user saves the order
    Then every order item should store an immutable pricing snapshot

  Scenario: Block order save without pricing snapshot
    Given an order has an item without resolved pricing
    When a user saves the order
    Then the order save should be blocked

  Scenario: Prepare saved order for invoice creation
    Given an order is saved with required pricing snapshots
    When a user creates an invoice from the order
    Then invoice creation should be allowed

  Scenario: Preserve saved order after source changes
    Given an order was saved with required snapshots
    When customer, product, or pricing information changes later
    Then the saved order should remain unchanged

  Scenario: Prevent cross-tenant order access
    Given an order exists in another tenant
    When a user views orders in the current tenant
    Then the other tenant order should not be visible

  Scenario: Reject cross-tenant order save
    Given an order exists in another tenant
    When a user attempts to save the order in the current tenant
    Then order save should be rejected

  Scenario: Do not invent draft, edit, status, or cancellation behavior
    Given draft, edit, status, and cancellation policies are not approved
    When implementation is planned
    Then the implementation should not invent order lifecycle behavior
