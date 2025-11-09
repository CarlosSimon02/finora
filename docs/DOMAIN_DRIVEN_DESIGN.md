# 🏗️ Domain-Driven Design Implementation Guide

Welcome to Finora's **Domain-Driven Design (DDD)** documentation! This guide explains the architectural changes we made to make the codebase more maintainable, scalable, and easier to understand.

> 💡 **Think of it like this:** Instead of organizing your closet by color, you organize it by purpose (work clothes, gym clothes, casual wear). DDD organizes code by **what the business does**, not just by technical layers.

---

## 📚 Table of Contents

1. [What Changes Did We Make?](#-what-changes-did-we-make)
2. [Before & After Code Examples](./DDD_BEFORE_AFTER.md)
3. [Pros & Cons](#-pros--cons)
4. [Following DDD Principles](#-following-ddd-principles)
5. [Schema-Only Approach: Pros & Cons](#-schema-only-approach-pros--cons)
6. [Scaling Your Application](./DDD_SCALING_EXAMPLES.md)
7. [Ubiquitous Language](#-ubiquitous-language)
8. [File Structure](#-file-structure)

---

## 🔄 What Changes Did We Make?

We restructured the codebase to follow **Domain-Driven Design principles**. Here's what changed:

### **Before: Schema-Based Validation** ❌

- Validation happened only at the API boundary using Zod schemas
- Business rules were scattered across use cases and repositories
- No clear separation between "what makes a valid budget" and "how to save it to the database"

### **After: Domain-Driven Design** ✅

- Created **Value Objects** for self-validating data (like `BudgetName`, `Money`)
- Created **Entities** that contain business logic (like `Budget`, `Pot`, `Income`)
- Use cases became thin orchestrators that use domain objects
- Business rules live in ONE place: the domain layer

### **What We Built:**

```
📦 Domain Layer (NEW!)
├── 🎯 Value Objects
│   ├── BudgetName (validates 1-50 chars)
│   ├── MaximumSpending (validates amounts)
│   ├── Money (reusable across domains)
│   └── ColorTag (validates color codes)
│
├── 🏛️ Entities
│   ├── Budget (knows budget rules)
│   ├── Pot (knows savings rules)
│   ├── Income (knows income rules)
│   └── Transaction (knows transaction rules)
│
└── ⚙️ Shared Base Classes
    ├── Entity (for things with identity)
    ├── ValueObject (for things without identity)
    └── Result (for error handling)
```

---

## ⚖️ Pros & Cons

### ✅ **Pros of Domain-Driven Design**

| Benefit                     | Explanation                                  | Example                                                  |
| --------------------------- | -------------------------------------------- | -------------------------------------------------------- |
| 🎯 **Clear Business Logic** | Rules live in domain entities, not scattered | `pot.isTargetAchieved()` instead of checking in 5 places |
| ♻️ **Reusability**          | Value objects used across domains            | `Money` used in Transaction, Pot, Budget                 |
| 🧪 **Easy Testing**         | Test entities without database               | `expect(potName.create("").isFailure).toBe(true)`        |
| 📖 **Readable Code**        | Code speaks business language                | `budget.isExceeded(spending)` - crystal clear!           |
| 🔒 **Encapsulation**        | Data and behavior together                   | Can't have invalid `BudgetName` - always valid!          |
| 🚀 **Scalability**          | Add features without breaking existing code  | Add `pot.setTargetAchievedNotification()` easily         |
| 🛡️ **Type Safety**          | Value objects prevent primitive obsession    | Can't pass `potName` where `budgetName` expected         |
| 🔧 **Maintainability**      | Changes in one place                         | Change budget rules? Edit `Budget` entity only           |

### ❌ **Cons of Domain-Driven Design**

| Challenge                      | Explanation                              | Mitigation                        |
| ------------------------------ | ---------------------------------------- | --------------------------------- |
| 📚 **Learning Curve**          | Team needs to understand DDD concepts    | Good documentation (like this!)   |
| ⏱️ **Initial Time Investment** | Takes time to set up domain layer        | Pays off quickly as features grow |
| 🏗️ **More Files**              | More classes than simple schema approach | Better organization compensates   |
| 🔄 **Conversion Layer**        | Convert between domain entities and DTOs | Worth it for clean separation     |
| 🧠 **Upfront Design**          | Need to think about domain modeling      | Prevents messy code later         |
| 📦 **Boilerplate**             | More code for value objects              | Reusable and type-safe code       |

### 📊 **When to Use DDD?**

✅ **Use DDD When:**

- Your application has **complex business rules**
- You plan to **scale** the application
- Multiple developers work on the codebase
- The domain is rich (finance, e-commerce, healthcare)
- You want **long-term maintainability**

❌ **Skip DDD When:**

- Simple CRUD application with no business logic
- Proof-of-concept or throwaway prototype
- Very small team (1-2 devs) on a tiny project
- Time-to-market is critical and rules are simple

---

## 🎯 Following DDD Principles

### **The Core Statement:**

> "Instead of letting databases or frameworks decide how you structure things, you talk to the people who know the problem (domain experts), agree on the exact words they use (ubiquitous language), and then model those real-world things and rules in code."

### **How Our Changes Follow This:**

#### 1️⃣ **Code Talks the Same Language as Business**

**Before:**

```typescript
// What does this mean to a finance expert? 🤷
if (data.amount > schema.max) throw new Error("Invalid");
```

**After:**

```typescript
// Finance expert understands this immediately! 💡
if (budget.isExceeded(currentSpending)) {
  alert("You've exceeded your budget!");
}

if (pot.isTargetAchieved()) {
  celebrate("You reached your savings goal!");
}
```

**Real-World Terms in Code:**

- `Budget` - Finance managers understand budgets
- `MaximumSpending` - Clear spending limit concept
- `Pot.target` - Savings target everyone talks about
- `Transaction.category` - Categories people actually use
- `Income.totalEarned` - Exact term from business

#### 2️⃣ **Business Rules Live in One Place**

**Before (Scattered):**

```typescript
// Rule in use case #1
if (pot.totalSaved >= pot.target) { ... }

// Same rule in use case #2 (DUPLICATE!)
if (pot.totalSaved >= pot.target) { ... }

// Same rule in component (TRIPLE!)
const achieved = pot.totalSaved >= pot.target;
```

**After (Centralized):**

```typescript
// Rule in ONE place - the Pot entity
class Pot {
  public isTargetAchieved(): boolean {
    return this._totalSaved.value >= this._target.value;
  }
}

// Used everywhere consistently
if (pot.isTargetAchieved()) { ... }
```

#### 3️⃣ **Add Features Without Breaking Stuff**

**Before:**

```typescript
// Want to add "budget warnings at 80%"?
// Need to modify code in 10 places! 😰
```

**After:**

```typescript
// Add ONE method to Budget entity
class Budget {
  public isNearingLimit(currentSpending: number, threshold = 0.8): boolean {
    const percentage = this._maximumSpending.percentageSpent(currentSpending);
    return percentage >= threshold * 100;
  }
}

// Use anywhere instantly!
if (budget.isNearingLimit(spending)) {
  showWarning("You're at 80% of your budget!");
}
```

---

## 📋 Schema-Only Approach: Pros & Cons

### **What is Schema-Only Approach?**

Using **Zod schemas** at the API boundary for validation, without domain entities.

```typescript
// Example: Schema-only validation
const createBudgetSchema = z.object({
  name: z.string().min(1).max(50),
  colorTag: z.string().regex(/^#[0-9A-F]{6}$/i),
  maximumSpending: z.number().positive().max(999_999_999_999),
});

export const createBudget = async (data: unknown) => {
  const validated = createBudgetSchema.parse(data); // ✅ Valid format
  // ❌ But no business logic or reusability
  return db.budgets.create(validated);
};
```

### ✅ **Advantages of Schema-Only**

| Advantage                   | Details                          |
| --------------------------- | -------------------------------- |
| 🚀 **Fast to Set Up**       | Just define Zod schema and go    |
| 📖 **Simple to Understand** | Straightforward validation logic |
| 🔧 **Less Boilerplate**     | Fewer files and classes          |
| ⚡ **Quick Prototyping**    | Great for MVPs and demos         |
| 🎓 **Lower Learning Curve** | No need to learn DDD concepts    |

### ❌ **Disadvantages of Schema-Only**

| Disadvantage                         | Example Problem                                            |
| ------------------------------------ | ---------------------------------------------------------- |
| 🔴 **No Behavior Encapsulation**     | Can't do `budget.isExceeded()` - must calculate everywhere |
| 🔴 **Duplicated Logic**              | Same validation in 5 files: `if (amount > max)`            |
| 🔴 **Scattered Rules**               | Budget rules in use cases, repositories, components        |
| 🔴 **Hard to Test**                  | Must mock database for every test                          |
| 🔴 **Poor Scalability**              | Adding features means editing many files                   |
| 🔴 **Primitive Obsession**           | Everything is `string` or `number` - no meaning            |
| 🔴 **No Reusability**                | Can't reuse `Money` validation across domains              |
| 🔴 **Business Logic in Wrong Place** | Use cases become fat controllers                           |

### **Real Example: The Maintenance Problem**

**Scenario:** Change budget limit from 999,999,999,999 to 999,999,999.

**With Schema-Only:**

```typescript
// ❌ Must change in 5 places!

// 1. Create schema
const createBudgetSchema = z.object({
  maximumSpending: z.number().max(999_999_999), // Change here
});

// 2. Update schema
const updateBudgetSchema = z.object({
  maximumSpending: z.number().max(999_999_999).optional(), // And here
});

// 3. Frontend validation
<Input max={999_999_999} /> // And here

// 4. Documentation - And here

// 5. Tests - And here

// If you miss ONE place, you have a bug! 🐛
```

**With DDD:**

```typescript
// ✅ Change in ONE place!

// MaximumSpending.ts
class MaximumSpending {
  private static readonly MAX_AMOUNT = 999_999_999; // ONLY change here

  public static create(amount: number): Result<MaximumSpending> {
    if (amount > this.MAX_AMOUNT) {
      return Result.fail(`Maximum cannot exceed ${this.MAX_AMOUNT}`);
    }
  }
}

// Everywhere else automatically uses the new limit! 🎉
```

---

## 🗣️ Ubiquitous Language

### **What is Ubiquitous Language?**

**Ubiquitous Language** means using the **same words** in code that business people use when talking about the domain.

> 💡 **Think of it like this:** If your finance manager says "budget" and "spending limit," your code should have a `Budget` class with a `spendingLimit` property - not `FinancialConstraint` with a `maxAmount`.

### **Why It Matters:**

| Without Ubiquitous Language                            | With Ubiquitous Language                   |
| ------------------------------------------------------ | ------------------------------------------ |
| Developer: "The fiscal restriction exceeded threshold" | Developer: "The budget exceeded the limit" |
| Business: "Huh? What's fiscal restriction?"            | Business: "Oh yes, exactly!"               |
| ❌ Miscommunication                                    | ✅ Clear communication                     |

### **How We Applied It:**

#### **✅ Real Terms from Finance Domain:**

| Business Term          | Our Code                | Why It Works                    |
| ---------------------- | ----------------------- | ------------------------------- |
| "Budget"               | `class Budget`          | Everyone knows what a budget is |
| "Maximum Spending"     | `class MaximumSpending` | Clear spending limit            |
| "Savings Pot"          | `class Pot`             | Common UK term for savings      |
| "Target Amount"        | `PotTarget`             | Goal you're saving toward       |
| "Total Saved"          | `Pot.totalSaved`        | Amount you've saved so far      |
| "Income Source"        | `class Income`          | Where money comes from          |
| "Transaction Category" | `TransactionCategory`   | Group transactions              |
| "Color Tag"            | `ColorTag`              | Visual identifier               |

#### **✅ Business Methods Match Real Actions:**

```typescript
// ✅ Finance manager would say: "Did we achieve the savings target?"
pot.isTargetAchieved();

// ✅ Finance manager would say: "Is the budget exceeded?"
budget.isExceeded(currentSpending);

// ✅ Finance manager would say: "Add money to the pot"
pot.addMoney(amount);

// ✅ Finance manager would say: "Withdraw from savings"
pot.withdrawMoney(amount);

// ✅ Finance manager would say: "What's the remaining budget?"
budget.getRemainingAmount(currentSpending);
```

#### **❌ What We Avoided (Bad Examples):**

```typescript
// ❌ Nobody says "data container" in finance
class FinancialDataContainer

// ❌ "Monetary constraint validator"? What?
class MonetaryConstraintValidator

// ❌ "Resource allocation tracker"? Too technical!
class ResourceAllocationTracker

// ❌ "Execute fund transfer operation"? Just say "withdraw"!
executeFundTransferOperation()
```

### **Real Conversation Example:**

**Product Manager:** "Users should get a notification when they're close to their budget limit."

**Without DDD:**

```typescript
// Developer needs to translate business language to code
// "close to limit" becomes "percentage calculation"
const percentage = (spending / max) * 100;
if (percentage >= 80) {
  sendNotification();
}
```

**With DDD:**

```typescript
// Developer uses the same language!
if (budget.isNearingLimit(spending)) {
  notificationService.sendBudgetWarning(user);
}
```

**Product Manager:** "Perfect! That's exactly what I meant!"

---

## 📁 File Structure

Our new DDD structure organized by domain:

```
src/core/
├── entities/
│   ├── shared/
│   │   ├── Entity.ts           # Base entity class
│   │   ├── ValueObject.ts      # Base value object class
│   │   └── Result.ts           # Result pattern for errors
│   ├── transaction/
│   │   ├── Transaction.ts      # Transaction aggregate
│   │   └── TransactionCategory.ts
│   ├── pot/
│   │   └── Pot.ts              # Pot aggregate
│   ├── budget/
│   │   └── Budget.ts           # Budget aggregate
│   └── income/
│       └── Income.ts           # Income aggregate
│
├── valueObjects/
│   ├── shared/
│   │   └── Money.ts            # ✨ Reused everywhere!
│   ├── transaction/
│   │   ├── TransactionId.ts
│   │   ├── TransactionName.ts
│   │   ├── Emoji.ts
│   │   ├── ColorTag.ts         # ✨ Reused in all domains!
│   │   ├── CategoryId.ts
│   │   ├── CategoryName.ts
│   │   └── TransactionType.ts
│   ├── pot/
│   │   ├── PotId.ts
│   │   ├── PotName.ts
│   │   └── PotTarget.ts
│   ├── budget/
│   │   ├── BudgetId.ts
│   │   ├── BudgetName.ts
│   │   └── MaximumSpending.ts
│   └── income/
│       ├── IncomeId.ts
│       └── IncomeName.ts
│
├── useCases/                   # Thin orchestrators
│   ├── transaction/            # 7 use cases
│   ├── pot/                    # 12 use cases
│   ├── budget/                 # 9 use cases
│   └── income/                 # 9 use cases
│
├── interfaces/                 # Repository contracts (unchanged)
├── schemas/                    # API validation (unchanged)
└── constants.ts
```

---

## 📚 Additional Resources

- [📖 Quick Reference Guide](./DDD_QUICK_REFERENCE.md) - Cheat sheet for DDD patterns
- [📊 Before & After Code Examples](./DDD_BEFORE_AFTER.md) - Detailed code comparisons
- [🚀 Scaling Examples](./DDD_SCALING_EXAMPLES.md) - How DDD helps you scale
- [🧪 Testing Guide](./DDD_TESTING.md) - How to test domain entities (coming soon)

---

## 🎓 Key Takeaways

1. **DDD organizes code by business concepts**, not technical layers
2. **Value Objects** ensure data is always valid
3. **Entities** contain business logic and rules
4. **Ubiquitous Language** makes code readable by business people
5. **Business rules in one place** makes maintenance easy
6. **Reusable domain objects** reduce duplication
7. **Easy to scale** by adding features without breaking existing code

---

## 💬 Questions?

If something isn't clear, imagine explaining it to a friend who doesn't code:

- "Budget knows if you've spent too much"
- "Pot knows if you've reached your savings goal"
- "Money validates that amounts are correct"

That's the beauty of DDD - the code tells a story that anyone can understand! 🎉

---

**Made with ❤️ for Finora**
