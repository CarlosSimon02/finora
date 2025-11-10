import { Result, ValueObject } from "@/core/entities/shared";
import { generateId } from "@/utils";

interface PotIdProps {
  value: string;
}

/**
 * PotId Value Object
 * Represents a unique pot identifier
 */
export class PotId extends ValueObject<PotIdProps> {
  private constructor(props: PotIdProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  /**
   * Create from existing ID
   */
  public static create(id: string): Result<PotId> {
    if (!id || id.trim().length === 0) {
      return Result.fail("Pot ID is required");
    }

    return Result.ok(new PotId({ value: id.trim() }));
  }

  /**
   * Generate a new unique ID
   */
  public static generate(): PotId {
    const id = generateId();
    return new PotId({ value: id });
  }
}
