import { Result } from "@/core/entities/shared";
import { TransactionCategoryDto } from "@/core/schemas";
import {
  CategoryId,
  CategoryName,
  ColorTag,
} from "@/core/valueObjects/transaction";

interface TransactionCategoryProps {
  id: CategoryId;
  name: CategoryName;
  colorTag: ColorTag;
}

/**
 * TransactionCategory Entity
 * Represents a category (budget or income) that a transaction belongs to
 */
export class TransactionCategory {
  private readonly props: TransactionCategoryProps;

  private constructor(props: TransactionCategoryProps) {
    this.props = props;
  }

  get id(): CategoryId {
    return this.props.id;
  }

  get name(): CategoryName {
    return this.props.name;
  }

  get colorTag(): ColorTag {
    return this.props.colorTag;
  }

  /**
   * Create a new TransactionCategory
   */
  public static create(
    id: string,
    name: string,
    colorTag: string
  ): Result<TransactionCategory> {
    // Create value objects
    const categoryIdOrError = CategoryId.create(id);
    if (categoryIdOrError.isFailure) {
      return Result.fail(categoryIdOrError.error);
    }

    const categoryNameOrError = CategoryName.create(name);
    if (categoryNameOrError.isFailure) {
      return Result.fail(categoryNameOrError.error);
    }

    const colorTagOrError = ColorTag.create(colorTag);
    if (colorTagOrError.isFailure) {
      return Result.fail(colorTagOrError.error);
    }

    return Result.ok(
      new TransactionCategory({
        id: categoryIdOrError.value,
        name: categoryNameOrError.value,
        colorTag: colorTagOrError.value,
      })
    );
  }

  /**
   * Compare categories by ID
   */
  public equals(other?: TransactionCategory): boolean {
    if (!other) return false;
    return this.id.equals(other.id);
  }

  /**
   * Convert to DTO for API response
   */
  public toDto(): TransactionCategoryDto {
    return {
      id: this.id.value,
      name: this.name.value,
      colorTag: this.colorTag.value as any, // Type is validated in ColorTag.create()
    };
  }
}
