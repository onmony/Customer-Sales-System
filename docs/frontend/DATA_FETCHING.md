# Data Fetching Strategy

This document describes the target frontend architecture for the project.

The current implementation may not yet reflect this architecture.

The implementation will progressively align with this document beginning in Module 9.

Data fetching must be robust, performant, and provide a seamless experience, minimizing loading states.

Data Fetching: Approved implementation will be selected during Module 9.

## Read Strategy

*   **Caching:** All GET requests for entity data (Customers, Orders) must be cached by the approved data fetching implementation. Approved implementation will be selected during Module 9.
*   **Stale-While-Revalidate:** The UI should immediately display cached data when available, while silently fetching fresh data in the background and updating the UI upon completion. This eliminates perceived loading times for frequently visited workspaces.

## Background Refresh

Data in active view should automatically refresh in the background upon specific triggers (e.g., the user re-focuses the browser window, or after a specific time interval for highly volatile data like Inventory).

## Mutation Strategy

When sending data to the backend (POST/PUT/DELETE):
*   The UI must explicitly indicate a loading state (e.g., disabling the submit button, showing a progress indicator).
*   Upon a successful mutation, the frontend cache for the affected entity must be immediately invalidated, forcing a fresh fetch to ensure the UI reflects the new backend reality.

## Optimistic Updates

For non-critical, highly repetitive actions (e.g., "liking" a comment or checking a task item), the UI should optimistically update instantly before the backend responds, assuming success. 
*   **Rule:** Optimistic updates must *never* be used for financial or inventory transactions (e.g., submitting an order). The UI must wait for explicit backend confirmation for critical business data.
