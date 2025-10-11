import { TRANSACTION_NAME_MAX_LENGTH } from "@/core/constants";
import { z } from "zod";
import {
  baseEntitySchema,
  colorTagSchema,
  idSchema,
  isValidEmoji,
  moneyAmountSchema,
  nameSchema,
  trimmedStringSchema,
} from "./helpers";
import { createPaginationResponseSchema } from "./paginationSchema";

export const transactionCategorySchema = z.object({
  id: idSchema,
  name: nameSchema,
  colorTag: colorTagSchema,
});

export const transactionTypeSchema = z.enum(["income", "expense"], {
  message: 'Type must be either "income" or "expense"',
});

const baseTransactionSchema = z.object({
  name: trimmedStringSchema
    .min(1, "Transaction name is required")
    .max(
      TRANSACTION_NAME_MAX_LENGTH,
      `Transaction name must be at most ${TRANSACTION_NAME_MAX_LENGTH} characters`
    ),
  type: transactionTypeSchema,
  amount: moneyAmountSchema,
  transactionDate: z.date({ message: "Transaction date must be a valid date" }),
  emoji: trimmedStringSchema.refine(
    isValidEmoji,
    "Only emoji characters are allowed"
  ),
});

export const createTransactionSchema = baseTransactionSchema.extend({
  categoryId: trimmedStringSchema.min(1, "Category is required"),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const transactionSchema = baseTransactionSchema.extend({
  ...baseEntitySchema.shape,
  category: transactionCategorySchema,
  signedAmount: z.number(),
});

export const paginatedTransactionsResponseSchema =
  createPaginationResponseSchema(transactionSchema);

export type CreateTransactionDto = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionDto = z.infer<typeof updateTransactionSchema>;
export type TransactionDto = z.infer<typeof transactionSchema>;
export type TransactionCategoryDto = z.infer<typeof transactionCategorySchema>;
export type TransactionType = z.infer<typeof transactionTypeSchema>;
export type PaginatedTransactionsResponseDto = z.infer<
  typeof paginatedTransactionsResponseSchema
>;
