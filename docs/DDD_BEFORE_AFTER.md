# 📊 Before & After Code Examples

Detailed comparison of code before and after implementing Domain-Driven Design.

---

## Example 1: Creating a Budget

### ❌ **Before (Schema-Only)**

```typescript
// createBudget.ts - ALL validation and business logic mixed
import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { CreateBudgetDto, createBudgetSchema } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { ConflictError, DomainValidationError } from "@/utils";
import { COLOR_OPTIONS } from "@/constants/colors";

export const createBudget = (budgetRepository: IBudgetRepository) => {
  const useCase = async (userId: string, input: { data: CreateBudgetDto }) => {
    const { data } = input;

    // Validation with Zod
    const validatedData = createBudgetSchema.parse(data);

    // Business rule #1: Maximum budgets (scattered here)
    const currentCount = await budgetRepository.getCount(userId);
    if (currentCount >= COLOR_OPTIONS.length) {
      throw new DomainValidationError("Maximum number of budgets reached");
    }

    // Business rule #2: Unique name (scattered here)
    const budgetExists = await budgetRepository.getOneByName(
      userId,
      validatedData.name
    );
    if (budgetExists) {
      throw new ConflictError("Budget name already exists");
    }

    // Business rule #3: Unique color (scattered here)
    const existingColor = await budgetRepository.getOneByColor(
      userId,
      validatedData.colorTag
    );
    if (existingColor) {
      throw new DomainValidationError("Budget color already in use");
    }

    return budgetRepository.createOne(userId, validatedData);
  };

  return withAuth(useCase);
};
```

**Problems:**

- 🔴 All business rules scattered in use case
- 🔴 Can't reuse validation logic
- 🔴 Hard to test without database
- 🔴 No "Budget" concept exists
- 🔴 Use case is fat (knows too much)

### ✅ **After (Domain-Driven Design)**

```typescript
// Step 1: Value Objects
// BudgetName.ts - Self-validating!
import { Result, ValueObject } from "@/core/entities/shared";
import { COMMON_MAX_NAME_LENGTH } from "@/core/constants";

export class BudgetName extends ValueObject<{ value: string }> {
  private constructor(props: { value: string }) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(name: string): Result<BudgetName> {
    const trimmed = name.trim();

    if (trimmed.length === 0) {
      return Result.fail("Budget name is required");
    }

    if (trimmed.length > COMMON_MAX_NAME_LENGTH) {
      return Result.fail(
        `Budget name must be at most ${COMMON_MAX_NAME_LENGTH} characters`
      );
    }

    return Result.ok(new BudgetName({ value: trimmed }));
  }
}

// MaximumSpending.ts - Contains spending logic!
export class MaximumSpending extends ValueObject<{ value: number }> {
  private static readonly MIN_AMOUNT = 0.01;
  private static readonly MAX_AMOUNT = 999_999_999_999;

  public static create(amount: number): Result<MaximumSpending> {
    if (amount < this.MIN_AMOUNT) {
      return Result.fail(
        `Maximum spending must be at least ${this.MIN_AMOUNT}`
      );
    }

    if (amount > this.MAX_AMOUNT) {
      return Result.fail(`Maximum spending cannot exceed ${this.MAX_AMOUNT}`);
    }

    if (!this.hasValidDecimalPlaces(amount)) {
      return Result.fail("Maximum spending must have at most 2 decimal places");
    }

    return Result.ok(new MaximumSpending({ value: amount }));
  }

  // 🎯 Business logic methods
  public isExceeded(currentSpending: number): boolean {
    return currentSpending > this.value;
  }

  public remainingAmount(currentSpending: number): number {
    const remaining = this.value - currentSpending;
    return remaining > 0 ? remaining : 0;
  }

  public percentageSpent(currentSpending: number): number {
    if (this.value === 0) return 0;
    const percentage = (currentSpending / this.value) * 100;
    return Math.min(percentage, 100);
  }
}

// Step 2: Entity
// Budget.ts - Aggregate root with business logic!
export class Budget extends Entity<string> {
  private _name: BudgetName;
  private _colorTag: ColorTag;
  private _maximumSpending: MaximumSpending;

  // Factory method
  public static create(props: CreateBudgetProps): Result<Budget> {
    // Validate all value objects
    const nameOrError = BudgetName.create(props.name);
    const colorOrError = ColorTag.create(props.colorTag);
    const maxSpendingOrError = MaximumSpending.create(props.maximumSpending);

    const combinedResult = Result.combine([
      nameOrError,
      colorOrError,
      maxSpendingOrError,
    ]);

    if (combinedResult.isFailure) {
      return Result.fail(combinedResult.error);
    }

    const budget = new Budget({
      id: BudgetId.generate(),
      name: nameOrError.value,
      colorTag: colorOrError.value,
      maximumSpending: maxSpendingOrError.value,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return Result.ok(budget);
  }

  // Business methods
  public isExceeded(currentSpending: number): boolean {
    return this._maximumSpending.isExceeded(currentSpending);
  }

  public getRemainingAmount(currentSpending: number): number {
    return this._maximumSpending.remainingAmount(currentSpending);
  }

  public update(props: UpdateBudgetProps): Result<void> {
    if (props.name !== undefined) {
      const nameOrError = BudgetName.create(props.name);
      if (nameOrError.isFailure) {
        return Result.fail(nameOrError.error);
      }
      this._name = nameOrError.value;
    }

    if (props.colorTag !== undefined) {
      const colorOrError = ColorTag.create(props.colorTag);
      if (colorOrError.isFailure) {
        return Result.fail(colorOrError.error);
      }
      this._colorTag = colorOrError.value;
    }

    if (props.maximumSpending !== undefined) {
      const maxSpendingOrError = MaximumSpending.create(props.maximumSpending);
      if (maxSpendingOrError.isFailure) {
        return Result.fail(maxSpendingOrError.error);
      }
      this._maximumSpending = maxSpendingOrError.value;
    }

    this.touch();
    return Result.ok();
  }
}

// Step 3: Use Case - Thin orchestrator!
// createBudget.ts
export const createBudget = (budgetRepository: IBudgetRepository) => {
  const useCase = async (userId: string, input: { data: CreateBudgetDto }) => {
    const { data } = input;

    // ✅ Validate using domain value objects
    const validationResults: Result<any>[] = [
      BudgetName.create(data.name),
      ColorTag.create(data.colorTag),
      MaximumSpending.create(data.maximumSpending),
    ];

    const combinedResult = Result.combine(validationResults);
    if (combinedResult.isFailure) {
      throw new DomainValidationError(combinedResult.error);
    }

    // ✅ Business rules still enforced, but cleaner
    const currentCount = await budgetRepository.getCount(userId);
    if (currentCount >= COLOR_OPTIONS.length) {
      throw new DomainValidationError("Maximum number of budgets reached");
    }

    const budgetExists = await budgetRepository.getOneByName(userId, data.name);
    if (budgetExists) {
      throw new ConflictError("Budget name already exists");
    }

    const existingColor = await budgetRepository.getOneByColor(
      userId,
      data.colorTag
    );
    if (existingColor) {
      throw new DomainValidationError("Budget color already in use");
    }

    // ✅ Delegate to repository
    return budgetRepository.createOne(userId, data);
  };

  return withAuth(useCase);
};
```

**Benefits:**

- ✅ `BudgetName` is reusable and testable
- ✅ `MaximumSpending` contains all spending logic
- ✅ `Budget` entity has clear methods
- ✅ Use case is thin (orchestrates, doesn't contain logic)
- ✅ Easy to test each piece independently

---

## Example 2: Adding Money to Pot

### ❌ **Before**

```typescript
// addMoneyToPot.ts
export const addMoneyToPot = (potRepository: IPotRepository) => {
  const useCase = async (
    userId: string,
    input: { potId: string; amount: number }
  ) => {
    const { potId, amount } = input;

    // Scattered validation
    if (!potId) {
      throw new DomainValidationError("Pot ID is required");
    }

    if (amount < 0.01) {
      throw new DomainValidationError("Amount must be at least 0.01");
    }

    if (amount > 999_999_999_999) {
      throw new DomainValidationError("Amount is too large");
    }

    // Get pot
    const pot = await potRepository.getOneById(userId, potId);
    if (!pot) {
      throw new NotFoundError("Pot not found");
    }

    // Business logic scattered here
    if (pot.totalSaved >= pot.target) {
      throw new DomainValidationError("Cannot add money - target achieved");
    }

    // Manual calculation
    const newTotal = pot.totalSaved + amount;

    // Save
    return potRepository.updateOne(userId, potId, { totalSaved: newTotal });
  };
};
```

### ✅ **After**

```typescript
// Money.ts - Reusable value object!
export class Money extends ValueObject<{ value: number }> {
  private static readonly MAX_AMOUNT = 999_999_999_999;

  public static create(amount: number): Result<Money> {
    if (amount < 0) {
      return Result.fail("Amount cannot be negative");
    }

    if (amount > this.MAX_AMOUNT) {
      return Result.fail("Amount is too large");
    }

    if (!this.hasValidDecimalPlaces(amount)) {
      return Result.fail("Amount must have at most 2 decimal places");
    }

    return Result.ok(new Money({ value: amount }));
  }

  // Money operations
  public add(other: Money): Money {
    return new Money({ value: this.value + other.value });
  }

  public subtract(other: Money): Result<Money> {
    if (this.value < other.value) {
      return Result.fail("Insufficient funds");
    }
    return Result.ok(new Money({ value: this.value - other.value }));
  }

  public isGreaterThan(other: Money): boolean {
    return this.value > other.value;
  }

  public isLessThan(other: Money): boolean {
    return this.value < other.value;
  }
}

// Pot.ts - Entity with business logic
export class Pot extends Entity<string> {
  private _totalSaved: Money;
  private _target: PotTarget;

  // 🎯 Business method - all logic here!
  public addMoney(amount: number): Result<void> {
    const moneyOrError = Money.create(amount);
    if (moneyOrError.isFailure) {
      return Result.fail(moneyOrError.error);
    }

    // Business rule: Can't add if target achieved
    if (this.isTargetAchieved()) {
      return Result.fail("Cannot add money - target already achieved");
    }

    // Add money
    this._totalSaved = this._totalSaved.add(moneyOrError.value);
    this.touch();

    return Result.ok();
  }

  public withdrawMoney(amount: number): Result<void> {
    const moneyOrError = Money.create(amount);
    if (moneyOrError.isFailure) {
      return Result.fail(moneyOrError.error);
    }

    // Use Money's subtract (checks insufficient funds)
    const resultOrError = this._totalSaved.subtract(moneyOrError.value);
    if (resultOrError.isFailure) {
      return Result.fail("Insufficient funds in pot");
    }

    this._totalSaved = resultOrError.value;
    this.touch();

    return Result.ok();
  }

  public isTargetAchieved(): boolean {
    return this._totalSaved.value >= this._target.value;
  }

  public getProgress(): number {
    return this._target.calculateProgress(this._totalSaved);
  }
}

// addMoneyToPot.ts - Clean use case!
export const addMoneyToPot = (potRepository: IPotRepository) => {
  const useCase = async (
    userId: string,
    input: { potId: string; amount: number }
  ) => {
    const { potId, amount } = input;

    // Validate inputs
    const potIdOrError = PotId.create(potId);
    const moneyOrError = Money.create(amount);

    const validationResults = Result.combine([potIdOrError, moneyOrError]);
    if (validationResults.isFailure) {
      throw new DomainValidationError(validationResults.error);
    }

    // Get pot
    const potDto = await potRepository.getOneById(userId, potId);
    if (!potDto) {
      throw new NotFoundError("Pot not found");
    }

    // Reconstitute domain entity
    const potOrError = Pot.reconstitute({
      id: PotId.create(potDto.id).value,
      name: PotName.create(potDto.name).value,
      target: PotTarget.create(potDto.target).value,
      totalSaved: Money.create(potDto.totalSaved).value,
      colorTag: ColorTag.create(potDto.colorTag).value,
      createdAt: potDto.createdAt,
      updatedAt: potDto.updatedAt,
    });

    if (potOrError.isFailure) {
      throw new DomainValidationError(potOrError.error);
    }

    const pot = potOrError.value;

    // ✨ Business logic in ONE line!
    const addResult = pot.addMoney(amount);
    if (addResult.isFailure) {
      throw new DomainValidationError(addResult.error);
    }

    // Save
    return potRepository.updateOne(userId, potId, pot.toDto());
  };

  return withAuth(useCase);
};
```

**Key Benefits:**

- ✅ `Money` is reused in Transaction, Pot, Budget, Income!
- ✅ `pot.addMoney()` encapsulates ALL business logic
- ✅ Test `pot.addMoney()` without database
- ✅ Money operations are type-safe and reusable
- ✅ Use case is much cleaner

---

## Example 3: Query Use Cases

### ❌ **Before**

```typescript
// getPaginatedBudgets.ts
export const getPaginatedBudgets = (budgetRepository: IBudgetRepository) => {
  const useCase = async (
    userId: string,
    input: { params: PaginationParams }
  ) => {
    const { params } = input;

    if (!params) {
      throw new DomainValidationError("Pagination params are required");
    }

    return budgetRepository.getPaginated(userId, params);
  };

  return withAuth(useCase);
};
```

### ✅ **After (With Comments)**

```typescript
// getPaginatedBudgets.ts
export const getPaginatedBudgets = (budgetRepository: IBudgetRepository) => {
  const useCase = async (
    userId: string,
    input: { params: PaginationParams }
  ) => {
    const { params } = input;

    // Simple validation - pagination params are infrastructure concerns, not domain
    if (!params) {
      throw new DomainValidationError("Pagination params are required");
    }

    // Query use case - no business rules to enforce
    return budgetRepository.getPaginated(userId, params);
  };

  return withAuth(useCase);
};
```

**Note:** Query use cases remain simple - they don't need complex domain logic since they're just fetching data.

---

## Summary of Changes

| Aspect              | Before                  | After                   |
| ------------------- | ----------------------- | ----------------------- |
| **Validation**      | Zod schemas only        | Value Objects + Zod     |
| **Business Logic**  | Scattered in use cases  | Centralized in entities |
| **Reusability**     | Copy-paste validation   | Shared value objects    |
| **Testing**         | Requires database mocks | Test entities directly  |
| **Readability**     | Technical code          | Business language       |
| **Maintainability** | Change in many files    | Change in one entity    |
| **Type Safety**     | Primitives everywhere   | Rich domain types       |

---

[← Back to Main Documentation](./DOMAIN_DRIVEN_DESIGN.md)
