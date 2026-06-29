# Glossary

## Customer

The buyer or business relationship at the center of the product.

## Order

A customer request for products that begins the order-to-delivery workflow.

## Pricing Resolution

The process of determining the correct price for a product for a specific customer.

## Invoice

An immutable commercial record issued from an order.

## Warehouse

The operational stage responsible for preparing products for shipment.

## Shipment

The movement of products from warehouse to delivery destination.

## Delivery

Confirmation that products reached the customer.

## Payment

Settlement against an invoice.

## Tenant

A company or organization using the SaaS product in an isolated business context.

## Immutable Snapshot

A preserved copy of business values at the time an event occurs.

## Read Model

A composed, denormalized view optimized for specific queries that reads from multiple aggregates but never writes to them.

## Correlation ID

A unique identifier that links related operations across requests, events, and background jobs for traceability.

## Event

A meaningful change in the operational workflow that carries enough context for audit, notification, integration, and future AI explanation.

## Rule ID

A stable identifier assigned to business rules for traceability from business intent to implementation verification.

## Workflow

The lifecycle and allowed state transitions for a business entity.

## Notification

A message sent to users about business events that requires attention or provides information.

## Performance Budget

A measurable performance target for a critical operation that guides implementation and optimization.

## Index

A database structure that improves query performance for specific fields or field combinations.

## ADR

Architecture Decision Record - a document that captures important architectural decisions, their context, and consequences.

## Bootstrap

The process of initializing the system with default configuration data from YAML files on first startup.

## Configuration Philosophy

The principle that the `config/` directory contains bootstrapped, editable defaults, while the database becomes the source of truth after bootstrap.

## Related Documents

- [MASTER_SKILL](MASTER_SKILL.md)
- [VISION](VISION.md)
- [RULES](RULES.md)
- [PRINCIPLES](PRINCIPLES.md)
- [DOMAIN](DOMAIN.md)
- [ROADMAP](ROADMAP.md)
- [RELEASES](RELEASES.md)
- [BUSINESS_RULES](BUSINESS_RULES.md)
- [TRACEABILITY](TRACEABILITY.md)

