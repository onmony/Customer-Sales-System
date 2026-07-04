# Design System Philosophy

This document defines the overarching visual philosophy of the ERP application. The design system is the visual manifestation of the Product and UX foundations: it exists solely to facilitate business productivity.

## Core Principles

### Information-First
The visual design must never compete with the data. The design system uses restraint--subtle borders, muted backgrounds, and clear typography--to ensure that business data is the most prominent element on any screen.

### Productivity-First
Aesthetics serve functionality. Every visual decision (spacing, color, typography) is evaluated on whether it increases the speed and accuracy of a professional user.

### Minimal Visual Fatigue
The system is designed for professionals who use it for eight hours a day. High-contrast, hyper-vibrant colors and unnecessary animations are strictly avoided to prevent eye strain and cognitive fatigue. The visual language is calm, composed, and neutral.

### Professional Appearance
The interface must inspire trust and reliability. It should feel robust, exact, and highly engineered, reflecting the serious nature of financial and operational data.

### Modern but Familiar
The system adopts modern design principles (clean lines, logical hierarchy) but avoids fleeting UI trends. It relies on established software conventions so users do not have to relearn how to interact with standard controls.

### Visual Consistency
A button must look and behave identically in the Customer module as it does in the Warehouse module. Absolute visual consistency builds muscle memory and user confidence.

### Customer Workspace as Design Master
The Customer Workspace is the reference implementation for all future workspaces.

No workspace may introduce a new layout, navigation model, visual language, or interaction pattern without updating the Design System first.

Every new workspace must inherit the approved shell, navigation, toolbar, footer, typography, colors, spacing, tables, buttons, accordion behavior, workspace interaction patterns, right context panel, workspace personalization, information density, and business-first philosophy.

Only the business content required for the new workspace should change.

### ProOS Shell Consistency
The Command Center defines the official ProOS Application Shell. Every module must inherit the same shell, brand color, typography, theme, toolbar, search, footer, and context panel. Individual workspaces must not introduce separate visual identities.

### Workspace Accordion
The Workspace Accordion is a permanent interaction pattern. Informational workspace sections use the standard expanded/collapsed disclosure behavior defined in [Workspace Interaction Patterns](WORKSPACE_INTERACTION_PATTERNS.md). Components must reuse this pattern instead of inventing custom expand/collapse interactions.
