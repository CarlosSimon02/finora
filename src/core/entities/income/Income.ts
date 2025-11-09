import { Entity, Result } from "@/core/entities/shared";
import { IncomeDto } from "@/core/schemas";
import { IncomeId, IncomeName } from "@/core/valueObjects/income";
import { ColorTag } from "@/core/valueObjects/transaction";

interface IncomeProps {
  id: IncomeId;
  name: IncomeName;
  colorTag: ColorTag;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateIncomeProps {
  name: string;
  colorTag: string;
}

interface UpdateIncomeProps {
  name?: string;
  colorTag?: string;
}

/**
 * Income Entity (Aggregate Root)
 * Represents an income category for tracking earnings
 */
export class Income extends Entity<string> {
  private _name: IncomeName;
  private _colorTag: ColorTag;

  private constructor(props: IncomeProps) {
    super(props.id.value, props.createdAt, props.updatedAt);
    this._name = props.name;
    this._colorTag = props.colorTag;
  }

  // Getters
  get incomeId(): IncomeId {
    return IncomeId.create(this._id).value;
  }

  get name(): IncomeName {
    return this._name;
  }

  get colorTag(): ColorTag {
    return this._colorTag;
  }

  /**
   * Create a new Income
   */
  public static create(props: CreateIncomeProps): Result<Income> {
    // Create value objects
    const nameOrError = IncomeName.create(props.name);
    if (nameOrError.isFailure) {
      return Result.fail(nameOrError.error);
    }

    const colorTagOrError = ColorTag.create(props.colorTag);
    if (colorTagOrError.isFailure) {
      return Result.fail(colorTagOrError.error);
    }

    const now = new Date();
    const incomeId = IncomeId.generate();

    return Result.ok(
      new Income({
        id: incomeId,
        name: nameOrError.value,
        colorTag: colorTagOrError.value,
        createdAt: now,
        updatedAt: now,
      })
    );
  }

  /**
   * Reconstitute Income from persistence (for reads)
   */
  public static reconstitute(props: IncomeProps): Result<Income> {
    return Result.ok(new Income(props));
  }

  /**
   * Update income details
   */
  public update(props: UpdateIncomeProps): Result<void> {
    // Update name if provided
    if (props.name !== undefined) {
      const nameOrError = IncomeName.create(props.name);
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

    // Touch to update timestamp
    this.touch();

    return Result.ok();
  }

  /**
   * Convert to DTO for API response
   */
  public toDto(): IncomeDto {
    return {
      id: this._id,
      name: this._name.value,
      colorTag: this._colorTag.value as any, // Type validated in ColorTag.create()
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
