import { Result, ValueObject } from "@/core/entities/shared";

interface CategoryIdProps {
  value: string;
}

/**
 * CategoryId Value Object
 * Represents a unique category identifier
 */
export class CategoryId extends ValueObject<CategoryIdProps> {
  private constructor(props: CategoryIdProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(id: string): Result<CategoryId> {
    if (!id || id.trim().length === 0) {
      return Result.fail("Category ID is required");
    }

    return Result.ok(new CategoryId({ value: id.trim() }));
  }
}
