# ADR 001: Business Actions vs System Versioning

## Status
Accepted

## Date
2026-07-02

## Context
In the initial implementation of the Pricing module, technical concepts like version numbers, activation, and deactivation were exposed to users through API endpoints. This required users to understand and manage internal system state, which is inappropriate for SMB users who should focus on business operations rather than technical implementation details.

## Decision
Adopt the architectural principle that users perform BUSINESS ACTIONS while the system manages VERSIONS, HISTORY, and AUDIT automatically.

### Core Principle
- **Users perform business actions**: Edit Price, Edit Order, Edit Customer, Issue Invoice
- **System manages technical concerns**: Create immutable versions, preserve history, maintain audit trail, resolve latest active record, maintain snapshots
- **Versioning is an internal implementation detail**: Users should never manage technical versions directly
- **No activation/deactivation exposed**: Users should never activate or deactivate versions
- **Version numbers are internal**: Users should never understand or see internal version numbers

## Rationale
1. **User Experience**: SMB users understand business concepts (edit price, issue invoice) but not technical concepts (version management, activation state)
2. **Simplicity**: Hiding technical complexity reduces cognitive load and training requirements
3. **Audit Integrity**: System-managed versioning ensures complete, immutable history without user intervention
4. **Flexibility**: Internal versioning can evolve without breaking user-facing APIs
5. **Error Prevention**: Users cannot accidentally corrupt history by mismanaging versions

## Consequences

### Positive
- Intuitive user interface focused on business operations
- Guaranteed audit trail integrity
- Simplified API surface
- Future-proof internal implementation
- Reduced training and support burden

### Negative
- Less granular control for advanced users (mitigated by providing history views)
- Requires careful API design to ensure business actions map correctly to system behavior
- More complex backend implementation to handle automatic versioning

### Modules Affected

#### Pricing Module (Immediate)
**Removed APIs:**
- `PUT /api/pricing/{id}/activate`
- `PUT /api/pricing/{id}/deactivate`

**Added APIs:**
- `PUT /api/pricing/{id}` - Edit current price (internally creates new version)
- `GET /api/pricing/history/{customerId}/{productId}` - Read-only pricing history

**Behavior:**
- Latest version automatically becomes current
- Version numbers are internal
- History is read-only
- No UI concept of activate/deactivate

#### Order Module (Future)
**Draft Orders:**
- User edits order
- System creates internal versions automatically

**Confirmed Orders:**
- Order becomes immutable
- Future changes become business revisions (not edits to original)

#### Customer Module (Future)
- User edits customer information
- System maintains audit history automatically
- No customer version management exposed

#### Product Module (Future)
- User edits product
- System maintains audit history automatically
- No product version management exposed

#### Invoice Module (Future)
**Invoice Lifecycle:**
- Draft → Issued → Immutable
- Issued invoices are never edited
- Corrections happen through Credit Note / Cancellation business actions

## Implementation Notes

### Versioning Strategy
- Every business action that modifies data creates a new immutable version
- Previous versions are never modified
- Latest version is automatically considered "current"
- Version numbers are internal integers, never exposed to users

### History Access
- History is read-only via dedicated endpoints
- Users can view history but cannot modify it
- History includes full audit trail (who, when, what changed)

### API Design Pattern
```
POST /api/{resource}           - Create first version
PUT /api/{resource}/{id}       - Edit current (creates new version)
GET /api/{resource}            - List current
GET /api/{resource}/history    - View history (where applicable)
```

## Examples

### Pricing
**User Action:** "Edit price for Customer A, Product X to ₹120"

**System Action:**
1. Create new pricing version with price ₹120
2. Mark previous version as historical
3. Auto-increment internal version number
4. Update audit trail

**User Sees:** Price updated to ₹120

### Order
**User Action:** "Add item to order"

**System Action:**
1. Create new order version with added item
2. Preserve previous version
3. Update audit trail

**User Sees:** Item added to order

## Permanent Review Rule
**If a user has to understand a technical concept (versions, activation, internal state management), ask whether it can be replaced with a business action instead.**

This principle will keep the ERP intuitive for SMB users while letting the system handle all the complexity behind the scenes.

## References
- ARCHITECTURE_V1_FINAL.md
- BUSINESS_RULES.md
- RULES.md
- PRICING_API.md
