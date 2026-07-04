# Error Handling Strategy

Error handling must strictly adhere to the UX principles defined in Module 8.2: Errors must teach, never expose technical details, and preserve user work.

## Error Categories

### Global System Errors
*   **Definition:** Unhandled exceptions that crash the React rendering tree (e.g., a null reference in a component).
*   **Handling:** Caught by a React Error Boundary. Displays a polite "Something went wrong" screen with an option to reload the application, ensuring the entire screen doesn't just go white.

### API/Business Errors
*   **Definition:** The backend successfully processed the request but rejected it based on business rules (e.g., 400 Bad Request, 409 Conflict, 422 Unprocessable Entity).
*   **Handling:** Extract the human-readable business reason from the backend response and display it inline near the relevant context (e.g., near the form field, or as a Warning Toast). User input must remain intact.

### Validation Errors (Client-Side)
*   **Definition:** Errors caught by the frontend before sending the request (e.g., missing a required field).
*   **Handling:** Displayed immediately adjacent to the offending input field.

### Network Failures
*   **Definition:** The backend could not be reached (e.g., timeout, 503 Service Unavailable, offline).
*   **Handling:** Display an "Unable to connect" message. Do not discard any draft data. Provide a "Retry" button.

### Unauthorized (401)
*   **Handling:** Immediately clear session and redirect to Login (See Authentication Architecture).

### Forbidden (403)
*   **Handling:** Display an "Access Denied" view explaining that the user lacks permissions, providing a clear path back to a safe workspace.

### Not Found (404)
*   **Handling:** Display a clear "Record not found" view when navigating to a specific entity that doesn't exist, providing a button to return to the list view.
