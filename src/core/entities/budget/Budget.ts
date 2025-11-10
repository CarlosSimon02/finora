import { Entity, Result } from "@/core/entities/shared";
import { BudgetDto } from "@/core/schemas";
import {
  BudgetId,
  BudgetName,
  MaximumSpending,
} from "@/core/valueObjects/budget";
import { ColorTag } from "@/core/valueObjects/transaction";

interface BudgetProps {
  id: BudgetId;
  name: BudgetName;
  colorTag: ColorTag;
  maximumSpending: MaximumSpending;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateBudgetProps {
  name: string;
  colorTag: string;
  maximumSpending: number;
}

interface UpdateBudgetProps {
  name?: string;
  colorTag?: string;
  maximumSpending?: number;
}

/**
 * Budget Entity (Aggregate Root)
 * Represents a spending budget category with a maximum spending limit
 */
export class Budget extends Entity<string> {
  private _name: BudgetName;
  private _colorTag: ColorTag;
  private _maximumSpending: MaximumSpending;

  private constructor(props: BudgetProps) {
    super(props.id.value, props.createdAt, props.updatedAt);
    this._name = props.name;
    this._colorTag = props.colorTag;
    this._maximumSpending = props.maximumSpending;
  }

  // Getters
  get budgetId(): BudgetId {
    return BudgetId.create(this._id).value;
  }

  get name(): BudgetName {
    return this._name;
  }

  get colorTag(): ColorTag {
    return this._colorTag;
  }

  get maximumSpending(): MaximumSpending {
    return this._maximumSpending;
  }

  /**
   * Create a new Budget
   */
  public static create(props: CreateBudgetProps): Result<Budget> {
    // Create value objects
    const nameOrError = BudgetName.create(props.name);
    if (nameOrError.isFailure) {
      return Result.fail(nameOrError.error);
    }

    const colorTagOrError = ColorTag.create(props.colorTag);
    if (colorTagOrError.isFailure) {
      return Result.fail(colorTagOrError.error);
    }

    const maximumSpendingOrError = MaximumSpending.create(
      props.maximumSpending
    );
    if (maximumSpendingOrError.isFailure) {
      return Result.fail(maximumSpendingOrError.error);
    }

    const now = new Date();
    const budgetId = BudgetId.generate();

    return Result.ok(
      new Budget({
        id: budgetId,
        name: nameOrError.value,
        colorTag: colorTagOrError.value,
        maximumSpending: maximumSpendingOrError.value,
        createdAt: now,
        updatedAt: now,
      })
    );
  }

  /**
   * Reconstitute Budget from persistence (for reads)
   */
  public static reconstitute(props: BudgetProps): Result<Budget> {
    return Result.ok(new Budget(props));
  }

  /**
   * Update budget details
   */
  public update(props: UpdateBudgetProps): Result<void> {
    // Update name if provided
    if (props.name !== undefined) {
      const nameOrError = BudgetName.create(props.name);
      if (nameOrError.isFailure) {
        return Result.fail(nameOrError.error);
      }
      this._name = nameOrError.value;
    }

    // Update colorTag if provided
    if (props.colorTag !== undefined) {
      const colorTagOrError = ColorTag.create(props.colorTag);
      if (colorTagOrError.isFailure) {
        return Result.fail(colorTagOrError.error);
      }
      this._colorTag = colorTagOrError.value;
    }

    // Update maximum spending if provided
    if (props.maximumSpending !== undefined) {
      const maximumSpendingOrError = MaximumSpending.create(
        props.maximumSpending
      );
      if (maximumSpendingOrError.isFailure) {
        return Result.fail(maximumSpendingOrError.error);
      }
      this._maximumSpending = maximumSpendingOrError.value;
    }

    // Touch to update timestamp
    this.touch();

    return Result.ok();
  }

  /**
   * Check if budget is exceeded
   */
  public isExceeded(currentSpending: number): boolean {
    return this._maximumSpending.isExceeded(currentSpending);
  }

  /**
   * Get remaining budget amount
   */
  public getRemainingAmount(currentSpending: number): number {
    return this._maximumSpending.remainingAmount(currentSpending);
  }

  /**
   * Get percentage of budget spent
   */
  public getPercentageSpent(currentSpending: number): number {
    return this._maximumSpending.percentageSpent(currentSpending);
  }

  /**
   * Convert to DTO for API response
   */
  public toDto(): BudgetDto {
    return {
      id: this._id,
      name: this._name.value,
      colorTag: this._colorTag.value as any, // Type validated in ColorTag.create()
      maximumSpending: this._maximumSpending.value,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
