# Form System

Forms are the primary mechanism for data entry. They must be designed for speed, accuracy, and error prevention.

## Core Principles

### Label Placement
Labels should generally be positioned above the input field. This accommodates varying label lengths, localization, and ensures clear visual association, especially in dense, multi-column layouts.

### Section Grouping
Long forms must be divided into logical, clearly labeled sections (e.g., "Customer Details", "Shipping Information"). Use subtle visual dividers or spacing to separate these groups.

### Progressive Disclosure
Do not overwhelm the user with irrelevant fields. Hide secondary or conditional fields until a prior selection makes them relevant.

### Required vs. Optional Fields
*   Clearly indicate required fields (typically with a consistent symbol like an asterisk).
*   If the vast majority of fields are required, consider marking only the optional fields to reduce visual noise.

### Validation
*   Validate data inline and immediately upon field blur (when the user moves to the next field). Do not wait until form submission to surface errors.
*   Error messages must be specific, contextual, and positioned immediately adjacent to the offending field.

### Read-Only Behavior
When a form is in a "View" state, inputs should render as plain text rather than disabled form controls. This vastly improves readability.

### Auto-Save Philosophy
For complex workspaces (like draft orders), implement auto-save mechanisms to prevent data loss. Clearly communicate the save status (e.g., "Saved to Drafts") passively in the header or footer.
