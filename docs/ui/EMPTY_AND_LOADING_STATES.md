# Empty and Loading States

Empty states, loading screens, and system interruptions are critical touchpoints. They must never be dead ends; they must actively guide the user toward the next productive action.

## Core Principles

### Never Leave the User Wondering What to Do
Every state, regardless of whether data is present, must provide clear context and a path forward.

### Empty Screens
An empty list or workspace should explain *why* it is empty and provide the primary action to populate it.
*   *Example:* An empty customer list should explain "No customers found" and provide a prominent "Create New Customer" button.

### Loading
When the system is processing, communicate progress clearly. Avoid generic spinners for long operations; use progress bars or contextual messages. Ensure the user knows the system is working, not frozen.

### Skeletons
Use skeleton screens for initial page loads to indicate the structure of the incoming data, reducing perceived wait times and preventing sudden layout shifts.

### No Data (Contextual)
When a specific section within a populated screen lacks data (e.g., a customer with no past orders), state this clearly and provide the next logical action (e.g., "No order history. Create First Order").

### No Search Results
A failed search must offer alternatives. Suggest modifying the query, checking spelling, or provide a quick link to create a new record matching the query if appropriate.

### Permission Denied
When access is restricted, explain exactly *what* the user is restricted from seeing and *who* they should contact to request access. Do not just show a generic "403 Forbidden" error.

### Offline
If the application loses connectivity, inform the user immediately. Explain what features are unavailable, preserve their current state, and automatically attempt to reconnect, notifying them when functionality is restored.
