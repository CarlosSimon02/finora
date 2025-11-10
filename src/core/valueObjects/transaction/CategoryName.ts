import { COMMON_MAX_NAME_LENGTH } from "@/core/constants";
import { Result, ValueObject } from "@/core/entities/shared";

interface CategoryNameProps {
  value: string;
}

/**
 * CategoryName Value Object
 * Represents a category name with validation
 */
export class CategoryName extends ValueObject<CategoryNameProps> {
  private constructor(props: CategoryNameProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(name: string): Result<CategoryName> {
    // Trim whitespace
    const trimmed = name.trim();

    // Validate not empty
    if (trimmed.length === 0) {
      return Result.fail("Category name is required");
    }

    // Validate max length
    if (trimmed.length > COMMON_MAX_NAME_LENGTH) {
      return Result.fail(
        `Category name must be at most ${COMMON_MAX_NAME_LENGTH} characters`
      );
    }

    return Result.ok(new CategoryName({ value: trimmed }));
  }
}
