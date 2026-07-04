# Color System

The ERP color palette is strictly functional. Color is used to convey meaning, status, and hierarchy, never purely for aesthetics.

## Core Principles

### Neutral Palette Philosophy
The vast majority of the interface (backgrounds, borders, text, standard panels) must utilize a carefully graded neutral palette (grays, slates, or cool neutrals). This reduces visual noise and ensures that semantic colors (when used) immediately draw the user's attention.

## Semantic Colors

Semantic colors communicate system state or require user attention.

### Success
*   **Meaning:** An action completed successfully, or an entity is in a positive state (e.g., "Paid", "Approved").
*   **Usage:** Status badges, confirmation toasts, positive progress indicators.

### Warning
*   **Meaning:** A situation requires caution, or an entity is in an intermediate/at-risk state (e.g., "Overdue", "Pending Approval").
*   **Usage:** Alerts, highlighting fields approaching limits.

### Error
*   **Meaning:** A destructive action, a system failure, or a blocked state (e.g., "Rejected", "Validation Failed").
*   **Usage:** Form validation errors, destructive button states (e.g., "Delete"), critical system alerts.

### Information
*   **Meaning:** Neutral, helpful context or a standard processing state.
*   **Usage:** Tooltips, informational banners, "Draft" status indicators.

### Draft / Read-Only
*   **Meaning:** Data that is not yet active or cannot be edited.
*   **Usage:** Subtle, muted tones (often light gray) to indicate inactivity without drawing focus.

### Interactive States

*   **Disabled:** Highly muted and low contrast to indicate unavailability without visual clutter.
*   **Selection:** A clear, distinct highlight color (often derived from a primary brand color) to indicate a selected row, active tab, or checked item.
*   **Focus:** A high-visibility outline (typically a strong ring) to clearly indicate which element currently holds keyboard focus. Crucial for keyboard-first navigation.
*   **Hover:** A subtle shift in background or border color to indicate interactivity without causing harsh visual flashing.
