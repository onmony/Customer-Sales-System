# Authorization Architecture

This document describes the target frontend architecture for the project.

The current implementation may not yet reflect this architecture.

The implementation will progressively align with this document beginning in Module 9.

While the backend is the absolute authority on permissions, the frontend must provide a smooth UX by respecting those permissions visually.

## Permission Philosophy

The frontend uses authorization strictly for UX purposes (hiding buttons, restricting routes), never for security. A malicious user bypassing the UI controls will still be blocked by the backend API.

## Role-Based Access vs. Permission-Based

The frontend should ideally evaluate specific permissions (e.g., `can_create_order`) rather than broad roles (e.g., `is_admin`). This makes the UI more resilient to role definition changes on the backend.

## Feature Visibility

If a user lacks permission to perform an action (e.g., deleting an invoice):
1.  **Preferred:** The UI element (e.g., the "Delete" button) is completely hidden.
2.  **Alternative:** The UI element is visible but permanently disabled, perhaps with a tooltip explaining that they lack the required permission. (Use this if hiding the button would disrupt the layout significantly).

## Route Authorization

When a user attempts to navigate to a Workspace they are not authorized to view:
1.  The routing layer intercepts the navigation. Router: Approved implementation will be selected during Module 9.
2.  The user is redirected to a standard "403 Forbidden" view or their default landing page.
3.  A message is displayed explaining the lack of access.

## Synchronization

The user's permissions and roles should be fetched upon initial login and cached. If permissions are highly dynamic, the frontend must have a strategy to refresh this context periodically or upon specific triggers.
