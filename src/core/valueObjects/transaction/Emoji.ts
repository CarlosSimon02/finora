import { Result, ValueObject } from "@/core/entities/shared";
import emojiRegex from "emoji-regex";

interface EmojiProps {
  value: string;
}

/**
 * Emoji Value Object
 * Represents a valid emoji character
 */
export class Emoji extends ValueObject<EmojiProps> {
  private constructor(props: EmojiProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  public static create(emoji: string): Result<Emoji> {
    const trimmed = emoji.trim();

    // Validate not empty
    if (trimmed.length === 0) {
      return Result.fail("Emoji is required");
    }

    // Validate is valid emoji
    if (!this.isValidEmoji(trimmed)) {
      return Result.fail("Only emoji characters are allowed");
    }

    return Result.ok(new Emoji({ value: trimmed }));
  }

  private static isValidEmoji(value: string): boolean {
    const regex = emojiRegex();
    const matches = [...value.matchAll(regex)];
    return matches.join("") === value;
  }
}
