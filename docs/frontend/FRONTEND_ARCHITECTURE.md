# Frontend Architecture

This document defines the overarching structural philosophy of the React frontend application. The frontend exists solely to execute the UX and Design Systems, and to interface with the backend source of truth.

## Core Principles

### 1. Business Logic Belongs in the Backend
The React application is a presentation layer. It must not calculate prices, validate complex cross-entity business rules, or determine inventory availability. It exists to render data provided by the API and to capture user intent.

### 2. Layered Architecture
The application is strictly layered to enforce a separation of concerns:
*   **Presentation Layer (Components/Workspaces):** Handles UI rendering and capturing user input.
*   **State Management Layer:** Manages transient UI state and caches server data.
*   **Service/API Layer:** Manages all communication with the backend.

### 3. Separation of Concerns
UI components should be "dumb" where possible, receiving data and callbacks via props. Complex logic regarding data fetching or state mutation should be extracted into custom hooks or externalized to the state/service layers.

### 4. Feature Isolation (Workspaces)
The application is organized around "Workspaces" (e.g., Customer, Order) rather than technical concerns. The code for the Order workspace should be isolated from the Customer workspace, interacting only through shared infrastructure or global state. This ensures that adding a new module does not require restructuring the entire application.

### 5. Shared Infrastructure
Every workspace must utilize the shared infrastructure for common tasks (API calls, routing, theming, base UI components). Workspaces must not reinvent the wheel for standard operations.

### 6. Dependency Direction
Dependencies must flow inward toward the shared infrastructure. A shared component must never import from a specific workspace.
