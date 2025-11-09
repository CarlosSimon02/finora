import { TRANSACTION_NAME_MAX_LENGTH } from "@/core/constants";
import { Result, ValueObject } from "@/core/entities/shared";

interface TransactionNameProps {
  value: string;
}

/**
 * TransactionName Value Object
 * Represents a transaction name with validation
 */
export class TransactionName extends ValueObject<TransactionNameProps> {
  private constructor(props: TransactionNameProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(name: string): Result<TransactionName> {
    // Trim whitespace
    const trimmed = name.trim();

    // Validate not empty
    if (trimmed.length === 0) {
      return Result.fail("Transaction name is required");
    }

    // Validate max length
    if (trimmed.length > TRANSACTION_NAME_MAX_LENGTH) {
      return Result.fail(
        `Transaction name must be at most ${TRANSACTION_NAME_MAX_LENGTH} characters`
      );
    }

    return Result.ok(new TransactionName({ value: trimmed }));
  }
}
