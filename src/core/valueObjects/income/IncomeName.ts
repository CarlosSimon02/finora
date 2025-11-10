import { COMMON_MAX_NAME_LENGTH } from "@/core/constants";
import { Result, ValueObject } from "@/core/entities/shared";

interface IncomeNameProps {
  value: string;
}

/**
 * IncomeName Value Object
 * Represents an income category name with validation
 */
export class IncomeName extends ValueObject<IncomeNameProps> {
  private constructor(props: IncomeNameProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(name: string): Result<IncomeName> {
    // Trim whitespace
    const trimmed = name.trim();

    // Validate not empty
    if (trimmed.length === 0) {
      return Result.fail("Income name is required");
    }

    // Validate max length
    if (trimmed.length > COMMON_MAX_NAME_LENGTH) {
      return Result.fail(
        `Income name must be at most ${COMMON_MAX_NAME_LENGTH} characters`
      );
    }

    return Result.ok(new IncomeName({ value: trimmed }));
  }
}
