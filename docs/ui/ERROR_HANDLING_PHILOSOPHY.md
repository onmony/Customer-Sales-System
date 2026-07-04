# Error Handling Philosophy

Errors are inevitable, but they should not be roadblocks. A well-designed error state is an opportunity to guide the user back to productivity.

## Core Principles

### Errors Teach
Error messages should educate the user about the system's constraints and correct procedures, helping them avoid the same mistake in the future.

### Never Expose Technical Details
Users do not care about stack traces, database codes, or API timeouts. Never present raw technical jargon. Translate system failures into human-readable business terms.

### Explain Business Reason
When an action is blocked, clearly explain the *business* reason why. (e.g., "Cannot approve order because the customer's credit limit has been exceeded," rather than "Validation Error: Field 'credit_status' = false").

### Suggest Corrective Action
Do not just state the problem; provide the solution. Every error message must include a clear, actionable path forward to resolve the issue.

### Preserve User Work
Never discard data the user has already entered because of an error. Return them to the state just prior to the error, with their inputs intact, highlighting only the specific fields that require attention.

### Prevent Repeated Mistakes
Use proactive validation (e.g., inline field validation, type checking) to catch errors *before* form submission, preventing the user from repeatedly triggering backend errors.
