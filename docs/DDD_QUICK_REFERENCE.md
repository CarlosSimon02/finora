# 📖 DDD Quick Reference

A cheat sheet for understanding Finora's Domain-Driven Design implementation.

---

## 🎯 What is Domain-Driven Design?

**Simple Explanation:**
Instead of organizing code by "what database table it touches," we organize it by "what business concept it represents."

**Real-World Analogy:**

- ❌ Organizing closet by color → Everything blue together (database-driven)
- ✅ Organizing closet by purpose → Work clothes, gym clothes (domain-driven)

---

## 🏗️ Core Concepts

### 1. **Value Objects**

Self-validating pieces of data without identity.

```typescript
// ✅ Good: Always valid
const name = BudgetName.create("Groceries"); // Result<BudgetName>
if (name.isSuccess) {
  // name.value is ALWAYS valid!
}

// ❌ Bad: Can be invalid
let name = ""; // Empty string - invalid!
```

**Examples:** `Money`, `BudgetName`, `ColorTag`, `MaximumSpending`

### 2. **Entities**

Things with identity that can change over time.

```typescript
// ✅ Entity with behavior
class Budget {
  public isExceeded(spending: number): boolean {
    return spending > this._maximumSpending.value;
  }
}

// ❌ Just data (anemic model)
interface Budget {
  id: string;
  maximumSpending: number;
}
```

**Examples:** `Budget`, `Pot`, `Income`, `Transaction`

### 3. **Use Cases**

Thin orchestrators that coordinate domain objects.

```typescript
// ✅ Thin use case
export const addMoneyToPot = (repo) => async (...) => {
  const pot = await repo.get(potId);
  pot.addMoney(amount); // ← Business logic in entity
  await repo.save(pot);
};

// ❌ Fat use case with business logic
export const addMoneyToPot = (repo) => async (...) => {
  const pot = await repo.get(potId);
  if (pot.totalSaved >= pot.target) throw Error(...); // ← Logic here
  pot.totalSaved += amount; // ← Logic here
  await repo.save(pot);
};
```

### 4. **Ubiquitous Language**

Code uses the same words as business people.

```typescript
// ✅ Business language
if (budget.isExceeded(spending)) {
  alert("You exceeded your budget!");
}

// ❌ Technical jargon
if (data.amount > config.max_value) {
  alert("Limit reached!");
}
```

---

## 📂 File Structure

```
src/core/
├── entities/
│   ├── shared/         # Base classes (Entity, ValueObject, Result)
│   ├── budget/         # Budget aggregate
│   ├── pot/            # Pot aggregate
│   ├── income/         # Income aggregate
│   └── transaction/    # Transaction aggregate
│
├── valueObjects/
│   ├── shared/         # Money (reused everywhere!)
│   ├── budget/         # BudgetName, MaximumSpending, BudgetId
│   ├── pot/            # PotName, PotTarget, PotId
│   ├── income/         # IncomeName, IncomeId
│   └── transaction/    # TransactionName, ColorTag, Emoji, etc.
│
├── useCases/           # Thin orchestrators
│   ├── budget/         # Budget use cases
│   ├── pot/            # Pot use cases
│   ├── income/         # Income use cases
│   └── transaction/    # Transaction use cases
│
├── interfaces/         # Repository contracts
└── schemas/            # API validation (Zod)
```

---

## 🎨 Common Patterns

### Pattern 1: Creating a Value Object

```typescript
export class BudgetName extends ValueObject<{ value: string }> {
  private constructor(props: { value: string }) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  // ✨ Static factory method
  public static create(name: string): Result<BudgetName> {
    // Validation
    if (name.trim().length === 0) {
      return Result.fail("Budget name is required");
    }

    if (name.length > 50) {
      return Result.fail("Budget name too long");
    }

    return Result.ok(new BudgetName({ value: name.trim() }));
  }
}
```

### Pattern 2: Creating an Entity

```typescript
export class Budget extends Entity<string> {
  private _name: BudgetName;
  private _maximumSpending: MaximumSpending;

  // ✨ Factory method
  public static create(props: CreateBudgetProps): Result<Budget> {
    // Validate all value objects
    const nameOrError = BudgetName.create(props.name);
    const maxSpendingOrError = MaximumSpending.create(props.maximumSpending);

    const combined = Result.combine([nameOrError, maxSpendingOrError]);
    if (combined.isFailure) {
      return Result.fail(combined.error);
    }

    return Result.ok(
      new Budget({
        id: BudgetId.generate(),
        name: nameOrError.value,
        maximumSpending: maxSpendingOrError.value,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    );
  }

  // ✨ Business methods
  public isExceeded(spending: number): boolean {
    return this._maximumSpending.isExceeded(spending);
  }

  public update(props: UpdateBudgetProps): Result<void> {
    // Update with validation
    if (props.name) {
      const nameOrError = BudgetName.create(props.name);
      if (nameOrError.isFailure) {
        return Result.fail(nameOrError.error);
      }
      this._name = nameOrError.value;
    }

    this.touch(); // Update timestamp
    return Result.ok();
  }

  // ✨ Convert to DTO
  public toDto(): BudgetDto {
    return {
      id: this._id,
      name: this._name.value,
      maximumSpending: this._maximumSpending.value,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
```

### Pattern 3: Using in Use Case

```typescript
export const createBudget = (budgetRepo: IBudgetRepository) => {
  const useCase = async (userId: string, input: { data: CreateBudgetDto }) => {
    const { data } = input;

    // 1. Validate using value objects
    const validationResults = [
      BudgetName.create(data.name),
      MaximumSpending.create(data.maximumSpending),
    ];

    const combined = Result.combine(validationResults);
    if (combined.isFailure) {
      throw new DomainValidationError(combined.error);
    }

    // 2. Check business rules
    const count = await budgetRepo.getCount(userId);
    if (count >= MAX_BUDGETS) {
      throw new DomainValidationError("Max budgets reached");
    }

    // 3. Delegate to repository
    return budgetRepo.createOne(userId, data);
  };

  return withAuth(useCase);
};
```

---

## ✅ Best Practices

### Do's ✅

- **Use value objects** for validation
- **Put business logic** in entities
- **Keep use cases thin** (orchestration only)
- **Use ubiquitous language** (business terms)
- **Test entities** without database
- **Reuse value objects** across domains (like `Money`)

### Don'ts ❌

- **Don't put business logic** in use cases
- **Don't skip validation** in value objects
- **Don't use primitives** everywhere (primitive obsession)
- **Don't duplicate validation** logic
- **Don't tightly couple** to database structure
- **Don't use technical jargon** when business terms exist

---

## 🧪 Testing Examples

### Testing Value Objects

```typescript
describe("BudgetName", () => {
  it("should reject empty name", () => {
    const result = BudgetName.create("");
    expect(result.isFailure).toBe(true);
    expect(result.error).toContain("required");
  });

  it("should trim whitespace", () => {
    const result = BudgetName.create("  Groceries  ");
    expect(result.isSuccess).toBe(true);
    expect(result.value.value).toBe("Groceries");
  });

  it("should reject names over 50 chars", () => {
    const longName = "a".repeat(51);
    const result = BudgetName.create(longName);
    expect(result.isFailure).toBe(true);
  });
});
```

### Testing Entities

```typescript
describe("Budget", () => {
  it("should detect when budget is exceeded", () => {
    const budgetOrError = Budget.create({
      name: "Groceries",
      maximumSpending: 500,
      colorTag: "#277C78",
    });

    const budget = budgetOrError.value;

    expect(budget.isExceeded(600)).toBe(true);
    expect(budget.isExceeded(400)).toBe(false);
  });

  it("should calculate remaining amount", () => {
    const budget = Budget.create({
      name: "Groceries",
      maximumSpending: 500,
      colorTag: "#277C78",
    }).value;

    expect(budget.getRemainingAmount(300)).toBe(200);
    expect(budget.getRemainingAmount(600)).toBe(0); // Can't be negative
  });
});
```

---

## 🚀 When to Use Each Concept

| Concept            | Use When                         | Example                         |
| ------------------ | -------------------------------- | ------------------------------- |
| **Value Object**   | Data needs validation            | `Money`, `BudgetName`, `Email`  |
| **Entity**         | Thing has identity and lifecycle | `Budget`, `Pot`, `User`         |
| **Domain Service** | Logic spans multiple entities    | `BudgetNotificationService`     |
| **Use Case**       | Orchestrating a business flow    | `createBudget`, `addMoneyToPot` |
| **Repository**     | Data persistence abstraction     | `IBudgetRepository`             |

---

## 💡 Quick Decision Tree

**Should this be a Value Object or Entity?**

```
Does it have an ID that matters?
├─ Yes → Entity (Budget, Pot)
└─ No → Value Object (Money, BudgetName)

Does its value define it completely?
├─ Yes → Value Object (two $100 bills are the same)
└─ No → Entity (two budgets with same values are different)

Can it exist independently?
├─ Yes → Entity
└─ No → Value Object
```

---

## 📊 Benefits Summary

| Before DDD                  | After DDD                  |
| --------------------------- | -------------------------- |
| Validation scattered        | Value Objects validate     |
| Business logic in use cases | Business logic in entities |
| Hard to test                | Easy to unit test          |
| Duplicate code              | Reusable value objects     |
| Technical names             | Business language          |
| Changes break many files    | Changes in one entity      |

---

## 🎓 Key Takeaway

> **DDD isn't about adding complexity—it's about organizing complexity in a way that matches how people think about the business.**

If a finance person says "the budget is exceeded," your code should say `budget.isExceeded()`. That's the power of DDD!

---

[← Back to Main Documentation](./DOMAIN_DRIVEN_DESIGN.md)
