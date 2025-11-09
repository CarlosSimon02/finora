import { COMMON_MAX_NAME_LENGTH } from "@/core/constants";
import { Result, ValueObject } from "@/core/entities/shared";

interface PotNameProps {
  value: string;
}

/**
 * PotName Value Object
 * Represents a pot name with validation
 */
export class PotName extends ValueObject<PotNameProps> {
  private constructor(props: PotNameProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(name: string): Result<PotName> {
    // Trim whitespace
    const trimmed = name.trim();

    // Validate not empty
    if (trimmed.length === 0) {
      return Result.fail("Pot name is required");
    }

    // Validate max length
    if (trimmed.length > COMMON_MAX_NAME_LENGTH) {
      return Result.fail(
        `Pot name must be at most ${COMMON_MAX_NAME_LENGTH} characters`
      );
    }

    return Result.ok(new PotName({ value: trimmed }));
  }
}
