# Money Value Object

## Purpose

The Money value object provides a type-safe, precise representation of monetary values throughout the system. It prevents common floating-point arithmetic errors and ensures consistent currency handling across all business operations.

Related documents:

- [Vision](../VISION.md)
- [Domain](../DOMAIN.md)
- [Data Ownership](DATA_OWNERSHIP.md)
- [API Standards](API_STANDARDS.md)

## Philosophy

Money is not a primitive type. Using floating-point numbers for monetary values leads to rounding errors, precision loss, and incorrect calculations. The Money value object encapsulates:

- Currency
- Amount (as integer minor units)
- Precision rules
- Rounding behavior
- Comparison semantics
- Serialization format

## Money Structure

### Properties

**Amount**
- Type: Integer (64-bit)
- Represents: Amount in minor currency units (cents, paise, etc.)
- Example: $10.50 is stored as 1050

**Currency**
- Type: String (ISO 4217 currency code)
- Represents: Currency identifier
- Example: "USD", "INR", "EUR"

**Precision**
- Type: Integer
- Represents: Number of decimal places for the currency
- Example: 2 for USD, 2 for INR, 0 for JPY

### JSON Representation

```json
{
  "amount": 1050,
  "currency": "USD",
  "precision": 2
}
```

**Display Value:** $10.50

## Currency Support

### Supported Currencies

**Phase 1:**
- USD (US Dollar) - 2 decimal places
- INR (Indian Rupee) - 2 decimal places
- EUR (Euro) - 2 decimal places
- GBP (British Pound) - 2 decimal places

**Phase 2 (Future):**
- JPY (Japanese Yen) - 0 decimal places
- CNY (Chinese Yuan) - 2 decimal places
- AUD (Australian Dollar) - 2 decimal places
- CAD (Canadian Dollar) - 2 decimal places

**Currency Registry:**
```javascript
const CURRENCY_PRECISION = {
  USD: 2,
  INR: 2,
  EUR: 2,
  GBP: 2,
  JPY: 0,
  CNY: 2,
  AUD: 2,
  CAD: 2
};
```

### Currency Validation

- Currency code must be valid ISO 4217 code
- Currency must be in supported currency registry
- Precision must match currency's standard precision

## Precision Rules

### Minor Unit Storage

All monetary values are stored as integers in minor units:

**Examples:**
- $10.50 → 1050 (USD, 2 decimal places)
- ₹100.00 → 10000 (INR, 2 decimal places)
- ¥1000 → 1000 (JPY, 0 decimal places)

**Conversion Formula:**
```
minorUnits = Math.round(amount * 10^precision)
```

**Display Formula:**
```
displayAmount = minorUnits / 10^precision
```

### Precision Enforcement

**Creation:**
```javascript
// Invalid: floating-point amount
const money = new Money(10.50, "USD"); // Error

// Valid: integer minor units
const money = new Money(1050, "USD"); // $10.50
```

**Arithmetic:**
- All arithmetic operations maintain precision
- Intermediate calculations use higher precision
- Final results are rounded to currency precision

## Rounding

### Rounding Mode

Use "Half Even" (Banker's Rounding) as the default rounding mode:

- 0.5 rounds to nearest even number
- 1.5 rounds to 2
- 2.5 rounds to 2
- 3.5 rounds to 4

**Rationale:** Minimizes cumulative rounding error in financial calculations.

### Rounding Context

**When to Round:**
- After multiplication/division
- After currency conversion
- Before display/storage
- After tax calculations

**When NOT to Round:**
- During intermediate calculations
- When comparing values
- When storing in Money object

### Rounding Implementation

```javascript
function round(amount, precision) {
  const factor = Math.pow(10, precision);
  const rounded = Math.round(amount * factor) / factor;
  return rounded;
}
```

## Arithmetic Operations

### Addition

```javascript
const money1 = new Money(1050, "USD"); // $10.50
const money2 = new Money(2000, "USD"); // $20.00
const sum = money1.add(money2); // $30.50
```

**Rules:**
- Currencies must match
- Result precision matches currency precision
- No rounding required for addition

### Subtraction

```javascript
const money1 = new Money(3050, "USD"); // $30.50
const money2 = new Money(1000, "USD"); // $10.00
const difference = money1.subtract(money2); // $20.50
```

**Rules:**
- Currencies must match
- Result precision matches currency precision
- No rounding required for subtraction

### Multiplication

```javascript
const money = new Money(1000, "USD"); // $10.00
const multiplier = 0.15; // 15%
const product = money.multiply(multiplier); // $1.50
```

**Rules:**
- Multiplier can be decimal
- Result is rounded to currency precision
- Uses "Half Even" rounding mode

### Division

```javascript
const money = new Money(1000, "USD"); // $10.00
const divisor = 3;
const quotient = money.divide(divisor); // $3.33
```

**Rules:**
- Divisor can be decimal
- Result is rounded to currency precision
- Uses "Half Even" rounding mode

### Currency Conversion

```javascript
const money = new Money(1000, "USD"); // $10.00
const exchangeRate = 83.50; // USD to INR
const converted = money.convert("INR", exchangeRate); // ₹835.00
```

**Rules:**
- Exchange rate is provided (not stored in Money object)
- Result is rounded to target currency precision
- Original Money object is immutable

## Comparison

### Equality

```javascript
const money1 = new Money(1050, "USD"); // $10.50
const money2 = new Money(1050, "USD"); // $10.50
money1.equals(money2); // true
```

**Rules:**
- Currencies must match
- Amounts must match exactly
- Precision must match

### Comparison Operators

```javascript
const money1 = new Money(1050, "USD"); // $10.50
const money2 = new Money(2000, "USD"); // $20.00

money1.lessThan(money2); // true
money1.lessThanOrEqual(money2); // true
money1.greaterThan(money2); // false
money1.greaterThanOrEqual(money2); // false
```

**Rules:**
- Currencies must match
- Compares minor unit amounts
- No rounding during comparison

### Cross-Currency Comparison

Cross-currency comparison requires explicit conversion:

```javascript
const moneyUSD = new Money(1000, "USD"); // $10.00
const moneyINR = new Money(83500, "INR"); // ₹835.00

// Convert to common currency first
const exchangeRate = 83.50;
const moneyUSDInINR = moneyUSD.convert("INR", exchangeRate);
moneyUSDInINR.equals(moneyINR); // true
```

## Serialization

### JSON Serialization

**To JSON:**
```json
{
  "amount": 1050,
  "currency": "USD",
  "precision": 2
}
```

**From JSON:**
```javascript
const money = Money.fromJSON({
  amount: 1050,
  currency: "USD",
  precision: 2
});
```

### Database Serialization

**Column Types:**
- `amount`: BIGINT (stores minor units)
- `currency`: VARCHAR(3) (ISO 4217 code)
- `precision`: INT (optional, can be derived from currency)

**Example Schema:**
```sql
CREATE TABLE order_items (
  id BIGINT PRIMARY KEY,
  order_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  quantity INT NOT NULL,
  unit_price_amount BIGINT NOT NULL,
  unit_price_currency VARCHAR(3) NOT NULL,
  unit_price_precision INT NOT NULL,
  total_price_amount BIGINT NOT NULL,
  total_price_currency VARCHAR(3) NOT NULL,
  total_price_precision INT NOT NULL
);
```

### API Serialization

**Request Body:**
```json
{
  "unitPrice": {
    "amount": 1050,
    "currency": "USD",
    "precision": 2
  }
}
```

**Response Body:**
```json
{
  "unitPrice": {
    "amount": 1050,
    "currency": "USD",
    "precision": 2,
    "display": "$10.50"
  }
}
```

## Display Formatting

### Format Rules

**Display Format:**
- Use currency symbol (₹, $, €, £)
- Use locale-specific formatting
- Include thousands separators
- Include decimal places based on precision

**Examples:**
- USD: $1,234.56
- INR: ₹1,234.56
- EUR: €1.234,56 (European locale)
- JPY: ¥1,235 (no decimal places)

### Implementation

```javascript
function format(money, locale = "en-US") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: money.currency,
    minimumFractionDigits: money.precision,
    maximumFractionDigits: money.precision
  }).format(money.displayAmount);
}
```

## Validation

### Input Validation

**Invalid Inputs:**
- Negative precision
- Invalid currency code
- Floating-point amount
- Mismatched precision and currency

**Validation Rules:**
```javascript
function validateMoney(amount, currency, precision) {
  if (!Number.isInteger(amount)) {
    throw new Error("Amount must be integer");
  }
  if (!CURRENCY_PRECISION[currency]) {
    throw new Error("Invalid currency code");
  }
  if (precision !== CURRENCY_PRECISION[currency]) {
    throw new Error("Precision does not match currency");
  }
  if (amount < 0) {
    throw new Error("Amount cannot be negative");
  }
}
```

### Business Validation

**Business Rules:**
- Order totals cannot be negative
- Invoice amounts cannot be negative
- Credit limits cannot be negative
- Payments cannot be negative

## Zero Values

### Zero Money

```javascript
const zeroUSD = Money.zero("USD"); // $0.00
const zeroINR = Money.zero("INR"); // ₹0.00
```

**Zero Comparison:**
```javascript
const money = new Money(0, "USD");
money.isZero(); // true
```

### Negative Money

Negative money is not allowed in business operations:

```javascript
const money = new Money(-100, "USD"); // Error
```

**Exception:** Returns/refunds may use negative values in specific contexts (documented in business rules).

## Immutability

### Immutable Operations

All Money operations return new Money objects:

```javascript
const money1 = new Money(1000, "USD");
const money2 = money1.add(500); // Returns new Money object
money1.amount; // Still 1000
money2.amount; // 1500
```

**Rationale:** Prevents accidental mutation, enables safe sharing, supports functional programming patterns.

## Error Handling

### Arithmetic Errors

**Currency Mismatch:**
```javascript
const moneyUSD = new Money(1000, "USD");
const moneyINR = new Money(83500, "INR");
moneyUSD.add(moneyINR); // Error: Currency mismatch
```

**Division by Zero:**
```javascript
const money = new Money(1000, "USD");
money.divide(0); // Error: Division by zero
```

### Serialization Errors

**Invalid JSON:**
```javascript
Money.fromJSON({ amount: "invalid" }); // Error
Money.fromJSON({ currency: "XXX" }); // Error
```

## Testing

### Unit Tests

Test scenarios:
- Creation with valid inputs
- Creation with invalid inputs
- Arithmetic operations
- Comparison operations
- Currency conversion
- Serialization/deserialization
- Display formatting
- Rounding behavior
- Zero values
- Immutability

### Integration Tests

Test scenarios:
- Database storage and retrieval
- API request/response handling
- Cross-service money handling
- Currency conversion accuracy

## Performance Considerations

### Optimization

- Cache currency precision lookups
- Use integer arithmetic (avoid floating-point)
- Pre-allocate Money objects for common zero values
- Use object pooling for high-frequency operations

### Memory

- Money objects are lightweight (3 properties)
- Avoid creating unnecessary Money objects in loops
- Consider primitive representation for bulk calculations

## Cross References

- [API Standards](API_STANDARDS.md) - Money serialization in APIs
- [Data Ownership](DATA_OWNERSHIP.md) - Money in aggregates
- [Domain](../DOMAIN.md) - Money in pricing and invoicing
