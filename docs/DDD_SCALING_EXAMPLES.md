# 🚀 Scaling Your Application with DDD

How Domain-Driven Design helps you add new features like notifications, payment integrations, and more.

---

## 🎯 The Scaling Challenge

As your app grows, you'll need to add:

- 📧 **Email notifications**
- 💳 **Payment integrations** (Stripe, PayPal)
- 🔔 **Push notifications**
- 📊 **Advanced analytics**
- 🤖 **AI-powered insights**
- 🔄 **Webhooks** for external services
- 📱 **Mobile app** sync
- 🌐 **Third-party integrations**

**Question:** How does DDD make this easier?

---

## Example 1: Email Notifications 📧

**Scenario:** Send email when budget reaches 80% of limit.

### ❌ **Without DDD (Nightmare)**

```typescript
// ❌ Must add email logic in EVERY use case that affects budget!

// createTransaction.ts
export const createTransaction = async (...) => {
  const transaction = await transactionRepo.create(data);

  // ❌ Calculate budget usage here (DUPLICATED)
  const budget = await budgetRepo.getOneByCategory(transaction.categoryId);
  if (budget) {
    const spending = await transactionRepo.getSumByCategory(transaction.categoryId);
    const percentage = (spending / budget.maximumSpending) * 100;

    if (percentage >= 80) {
      await emailService.send({
        to: user.email,
        subject: "Budget Alert",
        body: `You've used ${percentage}% of your budget!`
      });
    }
  }

  return transaction;
};

// ❌ SAME CODE in updateTransaction.ts
// ❌ SAME CODE in deleteTransaction.ts
// ❌ SAME CODE in anywhere that affects budget
// This is UNMAINTAINABLE! 😰
```

### ✅ **With DDD (Clean & Scalable)**

```typescript
// Step 1: Add business method to Budget entity
// Budget.ts
export class Budget extends Entity<string> {
  private _warningThreshold: number = 0.8;
  private _warningAlreadySent: boolean = false;

  public shouldSendWarning(currentSpending: number): boolean {
    const percentage = this._maximumSpending.percentageSpent(currentSpending);
    return percentage >= this._warningThreshold * 100 && !this._warningAlreadySent;
  }

  public markWarningSent(): void {
    this._warningAlreadySent = true;
    this.touch();
  }

  public resetWarning(): void {
    this._warningAlreadySent = false;
    this.touch();
  }
}

// Step 2: Create Domain Service for notifications
// NotificationService.ts
export class BudgetNotificationService {
  constructor(
    private emailService: IEmailService,
    private budgetRepo: IBudgetRepository,
    private transactionRepo: ITransactionRepository
  ) {}

  public async checkBudgetWarnings(
    userId: string,
    categoryId: string
  ): Promise<void> {
    // Get budget
    const budgetDto = await this.budgetRepo.getOneByCategory(userId, categoryId);
    if (!budgetDto) return;

    // Reconstitute domain entity
    const budgetOrError = Budget.reconstitute({
      id: BudgetId.create(budgetDto.id).value,
      name: BudgetName.create(budgetDto.name).value,
      colorTag: ColorTag.create(budgetDto.colorTag).value,
      maximumSpending: MaximumSpending.create(budgetDto.maximumSpending).value,
      createdAt: budgetDto.createdAt,
      updatedAt: budgetDto.updatedAt,
    });

    if (budgetOrError.isFailure) return;
    const budget = budgetOrError.value;

    // Get current spending
    const currentSpending = await this.transactionRepo.getSumByCategory(
      userId,
      categoryId
    );

    // ✨ Domain logic decides if we should send warning
    if (budget.shouldSendWarning(currentSpending)) {
      await this.emailService.send({
        to: user.email,
        subject: `Budget Alert: ${budget.name.value}`,
        template: "budget-warning",
        data: {
          budgetName: budget.name.value,
          percentage: budget.getPercentageSpent(currentSpending),
          remaining: budget.getRemainingAmount(currentSpending),
          maximumSpending: budget.maximumSpending.value,
        },
      });

      // Mark as sent to avoid spam
      budget.markWarningSent();
      await this.budgetRepo.updateOne(userId, budgetDto.id, budget.toDto());
    }
  }
}

// Step 3: Use in ANY use case with ONE line!
// createTransaction.ts
export const createTransaction = (
  transactionRepo: ITransactionRepository,
  notificationService: BudgetNotificationService // ✅ Inject
) => {
  const useCase = async (...) => {
    const transaction = await transactionRepo.create(data);

    // ✅ ONE line - notification service handles everything!
    await notificationService.checkBudgetWarnings(
      userId,
      transaction.categoryId
    );

    return transaction;
  };

  return withAuth(useCase);
};

// ✅ Same ONE line in updateTransaction.ts
// ✅ Same ONE line in deleteTransaction.ts
// Business logic is centralized! 🎉
```

**Benefits:**

- ✅ Add email in **one place** - the notification service
- ✅ Business rule `shouldSendWarning()` is testable
- ✅ Change threshold? Edit **one property** in Budget
- ✅ Switch to push notifications? Just swap the service
- ✅ Add SMS? Create new `SmsNotificationService`

---

## Example 2: Stripe Payment Integration 💳

**Scenario:** Users pay for "premium pots" that support crypto tracking.

### ✅ **With DDD (Easy Integration)**

```typescript
// Step 1: Add new value object for pot tier
// PotTier.ts
export type PotTierType = "free" | "premium";

export class PotTier extends ValueObject<{ value: PotTierType }> {
  public static create(tier: PotTierType): Result<PotTier> {
    const validTiers: PotTierType[] = ["free", "premium"];

    if (!validTiers.includes(tier)) {
      return Result.fail(`Invalid pot tier: ${tier}`);
    }

    return Result.ok(new PotTier({ value: tier }));
  }

  public isPremium(): boolean {
    return this.value === "premium";
  }

  public getMonthlyPrice(): number {
    return this.isPremium() ? 4.99 : 0;
  }
}

// Step 2: Update Pot entity
// Pot.ts
export class Pot extends Entity<string> {
  private _tier: PotTier;
  private _cryptoTracking?: CryptoAsset; // Only for premium

  public upgradeToPremium(): Result<void> {
    if (this._tier.isPremium()) {
      return Result.fail("Pot is already premium");
    }

    this._tier = PotTier.create("premium").value;
    this.touch();
    return Result.ok();
  }

  public addCryptoTracking(asset: string, amount: number): Result<void> {
    // Business rule: Only premium pots can track crypto
    if (!this._tier.isPremium()) {
      return Result.fail("Crypto tracking requires premium pot");
    }

    const cryptoOrError = CryptoAsset.create(asset, amount);
    if (cryptoOrError.isFailure) {
      return Result.fail(cryptoOrError.error);
    }

    this._cryptoTracking = cryptoOrError.value;
    this.touch();
    return Result.ok();
  }

  public canTrackCrypto(): boolean {
    return this._tier.isPremium();
  }
}

// Step 3: Payment Service
// StripePaymentService.ts
export class StripePaymentService {
  constructor(private stripe: Stripe) {}

  public async createPotUpgradeCheckoutSession(
    userId: string,
    potId: string
  ): Promise<{ sessionUrl: string }> {
    const potTier = PotTier.create("premium").value;

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Premium Pot Upgrade",
              description: "Track cryptocurrency in your savings pot",
            },
            unit_amount: potTier.getMonthlyPrice() * 100, // cents
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.APP_URL}/pots/${potId}?upgraded=true`,
      cancel_url: `${process.env.APP_URL}/pots/${potId}`,
      metadata: {
        userId,
        potId,
        feature: "pot-upgrade",
      },
    });

    return { sessionUrl: session.url! };
  }

  // Handle webhook from Stripe
  public async handleSubscriptionSuccess(event: Stripe.Event): Promise<void> {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, potId } = session.metadata;

    // Get pot
    const potDto = await potRepo.getOneById(userId, potId);
    if (!potDto) throw new Error("Pot not found");

    // Reconstitute entity
    const potOrError = Pot.reconstitute(potDto);
    if (potOrError.isFailure) throw new Error(potOrError.error);

    const pot = potOrError.value;

    // ✨ Business logic in domain!
    const upgradeResult = pot.upgradeToPremium();
    if (upgradeResult.isFailure) {
      throw new Error(upgradeResult.error);
    }

    // Save
    await potRepo.updateOne(userId, potId, pot.toDto());

    // Send confirmation email
    await emailService.send({
      to: user.email,
      subject: "Welcome to Premium Pot!",
      template: "pot-upgrade-success",
    });
  }
}

// Step 4: Use case for upgrading
// upgradePotToPremium.ts
export const upgradePotToPremium = (
  potRepository: IPotRepository,
  paymentService: StripePaymentService
) => {
  const useCase = async (
    userId: string,
    input: { potId: string }
  ): Promise<{ checkoutUrl: string }> => {
    const { potId } = input;

    // Validate
    const potIdOrError = PotId.create(potId);
    if (potIdOrError.isFailure) {
      throw new DomainValidationError(potIdOrError.error);
    }

    // Check pot exists
    const pot = await potRepository.getOneById(userId, potId);
    if (!pot) {
      throw new NotFoundError("Pot not found");
    }

    // ✅ Payment service handles Stripe integration
    const checkout = await paymentService.createPotUpgradeCheckoutSession(
      userId,
      potId
    );

    return { checkoutUrl: checkout.sessionUrl };
  };

  return withAuth(useCase);
};
```

**Benefits:**

- ✅ Business rule "premium pots can track crypto" in entity
- ✅ Payment logic separated in payment service
- ✅ Easy to add PayPal later - just new service
- ✅ Pricing logic in `PotTier.getMonthlyPrice()`
- ✅ Webhook handling uses domain entity

---

## Example 3: Push Notifications 🔔

**Scenario:** Notify users when they reach their pot target.

### ✅ **With DDD**

```typescript
// Step 1: Add domain event
// PotEvents.ts
export interface PotTargetAchievedEvent {
  type: 'POT_TARGET_ACHIEVED';
  potId: string;
  potName: string;
  targetAmount: number;
  achievedAt: Date;
}

// Step 2: Update Pot entity to emit events
// Pot.ts
export class Pot extends Entity<string> {
  private _domainEvents: PotTargetAchievedEvent[] = [];

  public addMoney(amount: number): Result<void> {
    const moneyOrError = Money.create(amount);
    if (moneyOrError.isFailure) {
      return Result.fail(moneyOrError.error);
    }

    const wasAchieved = this.isTargetAchieved();

    this._totalSaved = this._totalSaved.add(moneyOrError.value);

    // ✨ Emit event when target is reached
    if (!wasAchieved && this.isTargetAchieved()) {
      this._domainEvents.push({
        type: 'POT_TARGET_ACHIEVED',
        potId: this._id,
        potName: this._name.value,
        targetAmount: this._target.value,
        achievedAt: new Date(),
      });
    }

    this.touch();
    return Result.ok();
  }

  public getDomainEvents(): PotTargetAchievedEvent[] {
    return this._domainEvents;
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }
}

// Step 3: Event handler
// PotEventHandler.ts
export class PotEventHandler {
  constructor(
    private pushNotificationService: IPushNotificationService,
    private emailService: IEmailService,
    private analyticsService: IAnalyticsService
  ) {}

  public async handle(event: PotTargetAchievedEvent): Promise<void> {
    // Send push notification
    await this.pushNotificationService.send({
      userId: event.userId,
      title: "🎉 Target Achieved!",
      body: `Congratulations! You've reached your ${event.potName} goal of $${event.targetAmount}!`,
      data: {
        screen: 'PotDetails',
        potId: event.potId,
      },
    });

    // Send email
    await this.emailService.send({
      to: user.email,
      subject: `🎉 You reached your ${event.potName} goal!`,
      template: "pot-target-achieved",
      data: event,
    });

    // Track analytics
    await this.analyticsService.track({
      event: 'pot_target_achieved',
      userId: event.userId,
      properties: {
        potId: event.potId,
        targetAmount: event.targetAmount,
        timeToAchieve: this.calculateDaysSinceCreation(event),
      },
    });
  }
}

// Step 4: Use in use case
// addMoneyToPot.ts
export const addMoneyToPot = (
  potRepository: IPotRepository,
  eventHandler: PotEventHandler
) => {
  const useCase = async (...) => {
    // ... pot creation and validation ...

    const pot = potOrError.value;

    // Add money
    const addResult = pot.addMoney(amount);
    if (addResult.isFailure) {
      throw new DomainValidationError(addResult.error);
    }

    // Save
    await potRepository.updateOne(userId, potId, pot.toDto());

    // ✨ Handle domain events
    const events = pot.getDomainEvents();
    for (const event of events) {
      await eventHandler.handle(event);
    }

    return pot.toDto();
  };

  return withAuth(useCase);
};
```

**Benefits:**

- ✅ Domain event pattern for loose coupling
- ✅ Easy to add more handlers (analytics, webhooks)
- ✅ Entity decides WHEN to emit events
- ✅ Multiple notifications from one event
- ✅ Easy to test event emission

---

## Example 4: AI-Powered Insights 🤖

**Scenario:** AI suggests budgets based on spending patterns.

### ✅ **With DDD**

```typescript
// Step 1: AI Service
// BudgetAIService.ts
export class BudgetAIService {
  constructor(
    private transactionRepo: ITransactionRepository,
    private openai: OpenAI
  ) {}

  public async suggestBudgets(userId: string): Promise<BudgetSuggestion[]> {
    // Get spending history
    const last3Months = await this.transactionRepo.getSpendingByCategory(
      userId,
      { months: 3 }
    );

    // Analyze with AI
    const analysis = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a financial advisor. Suggest realistic budgets.",
        },
        {
          role: "user",
          content: `Based on this spending data: ${JSON.stringify(last3Months)}, suggest appropriate budgets for each category.`,
        },
      ],
    });

    const suggestions = JSON.parse(analysis.choices[0].message.content);

    // ✨ Validate suggestions using domain logic
    return suggestions
      .map((s: any) => {
        const maxSpendingOrError = MaximumSpending.create(s.suggestedAmount);

        // Skip invalid suggestions
        if (maxSpendingOrError.isFailure) {
          return null;
        }

        return {
          categoryName: s.categoryName,
          suggestedBudget: maxSpendingOrError.value.value,
          reasoning: s.reasoning,
          averageSpending: s.averageSpending,
        };
      })
      .filter((s) => s !== null);
  }
}

// Step 2: Use case
// getAIBudgetSuggestions.ts
export const getAIBudgetSuggestions = (aiService: BudgetAIService) => {
  const useCase = async (userId: string) => {
    // ✅ AI service handles complexity
    const suggestions = await aiService.suggestBudgets(userId);

    // ✅ Domain validates suggestions
    return suggestions.map((s) => ({
      ...s,
      // Can apply budget immediately
      canApply: true,
    }));
  };

  return withAuth(useCase);
};

// Step 3: Apply AI suggestion
// applyBudgetSuggestion.ts
export const applyBudgetSuggestion = (
  budgetRepo: IBudgetRepository,
  categoryRepo: ICategoryRepository
) => {
  const useCase = async (
    userId: string,
    input: { categoryName: string; suggestedAmount: number }
  ) => {
    const { categoryName, suggestedAmount } = input;

    // ✨ Create budget using domain entity
    const budgetOrError = Budget.create({
      name: categoryName,
      maximumSpending: suggestedAmount,
      colorTag: await this.getNextAvailableColor(userId),
    });

    if (budgetOrError.isFailure) {
      throw new DomainValidationError(budgetOrError.error);
    }

    const budget = budgetOrError.value;
    return budgetRepo.createOne(userId, budget.toDto());
  };

  return withAuth(useCase);
};
```

**Benefits:**

- ✅ AI integrated cleanly through service
- ✅ Domain validates AI suggestions
- ✅ Easy to switch AI providers
- ✅ Business rules still enforced
- ✅ Can test without calling OpenAI

---

## Example 5: Webhook Integration 🔄

**Scenario:** Sync with external accounting software (QuickBooks, Xero).

### ✅ **With DDD**

```typescript
// Step 1: Webhook service
// AccountingSyncService.ts
export class AccountingSyncService {
  constructor(
    private webhookService: IWebhookService,
    private encryptionService: IEncryptionService
  ) {}

  public async syncTransaction(transaction: Transaction): Promise<void> {
    // ✨ Domain entity has all the data
    const payload = {
      id: transaction.id,
      amount: transaction.amount.value,
      category: transaction.categoryName.value,
      type: transaction.type.value,
      date: transaction.createdAt,
      description: transaction.name.value,
    };

    // Send to external system
    await this.webhookService.send({
      url: user.accountingWebhookUrl,
      method: 'POST',
      headers: {
        'X-Signature': this.encryptionService.sign(payload),
      },
      body: payload,
    });
  }

  public async receiveWebhook(payload: any, signature: string): Promise<void> {
    // Verify signature
    if (!this.encryptionService.verify(payload, signature)) {
      throw new Error("Invalid webhook signature");
    }

    // ✨ Use domain to validate incoming data
    const transactionOrError = Transaction.create({
      name: payload.description,
      amount: payload.amount,
      categoryId: payload.categoryId,
      type: payload.type,
    });

    if (transactionOrError.isFailure) {
      throw new DomainValidationError(transactionOrError.error);
    }

    // Save
    const transaction = transactionOrError.value;
    await transactionRepo.createOne(userId, transaction.toDto());
  }
}

// Step 2: Use in create transaction
// createTransaction.ts
export const createTransaction = (
  transactionRepo: ITransactionRepository,
  syncService: AccountingSyncService
) => {
  const useCase = async (...) => {
    // Create transaction
    const transaction = await transactionRepo.create(data);

    // ✅ Sync to external systems if configured
    if (user.hasAccountingIntegration) {
      await syncService.syncTransaction(transaction);
    }

    return transaction;
  };

  return withAuth(useCase);
};
```

---

## 🎯 Summary: How DDD Enables Scaling

| Feature to Add          | Without DDD                       | With DDD                                |
| ----------------------- | --------------------------------- | --------------------------------------- |
| **Email Notifications** | Add logic in 10+ files            | Add notification service, use in 1 line |
| **Payment Integration** | Scatter Stripe code everywhere    | Payment service + domain entities       |
| **Push Notifications**  | Duplicate notification logic      | Event handler pattern                   |
| **AI Integration**      | AI code mixed with business logic | AI service validates with domain        |
| **Webhooks**            | Hard to maintain sync logic       | Webhook service uses domain entities    |
| **Analytics**           | Track events manually everywhere  | Domain events trigger analytics         |
| **Mobile Sync**         | Complex sync logic scattered      | Domain entities as source of truth      |

### **The Pattern:**

1. **Domain entities** contain business rules
2. **Domain services** handle complex operations
3. **Integration services** connect to external systems
4. **Use cases** orchestrate everything with simple code

### **Key Insight:**

> With DDD, adding new features means **composing existing domain objects** rather than modifying scattered code. Your domain layer is stable; you just add new services on top!

---

[← Back to Main Documentation](./DOMAIN_DRIVEN_DESIGN.md)
