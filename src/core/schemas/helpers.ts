import {
  COMMON_MAX_DESCRIPTION_LENGTH,
  COMMON_MAX_NAME_LENGTH,
  COMMON_MAX_NUMBER,
} from "@/core/constants";
import emojiRegex from "emoji-regex";
import { z } from "zod";

export const validateOptionalHexColor = (color: string | null) => {
  if (color === null) return true;
  return /^#[0-9A-F]{6}$/i.test(color);
};

export const isValidEmoji = (value: string) => {
  const trimmed = value.trim();
  return (
    trimmed.length > 0 &&
    [...trimmed.matchAll(emojiRegex())].join("") === trimmed
  );
};

export const trimmedStringSchema = z.string().trim();

// Common schema helpers using shared constants

export const nameSchema = trimmedStringSchema
  .min(1, "Name is required")
  .max(
    COMMON_MAX_NAME_LENGTH,
    `Name must be at most ${COMMON_MAX_NAME_LENGTH} characters`
  );

export const optionalDescriptionSchema = trimmedStringSchema
  .max(
    COMMON_MAX_DESCRIPTION_LENGTH,
    `Description must be at most ${COMMON_MAX_DESCRIPTION_LENGTH} characters`
  )
  .nullable();

export const positiveNumberSchema = z
  .number()
  .positive("Must be greater than 0")
  .max(COMMON_MAX_NUMBER, `Must be at most ${COMMON_MAX_NUMBER}`);

export const nonNegativeNumberSchema = z
  .number()
  .nonnegative("Must be non-negative")
  .max(COMMON_MAX_NUMBER, `Must be at most ${COMMON_MAX_NUMBER}`);

// Validator for money amounts (max 2 decimal places)
export const validateTwoDecimalPlaces = (val: number) => {
  // Convert to string and check decimal places
  const str = val.toString();
  const decimalIndex = str.indexOf(".");
  if (decimalIndex === -1) return true; // No decimal places is valid
  return str.length - decimalIndex - 1 <= 2;
};

// Money/amount schemas with 2 decimal place restriction
export const moneyAmountSchema = z
  .number()
  .positive("Amount must be greater than 0")
  .max(COMMON_MAX_NUMBER, `Amount must be at most ${COMMON_MAX_NUMBER}`)
  .refine(
    validateTwoDecimalPlaces,
    "Amount must have at most 2 decimal places"
  );

export const nonNegativeMoneyAmountSchema = z
  .number()
  .nonnegative("Amount must be non-negative")
  .max(COMMON_MAX_NUMBER, `Amount must be at most ${COMMON_MAX_NUMBER}`)
  .refine(
    validateTwoDecimalPlaces,
    "Amount must have at most 2 decimal places"
  );

export const idSchema = trimmedStringSchema.min(1, "ID is required");
