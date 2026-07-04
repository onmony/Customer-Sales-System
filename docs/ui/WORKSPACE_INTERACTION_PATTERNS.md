# Workspace Interaction Patterns

Workspace Interaction Patterns define how users interact with every workspace.

This document does not define colors, React implementation, styling, backend behavior, database behavior, or business modules.

It is the permanent interaction contract for the ERP.

## 1. Philosophy

A professional should immediately understand how every workspace behaves.

Learning one workspace should automatically teach users how every other workspace behaves.

Interaction consistency is more valuable than visual creativity.

## 2. Workspace Sections

Every workspace should be composed from reusable section types.

Examples:

*   Overview.
*   Business Metrics.
*   Primary Business Data.
*   Secondary Business Data.
*   Business Context.
*   Alerts.
*   Timeline.
*   Notes.
*   Recommended Next Action.
*   AI Insights.

These are interaction patterns, not fixed layouts.

## 3. Workspace Accordion

Every informational section supports standard accordion behavior:

*   Expanded.
*   Collapsed.

Use only standard disclosure controls.

Expanded:

```text
v Section Name
```

Collapsed:

```text
> Section Name
```

Do not invent custom expand/collapse controls.

The same interaction must exist everywhere.

## 4. Expand / Collapse Rules

### Always Expanded

*   Primary business table.
*   Primary workflow.
*   Primary actions.

### May Collapse

*   Customer Overview.
*   Business Metrics.
*   Pricing.
*   Contracts.
*   Timeline.
*   History.
*   Notes.
*   AI Insights.
*   Business Alerts.
*   Operational Log.
*   Credit Information.

Users control these preferences where personalization is supported.

## 5. Persistent Workspace State

Workspace remembers:

*   Expanded sections.
*   Collapsed sections.
*   Panel sizes.
*   Splitter positions.
*   Table heights.
*   Column widths.
*   Column order.
*   Sorting.
*   Filters.
*   Density.
*   Preferred tabs.
*   Workspace layout.

Preferences belong only to the logged-in user.

## 6. Transaction First Principle

Operational work always receives the largest portion of the workspace.

Supporting information must never reduce the visibility of:

*   Orders.
*   Invoices.
*   Payments.
*   Pricing.
*   Inventory.
*   Warehouse.

Business transactions are the primary purpose of the application.

## 7. Progressive Disclosure

Show the information required for today's work.

Allow professionals to reveal additional detail only when needed.

Avoid overwhelming first-time users.

Avoid hiding operational information from experienced users.

## 8. Context Panel Behaviour

The right context panel follows the same interaction rules.

Each section may be expanded or collapsed.

Recommended order:

*   Status.
*   Business Alerts.
*   Recommended Next Action.
*   Recent Activity.
*   Timeline.
*   AI Insights.

The context panel should explain decisions, not duplicate data.

## 9. Workspace Personalization Integration

Interaction patterns integrate with Workspace Personalization.

Every workspace should remember:

*   Expanded sections.
*   Collapsed sections.
*   Preferred density.
*   Preferred layout.
*   Preferred panel widths.

No repeated configuration should be required.

## 10. Keyboard Behaviour

Accordion sections must be fully keyboard accessible.

Examples:

*   Arrow Keys.
*   Enter.
*   Space.
*   Tab.

Keyboard users must have the same capabilities as mouse users.

## 11. Future Behaviour

The interaction model reserves support for future capabilities without requiring redesign.

Examples:

*   Resizable sections.
*   Drag-and-drop section ordering.
*   Pinned sections.
*   Favourite sections.
*   Workspace templates.
*   Saved workspace layouts.
*   Collaborative workspace templates.

This document defines the architectural direction only. It does not define implementation.

## 12. Permanent Principles

These principles are permanent:

*   The workspace adapts to the professional.
*   Business transactions receive the highest visual priority.
*   Every workspace behaves consistently.
*   Interaction patterns are reusable across every module.
*   Progressive disclosure reduces cognitive load.
*   Workspace preferences are remembered.
*   Business context supports operational work rather than replacing it.
