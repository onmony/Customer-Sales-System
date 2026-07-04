# UI Architecture

This document defines the structural architecture of the user interface. It establishes how the application is organized at a macro level, ensuring a consistent spatial arrangement that supports the UX and Product Foundations.

## Overall Application Structure

The application follows a predictable, fixed-frame architecture. The core navigational and contextual elements remain stable, while the central work area dynamically adapts to the current business process.

The [Application Shell](APPLICATION_SHELL.md) is permanent. Every workspace must inherit the same Header, Left Navigation, Search, Footer, Right Context Panel, Toolbar, Theme, Typography, and Color Palette.

The shell must never change between modules.

## Layout Hierarchy

The UI is divided into distinct, purpose-built regions:

1.  **Header (Top):** Global context and actions.
2.  **Sidebar (Left):** Primary navigation.
3.  **Workspace Directory (Second Column):** Workspace-specific access to business entities in the current workspace.
4.  **Content Area (Center):** The active workspace or page.
5.  **Context Panel (Right):** Contextual information related to the active content.

## Component Definitions

### Header
The header is persistently fixed at the top of the screen.
*   **Purpose:** Houses global tools that are independent of the current workspace.
*   **Contents:**
    *   **Global Search Placement:** The primary search bar is centrally located in the header for immediate access from anywhere.
    *   **Global Actions:** Quick-create actions (e.g., "New Customer", "New Order") that bypass standard navigation.
    *   **Notifications:** Alert center for system-wide or user-specific notifications.
    *   **User Profile & Settings:** Access to user preferences and logout.

### Sidebar
The sidebar is persistently fixed to the left edge of the screen.
*   **Purpose:** Primary structural navigation.
*   **Contents:** Links to major modules (Customers, Pricing, Orders, Invoices, Payments, Warehouse).
*   **Behavior:** Remains stable to preserve spatial memory. May be collapsible to maximize the content area, but never completely hidden without user intent.

### Workspace Directory
The Workspace Directory is the second column inside the application shell.
*   **Purpose:** Provides quick access to business entities within the current workspace.
*   **Contents:** Workspace-specific lists or queues such as Customer List, Pricing Sets, Order Queue, Invoice List, Product Catalog, or Inventory List.
*   **Behavior:** Changes per workspace. It is not application navigation and must not replace the stable Left Navigation.

### Content Area
The central, largest region of the screen.
*   **Purpose:** The primary stage for user work.
*   **Contents:** Displays the active Page Type or Workspace.
*   **Behavior:** This area scrolls independently of the Header and Sidebar.

### Context Panel
A secondary, toggleable panel fixed to the right edge of the screen.
*   **Purpose:** To provide supporting information without forcing the user to leave the primary Content Area.
*   **Contents:** Related records, audit logs, quick reference data, or secondary actions associated with the entity currently active in the Content Area.

### Notifications
*   **Placement:** Triggered from the Header, displayed typically as toasts (temporary, non-blocking overlays) in a consistent corner (e.g., bottom-right or top-right) or as a dedicated dropdown list in the Header for historical alerts.
*   **Behavior:** Non-disruptive unless a critical error requires immediate intervention.
