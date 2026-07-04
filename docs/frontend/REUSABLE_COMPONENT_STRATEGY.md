# Reusable Component Strategy

To maintain scalability and visual consistency, the React application must rely heavily on a library of shared, reusable components.

## Core Principles

### Reuse Before Create
Before building a new UI element, developers must consult the shared component library. If a suitable component exists, it must be used. If it almost fits, it should be extended. Creating bespoke UI elements within a workspace is strongly discouraged.

### Component Categories

1.  **Shared Components (Base UI):**
    *   **Definition:** Domain-agnostic UI building blocks (Buttons, Inputs, Modals, Typography).
    *   **Location:** `src/shared/components/`
    *   **Rules:** Must strictly adhere to the Design System. Must never contain business logic or API calls.

2.  **Shared Domain Components (Feature Components):**
    *   **Definition:** Reusable pieces of UI tied to the business domain (e.g., a "Customer Lookup Dropdown" or a "Status Badge" that knows how to format different order statuses).
    *   **Location:** `src/shared/components/domain/`

3.  **Workspace Components:**
    *   **Definition:** Components specific to a single business workflow (e.g., the "Order Line Item Grid").
    *   **Location:** `src/workspaces/[name]/components/`
    *   **Rules:** Not intended for reuse outside their specific workspace.

### Composition over Inheritance
Build complex UI by composing smaller, single-responsibility components together, rather than creating massive, monolithic components with dozens of configuration props.

### Component Ownership
Shared components belong to the core infrastructure. Changes to a shared component require review to ensure they do not break other workspaces relying on them.

### Versioning Philosophy
While a strict versioning system may not be required internally, changes to core shared components (like the Base Button or Base Table) must be treated as breaking changes, heavily tested across all active workspaces before merging.
