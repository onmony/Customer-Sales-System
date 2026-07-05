# APPLICATION_SHELL.md

## Philosophy

The Application Shell is the permanent structure of the ERP.

Every workspace (Dashboard, Customer, Pricing, Order, Invoice, Payment, Inventory, Reports, etc.) must use the same shell.

Only the workspace content changes.

The shell must never change.

---

# Responsive First

The entire application must be designed responsively.

Avoid fixed pixel-based layouts except where technically required (hairline borders, icon strokes).

Use:

* `rem` for typography
* `rem` for spacing
* `%` for proportional widths
* `fr` (CSS Grid) for flexible layouts
* `minmax()` for responsive columns
* `clamp()` for typography and spacing
* `vh` / `dvh` for viewport height
* `vw` only where appropriate

The UI should naturally adapt to different monitor sizes, resolutions, browser zoom levels, and operating-system scaling.

---

# Application Shell

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                              GLOBAL HEADER                                  │
├──────┬───────────────────────────────────────────────────────────────────────┤
│      │                      WORKSPACE HEADER                                │
│ App  ├──────────────┬────────────────────────────┬───────────────────────────┤
│ Nav  │ Workspace    │ Main Workspace             │ Context Panel             │
│      │ Directory    │                            │                           │
│      │              │                            │                           │
├──────┴──────────────┴────────────────────────────┴───────────────────────────┤
│                         Dynamic Status Bar (optional)                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

# 1. Global Header

Always spans the full browser width.

Contains:

* Logo
* Global Search
* Notifications
* Settings
* User Profile

This header never changes.

Global Search never moves between screens.

---

# 2. Application Navigation

Position:

Left side.

Runs from below the Global Header to the Dynamic Status Bar.

Contains:

* Dashboard
* Customers
* Pricing
* Products
* Orders
* Invoices
* Payments
* Inventory
* Reports
* Settings

The navigation is identical across every workspace.

Only the active module changes.

---

# Navigation States

Supports:

* Expanded
* Icon Only
* Hidden (future mobile support)

The selected state is remembered per user.

---

# 3. Workspace Header

Starts immediately after the Application Navigation.

Runs to the far right.

Contains:

* Breadcrumb
* Workspace Name
* Current Record
* Status Badge
* Workspace-specific Actions

Examples

Customer

```
Customers > Acme Corporation

[Edit]
[Pricing]
[Create Order]
[Invoice]
```

Pricing

```
Pricing > Global Pricing 2024

[Edit]
[Approve]
[Activate]
```

Orders

```
Orders > ORD-99201

[Save]
[Approve]
[Dispatch]
```

Only this header changes between workspaces.

---

# 4. Workspace Body

Uses a three-column responsive grid.

```
Workspace Directory

Main Workspace

Context Panel
```

The Main Workspace always occupies the remaining available space.

---

# Workspace Directory

Examples:

* Customer List
* Pricing Sets
* Orders
* Products

Supports:

* Expand
* Collapse
* Resize

---

# Main Workspace

Contains the business workflow.

Must always receive the largest available space.

Never contain global navigation.

---

# Context Panel

Provides supporting information.

Examples:

* AI Insights
* Timeline
* Business Rules
* Status
* Recommendations
* Related Information

Supports:

* Expand
* Collapse
* Resize

---

# Dynamic Status Bar

No permanent footer.

Instead use a dynamic status bar.

Visible only when useful.

Examples:

* Saving...
* Synchronizing...
* Offline
* Unsaved Changes
* Import Running
* Background Job
* Connected

Otherwise it remains hidden.

---

# Responsive Grid Rules

Application Navigation

* Icon mode by default
* Expandable
* Collapsible

Workspace Directory

* Responsive width
* User resizable
* User collapsible

Main Workspace

* Always expands
* Never fixed width

Context Panel

* Responsive width
* User resizable
* User collapsible

When any side panel collapses, the Main Workspace automatically expands.

---

# Workspace Personalization

Every user can customize:

Navigation

* Expanded
* Collapsed

Workspace Directory

* Width
* Visibility

Context Panel

* Width
* Visibility

Accordions

* Expanded
* Collapsed

Tables

* Density
* Columns
* Sorting
* Filters

KPIs

* Visible
* Hidden
* Order

All preferences are automatically restored when the user returns.

---

# Accordion Philosophy

Every major section inside a workspace should support expansion and collapse.

Examples:

Customer

* Customer Overview
* KPIs
* Transaction History
* Pricing
* Contracts
* Notes
* Timeline

Pricing

* Pricing Matrix
* Rules
* Version History
* Audit Trail

Orders

* Customer
* Order Items
* Taxes
* Payments
* Shipping
* Timeline

The system remembers the user's preferred expansion state.

---

# Consistency Rules

Every workspace must share:

* Global Header
* Application Navigation
* Workspace Header
* Dynamic Status Bar
* Search Position
* Typography
* Colors
* Icons
* Keyboard Shortcuts
* Navigation Behavior

Only the business content changes.

---

# Responsive Principles

* Build using CSS Grid and Flexbox.
* Prefer `fr`, `%`, `minmax()`, and `clamp()` over fixed dimensions.
* Use `rem` for typography and spacing.
* Design should adapt gracefully to browser zoom, high-DPI displays, and different monitor sizes.
* Avoid fixed heights for content areas; let them grow and scroll naturally where appropriate.
* Never assume a specific screen resolution.

---

## Golden Rule

**The application shell is permanent.**

Users should always know:

* Where they are.
* Where to navigate.
* Where to search.
* Where to act.
* Where to find context.

Regardless of which workspace they are using, the structure should remain identical so they build muscle memory and work efficiently.
