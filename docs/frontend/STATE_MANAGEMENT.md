# State Management

State management in a complex ERP must be highly organized to prevent data staleness and performance bottlenecks.

## State Categories and Ownership

### 1. Server State
*   **Definition:** Data that resides on the backend (e.g., Customers, Orders). The frontend only possesses a cached copy.
*   **Ownership:** Managed entirely by a data-fetching library (e.g., React Query or RTK Query).
*   **Rule:** Components must not store server data in local `useState`. They must subscribe to the cache.

### 2. Local UI State
*   **Definition:** Transient state specific to a single component (e.g., "is this dropdown open?", "is this accordion expanded?").
*   **Ownership:** Managed strictly via React `useState` or `useReducer` within the specific component.

### 3. Global Application State
*   **Definition:** State that affects the entire application layout or behavior (e.g., current active theme, sidebar collapsed state, user session info).
*   **Ownership:** Managed via React Context or a lightweight global store (e.g., Zustand). Keep this to an absolute minimum.

### 4. Form State
*   **Definition:** The current un-submitted values of user input, along with validation errors and dirty states.
*   **Ownership:** Managed by a dedicated form library (e.g., React Hook Form) to ensure performance (preventing whole-page re-renders on every keystroke).

### 5. Workspace State
*   **Definition:** State shared across components *within* a specific workspace, but not needed globally (e.g., selected rows in the customer table, active tabs in the customer detail view).
*   **Ownership:** Passed via props or a workspace-specific React Context to isolate the state from the rest of the application.
