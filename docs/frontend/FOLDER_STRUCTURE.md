# Folder Structure

This document defines the standard directory structure for the React application. Strict adherence to this structure ensures predictability and scalability.

## Root Structure

```text
src/
├── app/          # App initialization, global providers
├── assets/       # Static assets (images, global fonts)
├── config/       # Environment configuration, feature flags
├── core/         # Core infrastructure (auth, api setup, routing setup)
│   ├── api/      # API client configuration and interceptors
│   ├── auth/     # Authentication context and utilities
│   └── theme/    # Theme configuration and tokens
├── shared/       # Shared UI and utilities
│   ├── components/ # Reusable UI components (Buttons, Tables, Forms)
│   ├── hooks/    # Reusable React hooks
│   ├── types/    # Global TypeScript interfaces
│   └── utils/    # Pure utility functions and formatters
├── layouts/      # Structural page layouts (Sidebar, Header combinations)
├── routes/       # Top-level route definitions and code-splitting boundaries
└── workspaces/   # Feature-based workspaces (The core business modules)
    ├── customer/
    ├── order/
    └── pricing/
```

## Folder Responsibilities

*   **`app`**: The absolute entry point. Contains context providers (Theme, Auth, Query) and the root component.
*   **`layouts`**: Defines the macro-structure of screens (e.g., `MainLayout` with the persistent sidebar, `AuthLayout` for login screens).
*   **`routes`**: Maps URLs to specific Workspaces or Layouts. Handles top-level lazy loading.
*   **`workspaces`**: The heart of the business logic. Contains isolated modules (Customer, Order). Each workspace may have its own internal components, hooks, and types if they are not shared.
*   **`shared`**: Code that is used across multiple workspaces.
*   **`components`**: (Inside shared) Pure, presentation components built according to the Design System.
*   **`hooks`**: Custom React hooks for abstracting reusable UI logic.
*   **`api`**: Defines the base HTTP client, request/response interceptors, and error mapping logic.
*   **`types`**: Global TypeScript definitions representing backend domain models.
*   **`utils`**: Pure functions (e.g., date formatting, currency formatting) without side effects or React dependencies.
*   **`theme`**: Design tokens and CSS-in-JS or Tailwind configuration mapping.
