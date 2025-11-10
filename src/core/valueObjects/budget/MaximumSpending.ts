import { COMMON_MAX_NUMBER } from "@/core/constants";
import { Result, ValueObject } from "@/core/entities/shared";

interface MaximumSpendingProps {
  amount: number;
}

/**
 * MaximumSpending Value Object
 * Represents the maximum spending limit for a budget with validation rules
 */
export class MaximumSpending extends ValueObject<MaximumSpendingProps> {
  private constructor(props: MaximumSpendingProps) {
    super(props);
  }

  get value(): number {
    return this.props.amount;
  }

  public static create(amount: number): Result<MaximumSpending> {
    // Validate positive
    if (amount <= 0) {
      return Result.fail("Maximum spending must be greater than 0");
    }

    // Validate max value
    if (amount > COMMON_MAX_NUMBER) {
      return Result.fail(
        `Maximum spending must be at most ${COMMON_MAX_NUMBER}`
      );
    }

    // Validate decimal places (max 2)
    if (!this.hasValidDecimals(amount)) {
      return Result.fail("Maximum spending must have at most 2 decimal places");
    }

    return Result.ok(new MaximumSpending({ amount }));
  }

  /**
   * Check if amount has valid decimal places (max 2)
   */
  private static hasValidDecimals(amount: number): boolean {
    const str = amount.toString();
    const decimalIndex = str.indexOf(".");
    return decimalIndex === -1 || str.length - decimalIndex - 1 <= 2;
  }

  /**
   * Check if spending limit is exceeded
   */
  public isExceeded(currentSpending: number): boolean {
    return currentSpending > this.value;
  }

  /**
   * Calculate remaining budget
   */
  public remainingAmount(currentSpending: number): number {
    const remaining = this.value - currentSpending;
    return remaining > 0 ? remaining : 0;
  }

  /**
   * Calculate percentage spent
   */
  public percentageSpent(currentSpending: number): number {
    if (this.value === 0) return 0;
    const percentage = (currentSpending / this.value) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  }
}
