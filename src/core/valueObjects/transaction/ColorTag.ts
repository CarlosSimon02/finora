import { COLOR_OPTIONS } from "@/constants/colors";
import { Result, ValueObject } from "@/core/entities/shared";

interface ColorTagProps {
  value: string;
}

/**
 * ColorTag Value Object
 * Represents a color tag from predefined options
 */
export class ColorTag extends ValueObject<ColorTagProps> {
  private constructor(props: ColorTagProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(color: string): Result<ColorTag> {
    // Validate color is from available options
    const validColors = COLOR_OPTIONS.map((o) => o.value) as readonly string[];
    if (!validColors.includes(color)) {
      return Result.fail("Color tag must be a valid color option");
    }

    return Result.ok(new ColorTag({ value: color }));
  }
}
