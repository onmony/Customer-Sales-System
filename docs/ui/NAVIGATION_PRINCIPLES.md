# Navigation Principles

Navigation in the ERP system exists to facilitate work, not to showcase the system's architecture. It must be swift, predictable, and deeply integrated with business processes.

## Core Principles

### Search Before Navigation Where Appropriate
For a professional user, finding a specific record (customer, order, invoice) is often faster via search than clicking through hierarchical menus. Search is often the primary navigation tool.

### Sidebar Remains Stable
The primary navigational structure (typically a sidebar) must remain consistent and stable across the application. Users rely on spatial memory to locate tools; moving or hiding navigation elements disrupts this.

### Application Navigation Never Changes
Application Navigation belongs to the permanent Application Shell. It must remain the same across Customer, Pricing, Orders, Invoices, Products, Inventory, and future modules.

### Workspace Directory Changes Per Workspace
The second column is the Workspace Directory. It is not application navigation. It provides quick access to business entities inside the current workspace, such as Customer List, Pricing Sets, Order Queue, Invoice List, Product Catalog, or Inventory List.

### Predictable Navigation
Links and buttons must clearly indicate their destination or action. The system's structure should reflect the user's mental model of the business, ensuring they always know where they are and how to get elsewhere.

### Shallow Hierarchy
Avoid deep, multi-level menus. Critical workspaces and workflows should be accessible within minimal clicks from any point in the application.

### Minimal Clicks
Optimize navigation paths to require the absolute minimum number of interactions to reach a destination or initiate a workflow.

### Workspace-Based Navigation
Navigation should primarily transition users between distinct workspaces, where each workspace is dedicated to a specific business context or workflow.

### Reduce Context Switching
Navigation should not force unnecessary context shifts. If a user needs to reference related information (e.g., viewing a customer profile while creating an order), the system should provide that information within the current context, rather than forcing a navigation event.

### Navigation Follows Business Processes
The organization of menus and links should mirror the logical flow of business operations, grouping related tasks and modules intuitively.
