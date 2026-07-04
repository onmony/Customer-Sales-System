# Table System

Data tables are the engine of the ERP. They are the primary tool for viewing, analyzing, and acting upon large sets of business data. They must be highly engineered for performance and utility.

## Core Principles

### Row Density
Tables must offer high data density. Padding within cells should be minimal. Offer a standardized "compact" view to maximize the number of rows visible on a single screen without scrolling.

### Column Behavior
*   Columns must be resizable by the user.
*   Numeric data and financial figures must be right-aligned.
*   Text and dates should be left-aligned.
*   Status badges or icons should be centered or consistently aligned.

### Sticky Headers
Table headers must remain fixed at the top of the viewport or container when scrolling through long datasets, ensuring the user never loses column context.

### Sorting and Filtering
*   Every applicable column must support sorting.
*   Robust filtering (both column-level and global table-level) is required. Active filters must be clearly displayed and easily clearable.

### Selection and Bulk Actions
Tables must support row selection (checkboxes) to enable bulk actions (e.g., approving multiple orders simultaneously).

### Inline Editing Philosophy
Support inline editing for rapid data entry where appropriate (e.g., updating quantities in an order line item table). Inline edit fields must behave predictably and save via keyboard commands (e.g., Enter).

### Pagination vs. Infinite Scroll
Use predictable pagination for large datasets to ensure system performance and allow users to reliably reference specific pages. Infinite scroll is generally avoided in transactional ERP systems where exact location and record counting are necessary.

### Keyboard Navigation
Tables must be fully navigable via keyboard. Users must be able to use arrow keys to move between cells, `Enter` to initiate inline edits, and `Space` to select rows.
