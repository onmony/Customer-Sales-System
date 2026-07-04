# Panel Architecture

This document defines the specific roles and behaviors of panels and overlay structures within the UI.

## Persistent Panels

### Left Navigation (Sidebar)
*   **Role:** Primary spatial anchor.
*   **Behavior:** Persistent. Used strictly for moving between major domains (Modules) of the application.

### Main Content (Center)
*   **Role:** The primary stage.
*   **Behavior:** Dynamic based on selection. Scrolls independently. This is where 90% of user interaction occurs.

### Right Context Panel
*   **Role:** Supporting actor. Provides "glanceable" context without interrupting the Main Content flow.
*   **Behavior:** Toggleable. Can be pinned open for wide screens or act as an overlay on smaller screens. Used to display related records, activity histories, or help documentation relevant to the Main Content.

### Bottom Status/Messages
*   **Role:** System health and passive information.
*   **Behavior:** A narrow, fixed bar at the absolute bottom of the screen (or Content Area). Used for system status (e.g., "Online", "Syncing"), environment indicators, or passive background task progress.

## Overlays

### Drawer Usage Principles
Drawers slide in from the edge of the screen (usually the right).
*   **Primary Use:** Complex lookups, editing secondary entities (e.g., editing a contact while on a Customer Workspace), or viewing detailed context without losing the underlying page state.
*   **Behavior:** They command focus but allow the user to maintain visual contact with the underlying primary context. Preferred over Modals for complex forms.

### Modal Usage Principles
Modals are centered overlays that obscure the rest of the screen.
*   **Primary Use:** Interruptions requiring immediate, unavoidable attention. Used for critical confirmations (e.g., "Are you sure you want to delete this order?"), fatal error messages, or very brief, isolated tasks.
*   **Behavior:** Strictly blocks all other interactions until resolved.
*   **Rule:** Use sparingly. Modals break user flow and should not be used for complex data entry or standard workflows.
