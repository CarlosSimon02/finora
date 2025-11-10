import { COMMON_MAX_NUMBER, POT_MONEY_OPERATION_MIN } from "@/core/constants";
import { Entity, Result } from "@/core/entities/shared";
import { PotDto } from "@/core/schemas";
import { PotId, PotName, PotTarget } from "@/core/valueObjects/pot";
import { Money } from "@/core/valueObjects/shared";
import { ColorTag } from "@/core/valueObjects/transaction";

interface PotProps {
  id: PotId;
  name: PotName;
  colorTag: ColorTag;
  target: PotTarget;
  totalSaved: Money;
  createdAt: Date;
  updatedAt: Date;
}

interface CreatePotProps {
  name: string;
  colorTag: string;
  target: number;
}

interface UpdatePotProps {
  name?: string;
  colorTag?: string;
  target?: number;
}

/**
 * Pot Entity (Aggregate Root)
 * Represents a savings pot with target and current balance
 */
export class Pot extends Entity<string> {
  private _name: PotName;
  private _colorTag: ColorTag;
  private _target: PotTarget;
  private _totalSaved: Money;

  private constructor(props: PotProps) {
    super(props.id.value, props.createdAt, props.updatedAt);
    this._name = props.name;
    this._colorTag = props.colorTag;
    this._target = props.target;
    this._totalSaved = props.totalSaved;
  }

  // Getters
  get potId(): PotId {
    return PotId.create(this._id).value;
  }

  get name(): PotName {
    return this._name;
  }

  get colorTag(): ColorTag {
    return this._colorTag;
  }

  get target(): PotTarget {
    return this._target;
  }

  get totalSaved(): Money {
    return this._totalSaved;
  }

  /**
   * Create a new Pot
   */
  public static create(props: CreatePotProps): Result<Pot> {
    // Create value objects
    const nameOrError = PotName.create(props.name);
    if (nameOrError.isFailure) {
      return Result.fail(nameOrError.error);
    }

    const colorTagOrError = ColorTag.create(props.colorTag);
    if (colorTagOrError.isFailure) {
      return Result.fail(colorTagOrError.error);
    }

    const targetOrError = PotTarget.create(props.target);
    if (targetOrError.isFailure) {
      return Result.fail(targetOrError.error);
    }

    // Initial totalSaved is always 0
    const totalSavedOrError = Money.create(0);
    if (totalSavedOrError.isFailure) {
      return Result.fail(totalSavedOrError.error);
    }

    const now = new Date();
    const potId = PotId.generate();

    return Result.ok(
      new Pot({
        id: potId,
        name: nameOrError.value,
        colorTag: colorTagOrError.value,
        target: targetOrError.value,
        totalSaved: totalSavedOrError.value,
        createdAt: now,
        updatedAt: now,
      })
    );
  }

  /**
   * Reconstitute Pot from persistence (for reads)
   */
  public static reconstitute(props: PotProps): Result<Pot> {
    return Result.ok(new Pot(props));
  }

  /**
   * Update pot details
   */
  public update(props: UpdatePotProps): Result<void> {
    // Update name if provided
    if (props.name !== undefined) {
      const nameOrError = PotName.create(props.name);
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

    // Update target if provided
    if (props.target !== undefined) {
      const targetOrError = PotTarget.create(props.target);
      if (targetOrError.isFailure) {
        return Result.fail(targetOrError.error);
      }

      // Business rule: Cannot set target below current saved amount
      if (props.target < this._totalSaved.value) {
        return Result.fail(
          "Target cannot be less than the current saved amount"
        );
      }

      this._target = targetOrError.value;
    }

    // Touch to update timestamp
    this.touch();

    return Result.ok();
  }

  /**
   * Add money to pot
   * Business logic: Enforces minimum amount and maximum limit
   */
  public addMoney(amount: number): Result<void> {
    // Validate minimum amount
    if (amount < POT_MONEY_OPERATION_MIN) {
      return Result.fail(`Amount must be at least ${POT_MONEY_OPERATION_MIN}`);
    }

    // Create Money value object for the amount
    const moneyToAddOrError = Money.create(amount);
    if (moneyToAddOrError.isFailure) {
      return Result.fail(moneyToAddOrError.error);
    }

    // Business rule: Cannot exceed maximum number
    const newTotal = this._totalSaved.value + amount;
    if (newTotal > COMMON_MAX_NUMBER) {
      return Result.fail("Amount exceeds maximum limit");
    }

    // Create new total saved
    const newTotalSavedOrError = Money.create(newTotal);
    if (newTotalSavedOrError.isFailure) {
      return Result.fail(newTotalSavedOrError.error);
    }

    this._totalSaved = newTotalSavedOrError.value;
    this.touch();

    return Result.ok();
  }

  /**
   * Withdraw money from pot
   * Business logic: Cannot withdraw more than available
   */
  public withdrawMoney(amount: number): Result<void> {
    // Validate minimum amount
    if (amount < POT_MONEY_OPERATION_MIN) {
      return Result.fail(`Amount must be at least ${POT_MONEY_OPERATION_MIN}`);
    }

    // Create Money value object for the amount
    const moneyToWithdrawOrError = Money.create(amount);
    if (moneyToWithdrawOrError.isFailure) {
      return Result.fail(moneyToWithdrawOrError.error);
    }

    // Business rule: Cannot withdraw more than saved
    if (this._totalSaved.value < amount) {
      return Result.fail("Insufficient funds in pot");
    }

    // Calculate new total
    const newTotal = this._totalSaved.value - amount;
    const newTotalSavedOrError = Money.create(newTotal);
    if (newTotalSavedOrError.isFailure) {
      return Result.fail(newTotalSavedOrError.error);
    }

    this._totalSaved = newTotalSavedOrError.value;
    this.touch();

    return Result.ok();
  }

  /**
   * Check if target is achieved
   */
  public isTargetAchieved(): boolean {
    return this._target.isAchieved(this._totalSaved.value);
  }

  /**
   * Get remaining amount to reach target
   */
  public getRemainingAmount(): number {
    return this._target.remainingAmount(this._totalSaved.value);
  }

  /**
   * Get percentage of target achieved
   */
  public getPercentageAchieved(): number {
    return this._target.percentageAchieved(this._totalSaved.value);
  }

  /**
   * Check if pot has any savings
   */
  public hasSavings(): boolean {
    return this._totalSaved.value > 0;
  }

  /**
   * Convert to DTO for API response
   */
  public toDto(): PotDto {
    return {
      id: this._id,
      name: this._name.value,
      colorTag: this._colorTag.value as any, // Type validated in ColorTag.create()
      target: this._target.value,
      totalSaved: this._totalSaved.value,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
