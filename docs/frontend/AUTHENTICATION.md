# Authentication Architecture

This document defines how the frontend handles user identity.

## Login Flow

1.  User submits credentials via the public Login route.
2.  The API layer transmits credentials to the backend.
3.  Upon success, the backend returns a secure token (e.g., JWT).
4.  The frontend stores the token securely.
5.  The frontend redirects the user to the default Workspace (Dashboard).

## Session Lifecycle

The frontend considers a session "active" as long as a valid token is present and the backend has not rejected a request with a 401 Unauthorized status.

## Token Lifecycle

*   Tokens are injected into the headers of all protected API requests via the API Layer's request interceptor.
*   The frontend does not dictate token expiry; it relies on the token's internal signature or backend validation.

## Session Expiry

If any API request returns a `401 Unauthorized` status (handled by the API Layer response interceptor):
1.  The frontend immediately clears all local session data and caches.
2.  The user is forcefully redirected to the Login route.
3.  A transient warning message informs the user that their session has expired.

## Logout

When the user explicitly initiates a logout:
1.  The frontend calls the backend logout endpoint to invalidate the session server-side.
2.  The frontend clears all local tokens, user data, and application state.
3.  The user is redirected to the Login route.
