# Pricing Effective Date Policy

## Purpose

This document defines the authoritative pricing behavior for effective dates, active pricing, future pricing, historical pricing, invoice pricing, backdated orders, overlapping prices, future edits, and customer disputes.

**Status:** Authoritative - This is the source of truth for pricing behavior.

Related documents:

- [Business Rules](../BUSINESS_RULES.md) - PR-001 to PR-011
- [Workflows](WORKFLOWS.md) - Pricing workflow states
- [Data Ownership](../technical/DATA_OWNERSHIP.md) - Aggregate ownership

## Pricing Version States

### Active Pricing

**Definition:** A pricing version that is currently in effect for order resolution.

**Effective Date Rule:** The effective date must be on or before the current date.

**Expiry Date Rule:** If an expiry date is set, the pricing version expires when the expiry date is reached. If no expiry date is set, the pricing version remains active until replaced by a new version.

**Resolution Rule:** When resolving price for an order, use the active pricing version with the latest effective date on or before the order date.

**Behavior:**
- Active pricing is used for new orders
- Active pricing is used for order modifications (if pricing is re-resolved)
- Active pricing is displayed in Customer Workspace
- Active pricing can be viewed in pricing history

### Future Pricing

**Definition:** A pricing version scheduled to become active in the future.

**Effective Date Rule:** The effective date must be in the future.

**Activation Rule:** Future pricing versions auto-activate when the effective date is reached. This is a system-triggered state transition.

**Resolution Rule:** Future pricing is NOT used for current order resolution. It will be used for orders placed on or after the effective date.

**Behavior:**
- Future pricing is visible in pricing management
- Future pricing is NOT used for order resolution
- Future pricing can be edited or cancelled before activation
- Future pricing becomes active automatically when effective date is reached

### Historical Pricing

**Definition:** A pricing version that was previously active but is no longer in effect.

**Effective Date Rule:** The effective date is in the past.

**Expiry Rule:** Historical pricing versions have expired or been replaced by newer versions.

**Resolution Rule:** Historical pricing is used for backdated orders (orders with order date in the past). Use the historical pricing version that was active on the order date.

**Behavior:**
- Historical pricing is preserved in pricing history
- Historical pricing is used for backdated order resolution
- Historical pricing cannot be modified (immutable)
- Historical pricing is used for invoice pricing snapshots

## Effective Date Rules

### Order Date Resolution

**Rule:** When resolving price for an order, find all pricing versions for the customer-product pair, filter by effective date <= order date, and select the version with the latest effective date.

**Algorithm:**
1. Find all pricing versions for customer_id and product_id
2. Filter by effective_date <= order_date
3. Filter by status = Active or Historical (exclude Future)
4. Sort by effective_date descending
5. Select the first (latest) version
6. If no customer pricing found, use standard product pricing

**Example:**
- Pricing V1: effective_date = 2024-01-01
- Pricing V2: effective_date = 2024-02-01
- Order date = 2024-01-15
- Resolution: Use Pricing V1 (latest effective date <= order date)

### Current Date Resolution

**Rule:** When resolving price for a new order without a specified order date, use the current date as the order date.

**Algorithm:**
1. Use current date as order_date
2. Apply Order Date Resolution algorithm

### Future Date Resolution

**Rule:** When resolving price for a future-dated order (order date in the future), use the pricing version that will be active on the order date.

**Algorithm:**
1. Use future order_date
2. Apply Order Date Resolution algorithm
3. If no pricing version exists for the future date, use the latest active pricing version

**Note:** Future-dated orders are rare and should require explicit user approval.

## Invoice Pricing

### Invoice Pricing Snapshot

**Rule:** Invoices must capture the pricing version ID and price at the time of invoice generation. Invoice pricing is immutable and never changes even if pricing changes later.

**Snapshot Data:**
- pricing_version_id
- price
- currency
- effective_date
- order_date
- snapshot_timestamp

**Behavior:**
- Invoice pricing is copied from order snapshots
- Invoice pricing is immutable
- Invoice pricing is used for payment calculation
- Invoice pricing is used for historical reporting

### Invoice Re-generation

**Rule:** Invoices cannot be re-generated to use new pricing. If pricing changes after invoice generation, the original invoice pricing remains unchanged.

**Correction Mechanism:**
- If pricing error is discovered, create a credit note
- Issue a new invoice with correct pricing
- Do not modify the original invoice

## Backdated Orders

### Backdated Order Definition

**Definition:** An order with an order date in the past (before the current date).

### Backdated Order Pricing

**Rule:** Backdated orders use the pricing version that was active on the order date (historical pricing).

**Algorithm:**
1. Use the backdated order_date
2. Apply Order Date Resolution algorithm
3. Use historical pricing if available
4. If no historical pricing exists, use standard product pricing

### Backdated Order Approval

**Rule:** Backdated orders require explicit user approval before creation.

**Approval Requirement:**
- User must acknowledge that historical pricing will be used
- User must provide reason for backdating
- System logs backdating event for audit

### Backdated Order Restrictions

**Rule:** Backdated orders cannot be created for dates before the customer's creation date or before the product's creation date.

**Validation:**
- order_date >= customer.created_at
- order_date >= product.created_at
- If order_date < creation date, reject with error

## Overlapping Prices

### Overlapping Price Definition

**Definition:** Overlapping prices occur when multiple pricing versions have the same effective date for the same customer-product pair.

### Overlapping Price Resolution

**Rule:** If multiple pricing versions have the same effective date, use the version with the latest created_at timestamp (most recently created).

**Algorithm:**
1. Find all pricing versions with effective_date <= order_date
2. Group by effective_date
3. For the target effective_date, select the version with latest created_at
4. Use this version for resolution

### Overlapping Price Prevention

**Rule:** The system should prevent overlapping prices during pricing creation.

**Validation:**
- When creating a new pricing version, check if effective_date already exists for customer-product pair
- If effective_date exists, reject with error
- User must either change effective_date or edit existing version

### Overlapping Price Resolution for Existing Data

**Rule:** If overlapping prices exist in historical data (created before prevention logic), use the latest created_at resolution rule.

## Future Edits

### Future Pricing Edits

**Rule:** Future pricing versions can be edited before activation.

**Allowed Edits:**
- Effective date (must remain in future)
- Price
- Expiry date
- Metadata

**Prohibited Edits:**
- Customer ID (cannot change customer)
- Product ID (cannot change product)
- Status (cannot manually activate)

**Behavior:**
- Future pricing can be edited until activation
- Future pricing can be cancelled before activation
- Future pricing cannot be edited after activation

### Active Pricing Edits

**Rule:** Active pricing versions cannot be edited. To change active pricing, create a new version.

**Behavior:**
- Active pricing is immutable
- To change price, create new version with new effective_date
- Old version becomes historical pricing

### Historical Pricing Edits

**Rule:** Historical pricing versions cannot be edited. Historical pricing is immutable.

**Behavior:**
- Historical pricing is immutable
- Historical pricing is preserved for audit
- Historical pricing is used for backdated orders

## Customer Disputes

### Dispute Scenario: Customer Claims Wrong Price

**Rule:** If customer disputes an order price, verify the pricing version used at the time of order creation.

**Investigation Process:**
1. Retrieve order snapshot (contains pricing_version_id)
2. Retrieve pricing version from pricing history
3. Verify effective_date and price
4. Compare with current pricing
5. If historical pricing was correct, explain to customer
6. If historical pricing was incorrect, create credit note and new invoice

### Dispute Scenario: Pricing Error Discovered

**Rule:** If pricing error is discovered after orders have been created, do not modify historical pricing. Use credit notes and new invoices for correction.

**Correction Process:**
1. Identify affected orders
2. Create credit notes for affected invoices
3. Issue new invoices with correct pricing
4. Document the correction reason
5. Log correction event for audit

### Dispute Scenario: Backdated Order Dispute

**Rule:** If customer disputes a backdated order price, verify the historical pricing used at the order date.

**Investigation Process:**
1. Retrieve order snapshot (contains order_date and pricing_version_id)
2. Retrieve historical pricing version
3. Verify effective_date and price
4. Explain to customer that historical pricing was used
5. If historical pricing was incorrect, use credit note correction

## Pricing Version Lifecycle

### Creation

**State:** Draft

**Rules:**
- New pricing versions start in Draft state
- Draft pricing can be edited
- Draft pricing is not used for resolution

### Activation

**State:** Active

**Rules:**
- Draft pricing can be activated if effective_date is valid
- Future pricing auto-activates when effective_date is reached
- Active pricing is used for resolution
- Active pricing cannot be edited

### Expiration

**State:** Expired

**Rules:**
- Active pricing expires when expiry_date is reached
- Expired pricing becomes historical pricing
- Expired pricing is not used for current resolution
- Expired pricing is used for backdated orders

### Cancellation

**State:** Cancelled

**Rules:**
- Draft pricing can be cancelled
- Future pricing can be cancelled before activation
- Cancelled pricing is never used for resolution
- Cancelled pricing is preserved for audit

## Rule References

This policy implements the following business rules:

- PR-001: Pricing Resolution
- PR-002: Pricing Versioning
- PR-003: Pricing Draft State
- PR-004: Pricing Activation
- PR-005: Pricing Scheduling
- PR-006: Pricing Auto-Activation
- PR-007: Pricing Expiration
- PR-008: Pricing Version Creation
- PR-009: Pricing Expiration Terminal
- PR-010: Pricing Future Terminal
- PR-011: Pricing Active Terminal

## Related Documents

- [Business Rules](../BUSINESS_RULES.md) - Business rule registry
- [Workflows](WORKFLOWS.md) - Pricing workflow states
- [Data Ownership](../technical/DATA_OWNERSHIP.md) - Aggregate ownership
- [Product Decisions](../PRODUCT_DECISIONS.md) - Customer × Product Pricing decision
