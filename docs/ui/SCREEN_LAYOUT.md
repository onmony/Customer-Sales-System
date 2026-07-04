# Screen Layout

This document defines the internal composition of the central Content Area. While specific content varies, the structural arrangement must remain consistent to prioritize business context and readability.

All screens inherit the permanent [Application Shell](APPLICATION_SHELL.md). The Header, Left Navigation, Search, Footer, Right Context Panel, Toolbar, Theme, Typography, and Color Palette remain consistent across modules.

## Structural Elements

Every primary screen should be composed using the following standardized regions, stacked logically:

### Workspace Directory
*   **Location:** Second column of the Application Shell.
*   **Purpose:** Provides quick access to business entities within the current workspace.
*   **Contents:** Examples include Customer List, Pricing Sets, Order Queue, Invoice List, Product Catalog, and Inventory List.
*   **Rule:** The Workspace Directory is not application navigation. It changes per workspace while the Application Shell remains permanent.

### Header (Page Level)
*   **Location:** Top of the Content Area.
*   **Purpose:** Identifies the current entity or workflow.
*   **Contents:** Page title (e.g., "Order #10245"), primary entity status (e.g., "Draft", "Approved"), and critical top-level metadata.

### Toolbar
*   **Location:** Immediately below the Page Header.
*   **Purpose:** Houses actions applicable to the entire screen or view.
*   **Contents:** Primary actions (e.g., "Save", "Submit", "Approve"), secondary actions (e.g., "Print", "Export"), and view toggles.

### Filters (Contextual)
*   **Location:** Below the Toolbar (primarily on List or Report pages).
*   **Purpose:** Controls the data scope of the Primary Content.
*   **Contents:** Search fields, dropdown filters, date pickers, and saved view selectors.

### Primary Content
*   **Location:** The main body of the screen.
*   **Purpose:** The core data presentation and entry area.
*   **Contents:** Data tables, forms, or specialized workflow interfaces. This area commands the highest information density.

### Context Panel (Inline or Drawer)
*   **Location:** Right side (as a drawer) or integrated alongside the Primary Content.
*   **Purpose:** To provide supporting information without navigating away.
*   **Contents:** Related records (e.g., showing a customer's credit limit while entering an order).

### Summary Section
*   **Location:** Bottom or Side of the Primary Content (typically used in transactional documents like Orders or Invoices).
*   **Purpose:** Aggregation of data.
*   **Contents:** Subtotals, taxes, grand totals, and high-level summaries.

### Action Section (Footer)
*   **Location:** Fixed at the bottom of the Content Area or form.
*   **Purpose:** Final confirmation actions for a workflow.
*   **Contents:** "Save," "Submit," "Cancel," or "Next Step" buttons.

## Layout Priority

**Prioritize business context over decoration.** Layouts must maximize the space allocated to the Primary Content (especially data tables) and minimize purely structural or aesthetic whitespace.
