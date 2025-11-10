import { Result, ValueObject } from "@/core/entities/shared";
import { generateId } from "@/utils";

interface IncomeIdProps {
  value: string;
}

/**
 * IncomeId Value Object
 * Represents a unique income identifier
 */
export class IncomeId extends ValueObject<IncomeIdProps> {
  private constructor(props: IncomeIdProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  /**
   * Create from existing ID
   */
  public static create(id: string): Result<IncomeId> {
    if (!id || id.trim().length === 0) {
      return Result.fail("Income ID is required");
    }

    return Result.ok(new IncomeId({ value: id.trim() }));
  }

  /**
   * Generate a new unique ID
   */
  public static generate(): IncomeId {
    const id = generateId();
    return new IncomeId({ value: id });
  }
}
