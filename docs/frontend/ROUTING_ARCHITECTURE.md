# Routing Architecture

This document describes the target frontend architecture for the project.

The current implementation may not yet reflect this architecture.

The implementation will progressively align with this document beginning in Module 9.

The routing architecture dictates how users navigate through the application and how code is loaded.

Router: Approved implementation will be selected during Module 9.

## Route Philosophy

Routing should reflect the business domain, not the technical implementation. URLs should be readable and shareable.

## Workspace Routing

Routes are mapped directly to Workspaces.
*   `/customers` -> Customer Workspace
*   `/orders` -> Order Workspace

## Nested Routing

Use nested routing to preserve UI state and layout while changing the primary content.
*   `/orders` (List of orders)
*   `/orders/new` (Create an order within the Order Workspace)
*   `/orders/:id` (View a specific order, retaining the Order Workspace context)

## Lazy Loading Philosophy

Code-splitting is mandatory at the Workspace level. When a user logs in, they should only download the code for the Dashboard. If they navigate to `/orders`, the Order Workspace code is loaded asynchronously. This ensures the initial bundle size remains small regardless of how many modules are added in the future.

## Protected vs. Public Routes

*   **Public Routes:** Strictly limited to Authentication (Login, Password Reset) and potentially a generic system status page.
*   **Protected Routes:** All business workspaces require an active, authenticated session.

## Deep Linking

URLs must act as the source of truth for the current view. If a user applies filters to a data table or opens a specific record, the URL should update (e.g., via query parameters) so that refreshing the page or sharing the link returns the exact same state.

## Navigation Consistency

Navigation changes should not destroy the global layout (Sidebar/Header). The router should only replace the Content Area.
