import { COMMON_MAX_NUMBER } from "@/core/constants";
import { Result, ValueObject } from "@/core/entities/shared";

interface MoneyProps {
  amount: number;
}

/**
 * Money Value Object
 * Represents a monetary amount with validation rules
 */
export class Money extends ValueObject<MoneyProps> {
  private constructor(props: MoneyProps) {
    super(props);
  }

  get value(): number {
    return this.props.amount;
  }

  public static create(amount: number): Result<Money> {
    // Validate non-negative
    if (amount < 0) {
      return Result.fail("Money amount cannot be negative");
    }

    // Validate max value
    if (amount > COMMON_MAX_NUMBER) {
      return Result.fail(`Money amount cannot exceed ${COMMON_MAX_NUMBER}`);
    }

    // Validate decimal places (max 2)
    if (!this.hasValidDecimals(amount)) {
      return Result.fail("Money amount must have at most 2 decimal places");
    }

    return Result.ok(new Money({ amount }));
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
   * Add two money amounts
   */
  public add(other: Money): Money {
    const sum = this.value + other.value;
    const result = Money.create(sum);
    if (result.isFailure) {
      throw new Error(`Cannot add money: ${result.error}`);
    }
    return result.value;
  }

  /**
   * Subtract money amount
   */
  public subtract(other: Money): Result<Money> {
    const difference = this.value - other.value;
    return Money.create(difference);
  }

  /**
   * Negate money amount (positive to negative, negative to positive)
   */
  public negate(): Money {
    return new Money({ amount: -this.value });
  }

  /**
   * Compare if this money is greater than other
   */
  public isGreaterThan(other: Money): boolean {
    return this.value > other.value;
  }

  /**
   * Compare if this money is less than other
   */
  public isLessThan(other: Money): boolean {
    return this.value < other.value;
  }

  /**
   * Check if amount is zero
   */
  public isZero(): boolean {
    return this.value === 0;
  }
}
