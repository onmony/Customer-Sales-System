# State Architecture

A robust application must clearly communicate its current state to the user. This document defines the standard UI states and the rules governing transitions between them.

## UI States

### View (Read-Only)
*   **Definition:** The standard state for reviewing an existing record.
*   **Characteristics:** Data is presented for optimal readability. Form fields are rendered as plain text. Primary actions are "Edit", "Approve", or "Process".

### Create
*   **Definition:** The state for instantiating a new record.
*   **Characteristics:** Blank form fields or sensible defaults. Primary action is "Save" or "Create".

### Edit
*   **Definition:** The state for modifying an existing record.
*   **Characteristics:** Data is populated into editable form controls. Requires explicit action to save changes. Primary actions are "Save" and "Cancel".

### Draft
*   **Definition:** A saved, but incomplete or unvalidated state.
*   **Characteristics:** The record exists in the database but is not yet active in business logic (e.g., an Order that has not been submitted). Visual indicators clearly mark it as incomplete.

### Loading
*   **Definition:** The system is fetching data or processing an action.
*   **Characteristics:** Interactive elements related to the process are disabled. Skeleton screens or contextual progress indicators are displayed.

### Empty
*   **Definition:** No data exists for the requested context.
*   **Characteristics:** Must clearly state why it is empty and provide the primary action to resolve it (e.g., "Create New").

### Error
*   **Definition:** The system encountered a failure or business logic violation.
*   **Characteristics:** Highlights the specific point of failure. Preserves user input. Provides actionable guidance for resolution.

### Success
*   **Definition:** An action completed successfully.
*   **Characteristics:** Transient confirmation (e.g., a toast notification) confirming the outcome, followed immediately by a transition to the next logical state.

## Allowed Transitions (Examples)

State transitions must be logical and protect data integrity.

*   **View → Edit:** Initiated by user action.
*   **Edit → View:** Initiated by "Cancel" (discards changes) or "Save" (commits changes, transitions to Success transiently, then View).
*   **Create → Draft:** Initiated by "Save as Draft" or auto-save mechanisms.
*   **Draft → Edit:** Initiated by user action to continue working.
*   **Edit → Error:** Initiated by a failed validation upon attempting to Save. Returns user to Edit state with errors highlighted.
*   **Loading → (View, Error, Empty):** The required transitions upon completion of an async request.
