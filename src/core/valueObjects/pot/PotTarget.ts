import { COMMON_MAX_NUMBER, POT_TARGET_MIN } from "@/core/constants";
import { Result, ValueObject } from "@/core/entities/shared";

interface PotTargetProps {
  amount: number;
}

/**
 * PotTarget Value Object
 * Represents a pot savings target with validation rules
 */
export class PotTarget extends ValueObject<PotTargetProps> {
  private constructor(props: PotTargetProps) {
    super(props);
  }

  get value(): number {
    return this.props.amount;
  }

  public static create(amount: number): Result<PotTarget> {
    // Validate minimum
    if (amount < POT_TARGET_MIN) {
      return Result.fail(`Target must be at least ${POT_TARGET_MIN}`);
    }

    // Validate max value
    if (amount > COMMON_MAX_NUMBER) {
      return Result.fail(`Target must be at most ${COMMON_MAX_NUMBER}`);
    }

    // Validate decimal places (max 2)
    if (!this.hasValidDecimals(amount)) {
      return Result.fail("Target must have at most 2 decimal places");
    }

    return Result.ok(new PotTarget({ amount }));
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
   * Check if target is achieved
   */
  public isAchieved(currentSaved: number): boolean {
    return currentSaved >= this.value;
  }

  /**
   * Calculate remaining amount to reach target
   */
  public remainingAmount(currentSaved: number): number {
    const remaining = this.value - currentSaved;
    return remaining > 0 ? remaining : 0;
  }

  /**
   * Calculate percentage of target achieved
   */
  public percentageAchieved(currentSaved: number): number {
    if (this.value === 0) return 0;
    const percentage = (currentSaved / this.value) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  }
}
