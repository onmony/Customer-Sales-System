# API Layer Architecture

This document describes the target frontend architecture for the project.

The current implementation may not yet reflect this architecture.

The implementation will progressively align with this document beginning in Module 9.

The API layer is the sole bridge between the React frontend and the backend.

## Core Principles

### Backend is Source of Truth
The API layer only requests, formats, and transmits data. It does not validate business rules.

### Typed API Client
All requests and responses must be strictly typed using TypeScript interfaces that mirror the backend domain models. There must be no `any` types in the API boundary.

### Request Pipeline
All HTTP requests must pass through a centralized API client instance. Components must never instantiate naked `fetch()` calls.

The approved API client implementation will be selected during Module 9.

### Interceptors
*   **Request Interceptor:** Automatically injects authentication tokens and required headers (e.g., Content-Type, Accept) into every outgoing request.
*   **Response Interceptor:** Automatically catches global HTTP errors (like 401 Unauthorized) before they reach the component level.

### Correlation ID Propagation
If the backend supports it, the frontend should generate or propagate a Correlation ID (Request ID) in the headers of every API call to allow end-to-end tracing in backend logs.

### Retry Philosophy
*   **Idempotent Requests (GET):** May be configured to automatically retry once or twice upon encountering transient network failures (e.g., 502, 504).
*   **Mutating Requests (POST, PUT, DELETE):** Must *never* be automatically retried by the API layer, to prevent accidental duplicate orders or payments.

### Timeout Philosophy
Every request must have a strict timeout defined. If the backend does not respond within the threshold, the request must abort and throw a predictable network error to the UI, rather than leaving the user in an infinite loading state.
