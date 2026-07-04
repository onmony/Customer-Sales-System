# Design Tokens

This document outlines the principles governing the foundational building blocks of the visual interface. Exact values are intentionally omitted to focus on structural logic.

## Principles

### Border Radius
*   **Philosophy:** Use subtle rounding to soften the interface without making it feel overly playful or consumer-focused. Sharp corners (zero radius) may be used for dense tabular data to maximize space, while slight rounding is reserved for interactive elements like buttons and inputs.

### Shadows and Elevation
*   **Philosophy:** Shadows are used strictly to communicate depth and stacking order, not for decoration.
*   **Elevation Hierarchy:**
    *   **Level 0 (Flat):** Base content, standard panels.
    *   **Level 1 (Subtle):** Hover states, active inputs, dropdown menus.
    *   **Level 2 (Medium):** Context panels, drawers, floating action bars.
    *   **Level 3 (High):** Modals, critical system alerts.

### Borders
*   **Philosophy:** Borders define boundaries and separate dense information. They must be thin and use low-contrast neutral colors to avoid visual clutter. Rely on alignment and subtle background shading to group items before resorting to heavy borders.

### Opacity
*   **Philosophy:** Used to indicate state (e.g., disabled elements) or to create focus by dimming background layers (e.g., behind a modal).

### Z-Index Philosophy
*   **Philosophy:** The stacking order must be predictable and tightly controlled to prevent rendering collisions.
*   **Hierarchy (Lowest to Highest):** Base layout (Sidebar/Content) -> Fixed Headers -> Dropdowns/Popovers -> Drawers/Context Panels -> Modals -> Global Toasts/Notifications.
