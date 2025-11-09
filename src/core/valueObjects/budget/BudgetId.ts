import { Result, ValueObject } from "@/core/entities/shared";
import { generateId } from "@/utils";

interface BudgetIdProps {
  value: string;
}

/**
 * BudgetId Value Object
 * Represents a unique budget identifier
 */
export class BudgetId extends ValueObject<BudgetIdProps> {
  private constructor(props: BudgetIdProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  /**
   * Create from existing ID
   */
  public static create(id: string): Result<BudgetId> {
    if (!id || id.trim().length === 0) {
      return Result.fail("Budget ID is required");
    }

    return Result.ok(new BudgetId({ value: id.trim() }));
  }

  /**
   * Generate a new unique ID
   */
  public static generate(): BudgetId {
    const id = generateId();
    return new BudgetId({ value: id });
  }
}
