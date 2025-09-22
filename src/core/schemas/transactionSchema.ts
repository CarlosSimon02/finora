import {
  TRANSACTION_AMOUNT_DECIMALS_REGEX,
  TRANSACTION_NAME_MAX_LENGTH,
} from "@/core/constants";
import { z } from "zod";
import {
  isValidEmoji,
  trimmedStringSchema,
  validateOptionalHexColor,
} from "./helpers";
import { createPaginationResponseSchema } from "./paginationSchema";

export const transactionCategorySchema = z.object({
  id: trimmedStringSchema.min(1, "Category ID is required"),
  name: trimmedStringSchema.min(1, "Category name is required"),
  colorTag: trimmedStringSchema.refine(validateOptionalHexColor, {
    message: "Color must be a valid hex color code (e.g., #FF5733) or null",
  }),
});

export const transactionTypeSchema = z.enum(["income", "expense"], {
  error: () => ({ message: 'Type must be either "income" or "expense"' }),
});

const baseTransactionSchema = z.object({
  name: trimmedStringSchema
    .min(1, "Transaction name is required")
    .max(
      TRANSACTION_NAME_MAX_LENGTH,
      `Transaction name must be at most ${TRANSACTION_NAME_MAX_LENGTH} characters`
    ),
  type: transactionTypeSchema,
  amount: z
    .number()
    .positive("Amount must be greater than 0")
    .refine(
      (val) => TRANSACTION_AMOUNT_DECIMALS_REGEX.test(val.toString()),
      "Amount must have at most 2 decimal places"
    ),
  recipientOrPayer: trimmedStringSchema.nullable(),
  transactionDate: z.instanceof(Date, {
    message: "Transaction date must be a valid date",
  }),
  description: trimmedStringSchema.nullable(),
  emoji: trimmedStringSchema.refine(isValidEmoji, {
    message: "Only emoji characters are allowed",
  }),
});

export const createTransactionSchema = baseTransactionSchema.extend({
  categoryId: trimmedStringSchema.min(1, "Category ID is required"),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const transactionSchema = baseTransactionSchema.extend({
  id: trimmedStringSchema.min(1, "Transaction ID is required"),
  createdAt: z.instanceof(Date),
  updatedAt: z.instanceof(Date),
  category: transactionCategorySchema,
});

export const paginatedTransactionsResponseSchema =
  createPaginationResponseSchema(transactionSchema);

export type CreateTransactionDto = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionDto = z.infer<typeof updateTransactionSchema>;
export type TransactionDto = z.infer<typeof transactionSchema>;
export type TransactionCategoryDto = z.infer<typeof transactionCategorySchema>;
export type TransactionTypeDto = z.infer<typeof transactionTypeSchema>;
export type PaginatedTransactionsResponseDto = z.infer<
  typeof paginatedTransactionsResponseSchema
>;
