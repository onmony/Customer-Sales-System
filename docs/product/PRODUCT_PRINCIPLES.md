# Product Principles

These principles form the permanent philosophy of our product. Every decision must align with these tenets.

### Customer Productivity over Visual Beauty
While a pleasing aesthetic is desirable, it must never come at the cost of the user's ability to get work done. A dense, highly functional screen that saves a user five minutes is always preferred over a beautiful, sparse screen that requires extra scrolling or clicking.

### Customer Ease over Visual Novelty
Familiarity breeds efficiency. We prefer established, predictable UI patterns over innovative or novel interactions. Users should not have to learn a new paradigm to use our software; it should behave exactly as they expect.

### Workflow over Forms
Users do not want to fill out forms; they want to complete a business process. Our interfaces must be designed around the natural flow of work (e.g., from Customer to Pricing to Order), guiding the user through the logical steps rather than presenting them with generic data entry tables.

**Example**

*Wrong:*
Customer
↓
Save
↓
Pricing
↓
Save
↓
Order
↓
Save

*Right:*
Customer Workspace
↓
Pricing
↓
Order
↓
Invoice
↓
Complete Workflow

### Speed over Decoration
Performance and responsiveness are features. When forced to choose between a decorative animation and a faster load time or interaction, speed always wins. Professionals who use this software daily value immediacy above all else.

### Consistency over Creativity
Predictability across the application reduces cognitive load. A button, a table, or a workflow should behave exactly the same way everywhere. We enforce strict consistency in our design system rather than allowing creative deviations in individual workspaces.

### Keyboard before Mouse
For high-volume, daily users, forcing them to move their hands from the keyboard to the mouse breaks their flow. Core operations must be fully accessible and optimized for keyboard navigation to enable maximum efficiency.

### Useful Information over Decorative Design
The application is designed for professionals. Screen real estate is precious and should be heavily biased toward displaying relevant business data, context, and actionable insights rather than excessive whitespace or decorative elements.

### Backend owns business decisions
Business rules, pricing logic, and state transitions are strictly the domain of the backend. The UI is a faithful reflection of the backend's state, never the source of truth for business logic.

### UI explains business decisions
Every automatic decision made by the backend must be completely transparent to the user. The UI must explicitly communicate what happened, why it happened, the business rule that was applied, and what the user can do next.

### Customer Workflow First
The product is organized around end-to-end customer processes (Customer → Pricing → Order → Invoice → Payment), not technical modules or database schemas. When there is a conflict between internal architecture and the customer's workflow, the workflow always wins.

### Business Context First
Users should not have to context-switch or navigate across multiple screens to understand a situation. Every screen must immediately provide the necessary context (e.g., customer status, relevant pricing) required to make confident decisions on the spot.

### The Workspace Adapts to the Professional
Professionals spend thousands of hours using the product.

The system should learn and preserve how each user prefers to work.

Where appropriate, workspaces should remember user preferences including:

- Expanded and collapsed sections
- Panel sizes
- Table column widths
- Column order
- Sort order
- Filters
- Workspace density
- Default tabs
- Recently used actions

The goal is to reduce repetitive configuration and allow every workspace to feel personally optimized.

The workspace should adapt to the professional rather than forcing the professional to adapt to the workspace.

### The Software Should Disappear. The Business Should Remain.
Our ultimate goal is to make the tool invisible. The software should reduce operational friction to zero, allowing the user to focus entirely on their customer, their team, and their business outcomes, rather than the mechanics of operating the system.
