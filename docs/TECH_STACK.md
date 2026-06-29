# Technology Stack

## Purpose

This document defines the simple, SMB-focused technology stack for the Customer-Sales-System. The goal is to avoid enterprise complexity while maintaining scalability for SMB needs.

**Target Market:** Small and Medium Business (SMB)
**Philosophy:** Simple, modular, maintainable, cost-effective

## Technology Selection Principles

The success of this product depends more on solving business problems than on adopting modern infrastructure.

When choosing technology, follow these principles:

1. Prefer mature, well-supported technologies over newer alternatives.
2. Choose the simplest solution that satisfies current business needs.
3. Avoid distributed systems unless operational evidence requires them.
4. Prefer a modular monolith over microservices.
5. Optimize for developer productivity and maintainability.
6. Keep infrastructure simple enough to deploy on a single VPS or cloud VM.
7. Use ORM capabilities by default; introduce raw SQL only when profiling or business complexity justifies it.
8. Do not introduce new infrastructure (Redis, Kafka, Elasticsearch, etc.) without measurable business or performance requirements.
9. Every new technology must solve a real customer problem or significantly reduce development effort.
10. Favor long-term maintainability over architectural trends.

## Backend Stack

### Database

**Choice:** PostgreSQL

**Why:**
- Reliable, mature, widely supported
- Excellent for relational data
- Strong JSON support for flexibility
- Good performance for SMB scale
- Free and open-source
- Easy to host on any cloud provider

**Avoid:** NoSQL databases (MongoDB, Cassandra) - not needed for relational ERP data

### ORM

**Choice:** Prisma

**Why:**
- Type-safe (TypeScript)
- Excellent developer experience
- Built-in migrations
- Good PostgreSQL support
- Simple to learn and use
- Active community

**Avoid:** Complex ORMs (Hibernate, TypeORM) - Prisma is simpler and more modern

### API Framework

**Choice:** Express.js

**Why:**
- Minimal and flexible
- Large ecosystem
- Easy to learn
- Good for REST APIs
- Well-documented
- SMB-friendly performance

**Avoid:** Complex frameworks (NestJS, Fastify) - Express is simpler for SMB needs

### Language

**Choice:** TypeScript

**Why:**
- Type safety reduces bugs
- Excellent IDE support
- Modern JavaScript features
- Good for large codebases
- Easy to learn for JavaScript developers

**Avoid:** Pure JavaScript - TypeScript provides better safety for business logic

### Authentication

**Choice:** JWT (JSON Web Tokens)

**Why:**
- Stateless and simple
- Standard approach
- Easy to implement
- Good for SMB scale
- No external dependencies

**Avoid:** Complex auth providers (Auth0, Okta) - JWT is simpler and cheaper for SMB

### File Storage

**Choice:** Local filesystem or S3-compatible storage

**Why:**
- Simple to implement
- S3-compatible for cloud flexibility
- Cost-effective for SMB
- No complex distributed file systems

**Avoid:** Distributed file systems (GlusterFS, Ceph) - overkill for SMB

## Frontend Stack

### Framework

**Choice:** React

**Why:**
- Large ecosystem
- Component-based
- Good performance
- Easy to learn
- SMB-friendly
- Well-documented

**Avoid:** Complex frameworks (Angular, Vue with complex state management) - React is simpler and more popular

### Styling

**Choice:** TailwindCSS

**Why:**
- Utility-first approach
- Fast development
- Small bundle size
- Easy to customize
- No CSS files to maintain

**Avoid:** CSS-in-JS libraries (styled-components, Emotion) - Tailwind is simpler and faster

### Component Library

**Choice:** shadcn/ui

**Why:**
- Built on Radix UI (accessible)
- Copy-paste components (no npm bloat)
- TailwindCSS integration
- Customizable
- Modern and clean
- SMB-friendly

**Avoid:** Heavy component libraries (Material-UI, Ant Design) - shadcn/ui is lighter and more flexible

### Icons

**Choice:** Lucide React

**Why:**
- Tree-shakeable
- Consistent style
- Lightweight
- Easy to use
- Good icon coverage

**Avoid:** Heavy icon libraries (FontAwesome) - Lucide is lighter and more modern

### State Management

**Choice:** React Context + useReducer (or Zustand if needed)

**Why:**
- Built into React
- Simple for SMB needs
- No external dependencies initially
- Can scale to Zustand if needed

**Avoid:** Complex state management (Redux, MobX) - overkill for SMB ERP

## Architecture Pattern

### Pattern

**Choice:** Modular Monolith

**Why:**
- Simple to deploy
- Simple to debug
- Single database transaction
- SMB-friendly performance
- Easy to scale vertically
- Can split to microservices later if needed

**Avoid:** Microservices - overkill for SMB, adds complexity

### Event System

**Choice:** Simple in-process event bus (no Kafka)

**Why:**
- Simple to implement
- No external infrastructure
- Good for SMB scale
- Can migrate to Kafka later if needed
- Low operational overhead

**Avoid:** Kafka, RabbitMQ - overkill for SMB, adds operational complexity

### Caching

**Choice:** Redis (if needed) or in-memory cache

**Why:**
- Simple to use
- Good performance
- Optional for initial implementation
- Can add later if needed

**Avoid:** Complex caching layers (Memcached with complex strategies) - Redis is simpler

## Deployment

### Containerization

**Choice:** Docker

**Why:**
- Standard approach
- Easy to deploy
- Consistent environments
- Good for SMB
- Well-documented

**Avoid:** Kubernetes - overkill for SMB, adds operational complexity

### Cloud Provider

**Choice:** Any major provider (AWS, GCP, Azure) or VPS

**Why:**
- Flexibility
- SMB-friendly pricing
- Standard PostgreSQL hosting
- Easy to migrate

**Avoid:** Proprietary platforms (Heroku, Vercel for backend) - may limit flexibility

### CI/CD

**Choice:** GitHub Actions

**Why:**
- Free for SMB
- Simple to set up
- Good integration with GitHub
- YAML-based configuration

**Avoid:** Complex CI/CD tools (Jenkins, GitLab CI) - GitHub Actions is simpler

## Monitoring

**Choice:** Simple logging + basic metrics

**Why:**
- Essential for debugging
- Simple to implement
- Can add APM later if needed
- SMB-friendly cost

**Avoid:** Complex monitoring (Datadog, New Relic) - expensive for SMB initially

## What We Avoid (Enterprise Complexity)

**Avoid These for SMB:**
- Kafka (use simple event bus)
- Microservices (use modular monolith)
- Kubernetes (use Docker)
- Complex authentication providers (use JWT)
- Distributed tracing (use correlation IDs)
- Service mesh (not needed)
- Complex caching strategies (use Redis if needed)
- Complex state management (use React Context)
- Heavy component libraries (use shadcn/ui)
- Complex CI/CD (use GitHub Actions)
- Expensive monitoring (use logging + basic metrics)

## When to Scale Up

**Consider adding complexity when:**
- 10,000+ customers
- 100,000+ orders
- Need for high availability (99.99%+)
- Need for multi-region deployment
- Team size > 20 developers
- Need for advanced analytics

**Until then, keep it simple.**

## Technology Constraints

**Must Use:**
- PostgreSQL (database)
- TypeScript (language)
- React (frontend)
- TailwindCSS (styling)
- shadcn/ui (components)
- JWT (authentication)
- Docker (containerization)

**Must Not Use:**
- Kafka (unless explicitly needed for scale)
- Microservices (unless explicitly needed for scale)
- Kubernetes (unless explicitly needed for scale)
- Complex authentication providers (unless explicitly required)
- Distributed tracing (unless explicitly needed)

## Related Documents

- [Architecture V1 Final](../ARCHITECTURE_V1_FINAL.md) - Architecture baseline
- [Architecture Critique V2](../ARCHITECTURE_CRITIQUE.md) - Architecture weaknesses
- [Source Layering ADR](decisions/ADR-011-Source-Layering.md) - Source code organization
