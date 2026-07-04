# Button System

Buttons indicate actions. Their visual weight must perfectly correspond to the importance and impact of the action they trigger.

## Core Principles

### Primary Action
*   **Usage:** The single, most important action on a screen or in a form (e.g., "Submit Order", "Save Customer").
*   **Philosophy:** There should generally be only one primary button visible per active view. It commands the highest visual weight (e.g., a solid fill of a prominent color).

### Secondary Action
*   **Usage:** Alternative or supporting actions (e.g., "Cancel", "Export", "Print").
*   **Philosophy:** Visually subordinate to the primary action. Often styled with an outline or a subtle background fill.

### Destructive Action
*   **Usage:** Actions that result in data loss or significant, irreversible changes (e.g., "Delete Order", "Void Invoice").
*   **Philosophy:** Must be immediately recognizable (typically utilizing the semantic Error/Warning color) and usually requires a secondary confirmation step.

### Toolbar Actions
*   **Usage:** Actions affecting a table, list, or the overall workspace view.
*   **Philosophy:** Often styled as subtle, icon-heavy buttons to save space, becoming visually prominent only on hover or focus.

### Inline Actions
*   **Usage:** Actions associated with a specific row or small component (e.g., "Edit" or "Remove" on a single line item).
*   **Philosophy:** Minimal visual weight (e.g., text-only or icon-only) to avoid cluttering dense lists.

### Disabled Actions
*   **Usage:** Actions that are currently unavailable based on system state or user permissions.
*   **Philosophy:** Must look undeniably inactive (low contrast, muted). If the reason for disablement is not obvious, consider providing a tooltip explaining *why* it is disabled.
