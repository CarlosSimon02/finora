import { COMMON_MAX_NAME_LENGTH } from "@/core/constants";
import { Result, ValueObject } from "@/core/entities/shared";

interface BudgetNameProps {
  value: string;
}

/**
 * BudgetName Value Object
 * Represents a budget name with validation
 */
export class BudgetName extends ValueObject<BudgetNameProps> {
  private constructor(props: BudgetNameProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(name: string): Result<BudgetName> {
    // Trim whitespace
    const trimmed = name.trim();

    // Validate not empty
    if (trimmed.length === 0) {
      return Result.fail("Budget name is required");
    }

    // Validate max length
    if (trimmed.length > COMMON_MAX_NAME_LENGTH) {
      return Result.fail(
        `Budget name must be at most ${COMMON_MAX_NAME_LENGTH} characters`
      );
    }

    return Result.ok(new BudgetName({ value: trimmed }));
  }
}
