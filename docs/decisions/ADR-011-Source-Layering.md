# ADR-011 Source Layering

## Status

Accepted for architecture hardening.

## Context

The system has multiple types of code and data:

- Business logic (domain rules, invariants)
- Application logic (workflows, use cases)
- Infrastructure logic (persistence, APIs)
- Presentation logic (UI components)
- Configuration data (bootstrapped defaults)

Without clear layering boundaries, the codebase risks:
- Business logic leaking into infrastructure
- Configuration logic mixed with business rules
- Tight coupling between layers
- Difficulty testing business rules in isolation
- Inability to evolve infrastructure without affecting business logic

## Decision

The system will adopt a layered architecture with strict boundaries:

### Layer Definitions

**Domain Layer**
- Contains business entities, value objects, and domain services
- Contains business rules and invariants
- No dependencies on infrastructure or presentation
- Pure business logic that can be tested in isolation

**Application Layer**
- Contains use cases and workflows
- Orchestrates domain objects to fulfill business operations
- Depends on domain layer
- Does not depend on infrastructure or presentation

**Infrastructure Layer**
- Contains persistence, APIs, external integrations
- Implements interfaces defined by application layer
- Depends on application layer
- Does not contain business logic

**Presentation Layer**
- Contains UI components, API endpoints
- Handles user interaction
- Depends on application layer
- Does not contain business logic

**Configuration Layer**
- Contains bootstrapped defaults (YAML files)
- Provides initial system state
- Bootstrapped into database, then database becomes source of truth
- Does not contain business logic

### Dependency Rules

```
Presentation → Application → Domain
Infrastructure → Application → Domain
Configuration → Database (bootstrap only)
```

- Domain layer has no dependencies
- Application layer depends only on domain
- Infrastructure and presentation depend on application
- Configuration is separate and only used during bootstrap

### Boundary Enforcement

**Domain Layer:**
- No database access
- No HTTP calls
- No file I/O
- No UI logic
- No configuration file reading

**Application Layer:**
- No direct database access (use repositories)
- No direct HTTP calls (use services)
- No UI logic
- Can read configuration from database (post-bootstrap)

**Infrastructure Layer:**
- No business rules
- Implements repository interfaces
- Implements service interfaces
- Can read configuration from database

**Presentation Layer:**
- No business rules
- No database access
- Calls application layer use cases
- Can read configuration from database

**Configuration Layer:**
- YAML files only
- Bootstrapped into database
- Never read during normal operation
- Database becomes source of truth

## Consequences

**Positive:**
- Business logic is isolated and testable
- Infrastructure can evolve without affecting business logic
- Configuration is separated from business rules
- Clear boundaries enable parallel development
- Easier to reason about system behavior

**Negative:**
- More initial structure to set up
- Requires discipline to maintain boundaries
- May require more boilerplate (interfaces, repositories)
- Learning curve for team members

**Risks:**
- Team may bypass boundaries for convenience
- Over-engineering if boundaries are too strict
- Performance overhead from layering (mitigated by proper design)

## Examples

### Domain Layer Example

```typescript
// Domain: Customer entity with business rules
class Customer {
  constructor(
    public id: string,
    public name: string,
    public creditLimit: Money
  ) {
    if (name.length === 0) {
      throw new Error("Customer name is required");
    }
    if (creditLimit.amount < 0) {
      throw new Error("Credit limit cannot be negative");
    }
  }

  canPlaceOrder(orderAmount: Money): boolean {
    return orderAmount.lessThanOrEqual(this.creditLimit);
  }
}
```

### Application Layer Example

```typescript
// Application: Use case for creating order
class CreateOrderUseCase {
  constructor(
    private customerRepository: CustomerRepository,
    private productRepository: ProductRepository,
    private pricingService: PricingService,
    private orderRepository: OrderRepository
  ) {}

  async execute(command: CreateOrderCommand): Promise<Order> {
    const customer = await this.customerRepository.findById(command.customerId);
    const product = await this.productRepository.findById(command.productId);
    const price = await this.pricingService.resolvePrice(customer.id, product.id);

    const order = Order.create(customer, product, price);
    
    if (!customer.canPlaceOrder(order.totalAmount)) {
      throw new Error("Customer credit limit exceeded");
    }

    await this.orderRepository.save(order);
    return order;
  }
}
```

### Infrastructure Layer Example

```typescript
// Infrastructure: Database repository implementation
class PostgresCustomerRepository implements CustomerRepository {
  constructor(private db: Database) {}

  async findById(id: string): Promise<Customer> {
    const row = await this.db.query("SELECT * FROM customers WHERE id = $1", [id]);
    return new Customer(row.id, row.name, new Money(row.credit_limit, row.currency));
  }

  async save(customer: Customer): Promise<void> {
    await this.db.query(
      "INSERT INTO customers (id, name, credit_limit) VALUES ($1, $2, $3)",
      [customer.id, customer.name, customer.creditLimit.amount]
    );
  }
}
```

### Configuration Layer Example

```yaml
# config/roles.yaml - Bootstrapped defaults
roles:
  - name: Administrator
    description: Full system access
    permissions:
      - "*"
```

## Related Documentation

- [Data Ownership](../technical/DATA_OWNERS.md) - Aggregate ownership boundaries
- [Dependencies](../technical/DEPENDENCIES.md) - Module dependency rules
- [Authorization Bootstrap](ADR-014-Authorization-Bootstrap.md) - Configuration bootstrap process
