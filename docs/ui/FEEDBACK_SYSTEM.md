# Feedback System

The system must constantly communicate its status to the user. Clear, non-disruptive feedback builds trust and prevents user errors.

## Core Principles

### Success Messages
*   **Usage:** Confirming a completed action (e.g., "Order Saved").
*   **Philosophy:** Transient and non-blocking. Should appear clearly (e.g., as a toast notification) and dismiss automatically after a few seconds, allowing the user to immediately continue working.

### Warning Messages
*   **Usage:** Alerting the user to potential issues or impending limits (e.g., "Customer is near credit limit").
*   **Philosophy:** Highly visible but ideally non-blocking unless action is strictly required. Often displayed as inline banners near the relevant context.

### Error Messages
*   **Usage:** Communicating a failed action or system fault.
*   **Philosophy:** Must explicitly state what failed, why it failed (in business terms), and how the user can fix it. Must never discard user input.

### Progress Indicators
*   **Usage:** During data fetches or processing actions.
*   **Philosophy:** Avoid generic spinners for long operations. Use deterministic progress bars where possible, or contextual text (e.g., "Generating Invoice...") to assure the user the system is active, not frozen.

### Toasts vs. Notifications
*   **Toasts:** Ephemeral, small pop-ups for immediate, transient feedback (e.g., "Saved"). They do not require dismissal.
*   **Notifications (Alert Center):** Persistent alerts that require review or action (e.g., "Approval required for Order #100"). Stored in a central hub.

### Confirmation Philosophy
Minimize repetitive confirmations. Do not ask "Are you sure you want to save?" for standard actions. Reserve explicit confirmation dialogs (Modals) strictly for destructive or highly consequential actions (e.g., "Void Payment").

### Undo Philosophy
Where technically feasible, prefer an "Undo" pattern over a confirmation prompt. For example, allowing a user to delete a row with a toast that says "Row deleted [Undo]" is faster and less disruptive than forcing them to confirm the deletion beforehand.
