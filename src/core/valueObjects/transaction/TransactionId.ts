import { Result, ValueObject } from "@/core/entities/shared";
import { generateId } from "@/utils";

interface TransactionIdProps {
  value: string;
}

/**
 * TransactionId Value Object
 * Represents a unique transaction identifier
 */
export class TransactionId extends ValueObject<TransactionIdProps> {
  private constructor(props: TransactionIdProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  /**
   * Create from existing ID
   */
  public static create(id: string): Result<TransactionId> {
    if (!id || id.trim().length === 0) {
      return Result.fail("Transaction ID is required");
    }

    return Result.ok(new TransactionId({ value: id.trim() }));
  }

  /**
   * Generate a new unique ID
   */
  public static generate(): TransactionId {
    const id = generateId();
    return new TransactionId({ value: id });
  }
}
