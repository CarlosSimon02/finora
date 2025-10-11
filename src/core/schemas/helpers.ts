import { COLOR_OPTIONS } from "@/constants/colors";
import {
  COMMON_MAX_DESCRIPTION_LENGTH,
  COMMON_MAX_NAME_LENGTH,
  COMMON_MAX_NUMBER,
} from "@/core/constants";
import emojiRegex from "emoji-regex";
import { z } from "zod";

// Validation functions
export const validateTwoDecimalPlaces = (val: number): boolean => {
  const str = val.toString();
  const decimalIndex = str.indexOf(".");
  return decimalIndex === -1 || str.length - decimalIndex - 1 <= 2;
};

export const validateOptionalHexColor = (color: string | null): boolean => {
  if (color === null) return true;
  return /^#[0-9A-F]{6}$/i.test(color);
};

export const isValidEmoji = (value: string): boolean => {
  const trimmed = value.trim();
  return (
    trimmed.length > 0 &&
    [...trimmed.matchAll(emojiRegex())].join("") === trimmed
  );
};

// Base schemas
export const trimmedStringSchema = z.string().trim();

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
  .optional();

export const idSchema = trimmedStringSchema.min(1, "ID is required");

export const emailSchema = z
  .string()
  .email("Please enter a valid email address");

export const colorTagSchema = z.enum(
  COLOR_OPTIONS.map((o) => o.value),
  { message: "Color tag must be a valid color" }
);

// Number schemas
export const positiveNumberSchema = z
  .number()
  .positive("Must be greater than 0")
  .max(COMMON_MAX_NUMBER, `Must be at most ${COMMON_MAX_NUMBER}`);

export const nonNegativeNumberSchema = z
  .number()
  .nonnegative("Must be non-negative")
  .max(COMMON_MAX_NUMBER, `Must be at most ${COMMON_MAX_NUMBER}`);

// Money schemas with decimal validation
const createMoneySchema = (schema: z.ZodNumber) =>
  schema.refine(
    validateTwoDecimalPlaces,
    "Amount must have at most 2 decimal places"
  );

export const moneyAmountSchema = createMoneySchema(
  z
    .number()
    .positive("Amount must be greater than 0")
    .max(COMMON_MAX_NUMBER, `Amount must be at most ${COMMON_MAX_NUMBER}`)
);

export const nonNegativeMoneyAmountSchema = createMoneySchema(
  z
    .number()
    .nonnegative("Amount must be non-negative")
    .max(COMMON_MAX_NUMBER, `Amount must be at most ${COMMON_MAX_NUMBER}`)
);

// Entity base schemas
export const baseEntitySchema = z.object({
  id: idSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const baseCreateSchema = z.object({
  name: nameSchema,
  colorTag: colorTagSchema,
});
