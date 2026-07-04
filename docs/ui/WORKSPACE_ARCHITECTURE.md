# Workspace Architecture

A "Workspace" is the defining structural concept of this ERP. It replaces the traditional concept of disconnected "screens" or "forms."

Every workspace must follow [Workspace Interaction Patterns](WORKSPACE_INTERACTION_PATTERNS.md) as the standard behavior contract for user interaction.

## Business Workspace Philosophy

A workspace is a dedicated environment designed to facilitate the completion of a single, cohesive business process from start to finish. 

**Rules:**
1.  **One workspace completes one business process.**
2.  **Users should rarely leave the workspace** until the process is completed, paused, or abandoned.
3.  **Context is preserved.** All data, tools, and related information needed for the process must be available within the workspace.

## Workspace Lifecycle

1.  **Initiation:** Triggered by an action (e.g., "Create Order") or by selecting an existing record.
2.  **Active State:** The user interacts with the workspace, entering data, reviewing context, and making decisions.
3.  **Resolution:** The workflow is finalized (e.g., "Order Submitted"). The user is guided to the next logical business step.

## Core Workspaces

### Customer Workspace
*   **Purpose:** Complete management of a customer relationship.
*   **Contains:** Customer details, contact information, interaction history, active quotes, order history, outstanding invoices, and overall account health.

### Pricing Workspace
*   **Purpose:** Establishing and approving pricing structures.
*   **Contains:** Base price lists, discount tiers, customer-specific pricing agreements, margin calculators, and approval workflows.

### Order Workspace
*   **Purpose:** The end-to-end process of capturing and validating a sales order.
*   **Contains:** Customer selection (inheriting pricing), line-item entry, inventory availability checks, credit limit validation, shipping details, and order summarization.

### Invoice Workspace
*   **Purpose:** Generating and managing billing documents.
*   **Contains:** Unbilled orders, invoice generation logic, line-item adjustments, tax calculations, payment terms, and dispatch actions.

### Payment Workspace
*   **Purpose:** Recording and allocating funds received.
*   **Contains:** Received payment entry, outstanding invoice list, allocation logic (matching payments to specific invoices), and reconciliation status.
