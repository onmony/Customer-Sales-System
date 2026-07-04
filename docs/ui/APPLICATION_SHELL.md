# Application Shell

The Command Center defines the official ProOS Application Shell.

The Application Shell is permanent.

Every workspace inherits the same shell. The shell must never change between modules.

## Permanent Layout

```text
+--------------------------------------------------------------------------+
| Header (Always Same)                                                     |
+------+------------------------------+------------------------------------+
|      |                              |                                    |
| App  | Workspace Directory          |                                    |
| Nav  |                              |                                    |
|      +------------------------------+ Business Context                   |
|      |                              |                                    |
|      | Primary Workspace            |                                    |
|      |                              |                                    |
|      |                              |                                    |
+------+------------------------------+------------------------------------+
| Footer (Always Same)                                                     |
+--------------------------------------------------------------------------+
```

## Application Shell Rule

Every workspace must inherit the same:

*   Header.
*   Left Navigation.
*   Search.
*   Footer.
*   Right Context Panel.
*   Toolbar.
*   Theme.
*   Typography.
*   Color Palette.

These elements belong to the application shell.

They are not redesigned per workspace.

The shell must never change between modules.

## Workspace Directory Rule

The second column belongs to the workspace.

It is not application navigation.

It provides quick access to business entities within the current workspace.

Examples:

*   Customer -> Customer List.
*   Pricing -> Pricing Sets.
*   Orders -> Order Queue.
*   Invoices -> Invoice List.
*   Products -> Product Catalog.
*   Inventory -> Inventory List.

The Workspace Directory changes depending on the module.

The Application Navigation does not.

## Brand Color Rule

ProOS has one Primary Brand Color.

The indigo used in the Command Center is the official ProOS brand color.

Do not introduce darker blue, navy, or different navigation colors in individual workspaces.

Every module should immediately look like ProOS.

The exact brand token must be captured in the design token system before implementation.

## Workspace Refinement Rule

Refine all workspaces to inherit the Command Center shell.

Do not redesign the application per workspace.

The only thing that changes between workspaces is the business content inside the workspace and the Workspace Directory for that business context.

## Permanent Principles

*   The Application Shell is permanent.
*   Application Navigation never changes between modules.
*   The Workspace Directory changes per workspace.
*   The Workspace Directory is not application navigation.
*   Every module uses the same ProOS visual identity.
*   Business content changes; the shell does not.
