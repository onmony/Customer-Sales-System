# Decision Transparency

The system often makes automated decisions or calculates values based on complex business logic. To build trust and enable troubleshooting, the system must transparently explain these actions.

## Core Principles

Every automatic decision, calculation, or state change must explain:

1.  **What happened:** A clear statement of the outcome.
2.  **Why it happened:** The specific data inputs or conditions that triggered the outcome.
3.  **Which business rule applied:** The underlying policy, formula, or logic that dictated the result.
4.  **What the user can do next:** Actionable next steps, whether it is accepting the decision, overriding it (if permitted), or investigating further.

## Applications

This principle of transparency applies strictly to all core modules:

*   **Pricing:** Explain exactly how a price was calculated (e.g., Base Price - Volume Discount + Regional Tax).
*   **Order:** Explain order validation rules, credit limit checks, or inventory allocation decisions.
*   **Invoice:** Detail the compilation of line items, application of late fees, or payment terms.
*   **Payment:** Clarify how a payment was allocated across multiple invoices.
*   **Warehouse:** Explain allocation logic, picking routes, or out-of-stock handling.
*   **Future AI Recommendations:** Any AI-driven suggestion must expose the underlying reasoning to the user, allowing them to validate the recommendation against their domain expertise.
