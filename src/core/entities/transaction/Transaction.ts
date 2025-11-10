import { Entity, Result } from "@/core/entities/shared";
import { TransactionDto } from "@/core/schemas";
import { Money } from "@/core/valueObjects/shared";
import {
  Emoji,
  TransactionId,
  TransactionName,
  TransactionType,
} from "@/core/valueObjects/transaction";
import { TransactionCategory } from "./TransactionCategory";

interface TransactionProps {
  id: TransactionId;
  name: TransactionName;
  type: TransactionType;
  amount: Money;
  category: TransactionCategory;
  emoji: Emoji;
  transactionDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateTransactionProps {
  name: string;
  type: string;
  amount: number;
  categoryId: string;
  categoryName: string;
  categoryColorTag: string;
  emoji: string;
  transactionDate: Date;
}

interface UpdateTransactionProps {
  name?: string;
  type?: string;
  amount?: number;
  categoryId?: string;
  categoryName?: string;
  categoryColorTag?: string;
  emoji?: string;
  transactionDate?: Date;
}

/**
 * Transaction Entity (Aggregate Root)
 * Represents a financial transaction (income or expense)
 */
export class Transaction extends Entity<string> {
  private _name: TransactionName;
  private _type: TransactionType;
  private _amount: Money;
  private _category: TransactionCategory;
  private _emoji: Emoji;
  private _transactionDate: Date;

  private constructor(props: TransactionProps) {
    super(props.id.value, props.createdAt, props.updatedAt);
    this._name = props.name;
    this._type = props.type;
    this._amount = props.amount;
    this._category = props.category;
    this._emoji = props.emoji;
    this._transactionDate = props.transactionDate;
  }

  // Getters
  get transactionId(): TransactionId {
    return TransactionId.create(this._id).value;
  }

  get name(): TransactionName {
    return this._name;
  }

  get type(): TransactionType {
    return this._type;
  }

  get amount(): Money {
    return this._amount;
  }

  get category(): TransactionCategory {
    return this._category;
  }

  get emoji(): Emoji {
    return this._emoji;
  }

  get transactionDate(): Date {
    return this._transactionDate;
  }

  /**
   * Create a new Transaction
   */
  public static create(props: CreateTransactionProps): Result<Transaction> {
    // Create value objects
    const nameOrError = TransactionName.create(props.name);
    if (nameOrError.isFailure) {
      return Result.fail(nameOrError.error);
    }

    // Validate transaction type
    if (
      props.type !== TransactionType.INCOME &&
      props.type !== TransactionType.EXPENSE
    ) {
      return Result.fail('Type must be either "income" or "expense"');
    }
    const type = props.type as TransactionType;

    const amountOrError = Money.create(props.amount);
    if (amountOrError.isFailure) {
      return Result.fail(amountOrError.error);
    }

    const categoryOrError = TransactionCategory.create(
      props.categoryId,
      props.categoryName,
      props.categoryColorTag
    );
    if (categoryOrError.isFailure) {
      return Result.fail(categoryOrError.error);
    }

    const emojiOrError = Emoji.create(props.emoji);
    if (emojiOrError.isFailure) {
      return Result.fail(emojiOrError.error);
    }

    // Validate transaction date
    if (
      !(props.transactionDate instanceof Date) ||
      isNaN(props.transactionDate.getTime())
    ) {
      return Result.fail("Transaction date must be a valid date");
    }

    const now = new Date();
    const transactionId = TransactionId.generate();

    return Result.ok(
      new Transaction({
        id: transactionId,
        name: nameOrError.value,
        type,
        amount: amountOrError.value,
        category: categoryOrError.value,
        emoji: emojiOrError.value,
        transactionDate: props.transactionDate,
        createdAt: now,
        updatedAt: now,
      })
    );
  }

  /**
   * Reconstitute Transaction from persistence (for reads)
   */
  public static reconstitute(props: TransactionProps): Result<Transaction> {
    return Result.ok(new Transaction(props));
  }

  /**
   * Update transaction details
   */
  public update(props: UpdateTransactionProps): Result<void> {
    // Update name if provided
    if (props.name !== undefined) {
      const nameOrError = TransactionName.create(props.name);
      if (nameOrError.isFailure) {
        return Result.fail(nameOrError.error);
      }
      this._name = nameOrError.value;
    }

    // Update type if provided
    if (props.type !== undefined) {
      if (
        props.type !== TransactionType.INCOME &&
        props.type !== TransactionType.EXPENSE
      ) {
        return Result.fail('Type must be either "income" or "expense"');
      }
      this._type = props.type as TransactionType;
    }

    // Update amount if provided
    if (props.amount !== undefined) {
      const amountOrError = Money.create(props.amount);
      if (amountOrError.isFailure) {
        return Result.fail(amountOrError.error);
      }
      this._amount = amountOrError.value;
    }

    // Update category if provided
    if (props.categoryId !== undefined) {
      if (!props.categoryName || !props.categoryColorTag) {
        return Result.fail(
          "Category name and color tag are required when changing category"
        );
      }

      const categoryOrError = TransactionCategory.create(
        props.categoryId,
        props.categoryName,
        props.categoryColorTag
      );
      if (categoryOrError.isFailure) {
        return Result.fail(categoryOrError.error);
      }

      // Business rule: Cannot change category if transaction is older than 30 days
      if (this.isOlderThan(30)) {
        return Result.fail(
          "Cannot change category for transactions older than 30 days"
        );
      }

      this._category = categoryOrError.value;
    }

    // Update emoji if provided
    if (props.emoji !== undefined) {
      const emojiOrError = Emoji.create(props.emoji);
      if (emojiOrError.isFailure) {
        return Result.fail(emojiOrError.error);
      }
      this._emoji = emojiOrError.value;
    }

    // Update transaction date if provided
    if (props.transactionDate !== undefined) {
      if (
        !(props.transactionDate instanceof Date) ||
        isNaN(props.transactionDate.getTime())
      ) {
        return Result.fail("Transaction date must be a valid date");
      }
      this._transactionDate = props.transactionDate;
    }

    // Touch to update timestamp
    this.touch();

    return Result.ok();
  }

  /**
   * Calculate signed amount (negative for expenses, positive for income)
   * This is where the business logic lives (moved from repository)
   */
  public getSignedAmount(): number {
    return this._type === TransactionType.INCOME
      ? this._amount.value
      : -this._amount.value;
  }

  /**
   * Check if transaction is older than specified days
   */
  public isOlderThan(days: number): boolean {
    const now = new Date();
    const diff = now.getTime() - this._createdAt.getTime();
    const daysDiff = diff / (1000 * 60 * 60 * 24);
    return daysDiff > days;
  }

  /**
   * Check if this is an expense
   */
  public isExpense(): boolean {
    return this._type === TransactionType.EXPENSE;
  }

  /**
   * Check if this is income
   */
  public isIncome(): boolean {
    return this._type === TransactionType.INCOME;
  }

  /**
   * Convert to DTO for API response
   */
  public toDto(): TransactionDto {
    return {
      id: this._id,
      name: this._name.value,
      type: this._type,
      amount: this._amount.value,
      category: this._category.toDto(),
      emoji: this._emoji.value,
      transactionDate: this._transactionDate,
      signedAmount: this.getSignedAmount(),
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
