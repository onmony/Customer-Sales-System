# Pricing Workspace Architecture

## Overview
The Pricing Workspace is designed to follow the exact same ProOS application shell used by the Command Center and Customer Workspace. It must feel like another room in the same building, utilizing identical visual hierarchy, spacing, typography, colors, component styles, and interaction patterns.

## Application Shell Integration

### Global Header
Uses the exact same global header as every workspace.
*   Logo
*   Global Search
*   Notifications
*   Settings
*   Help
*   User Profile
*(No custom header elements for Pricing)*

### Application Navigation (Left)
*   Exact same left navigation as the Command Center.
*   Displays every application icon (Dashboard, Customers, Pricing, Products, Orders, Invoices, Payments, Inventory, Reports, Settings).
*   Highlights the active workspace (Pricing).
*   Uses the same indigo navigation color.

## Workspace Layout

The Pricing Workspace strictly adheres to the three-column responsive grid defined in the Application Shell:

1.  **Left Column:** Workspace Directory (Pricing Sets)
2.  **Center Column:** Main Workspace (Pricing Decisions)
3.  **Right Column:** Context Panel (Pricing Context)

---

## 1. Workspace Directory (Left Column)

Displays the list of Pricing Sets, allowing users to select and navigate between different pricing agreements, base lists, and customer-specific rules. Follows the standard directory behavior (expand, collapse, resize, filter).

---

## 2. Main Workspace (Center Column)

Redesigned around pricing decisions rather than generic KPI cards. This is the primary area for configuring and evaluating pricing matrices.

### Top Summary
Provides immediate context for the active pricing set:
*   **Customer** (if applicable to a specific customer)
*   **Pricing Set** (Name/Identifier)
*   **Version**
*   **Status** (e.g., Draft, Active, Expired)
*   **Effective Dates**
*   **Last Modified**

### Primary Section
*   **Pricing Matrix:** The core data table for defining price points, volume tiers, and currency values. Built using the standard Table System.

### Collapsible Sections
Uses the standard accordion philosophy for secondary information:
*   **Pricing Rules:** Conditional logic, discounts, and markup definitions.
*   **Version History:** Previous iterations of the pricing set.
*   **Audit Trail:** Log of who changed what and when.
*   **Upcoming Changes:** Future scheduled updates to the matrix.

---

## 3. Context Panel (Right Column)

Matches the Customer Workspace style exactly. Provides supporting information and insights without obscuring the Main Workspace.

**Includes:**
*   **Pricing Status:** Current lifecycle state.
*   **Validation:** Any errors or warnings regarding the current matrix.
*   **Business Rules:** Summary of active business policies affecting this set.
*   **Approval Workflow:** Current stage in the approval process.
*   **Upcoming Effective Dates:** Alerts for when new pricing takes effect.
*   **AI Recommendations:** System-generated suggestions for margin optimization or anomaly detection.
*   **Operational Log:** Recent system actions related to the pricing set.
