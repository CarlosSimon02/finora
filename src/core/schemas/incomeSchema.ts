import {
  INCOME_NAME_MAX_LENGTH,
  INCOME_SUMMARY_MAX_ITEMS,
  TRANSACTION_PREVIEW_MAX_COUNT,
} from "@/core/constants";
import { z } from "zod";
import { validateOptionalHexColor } from "./helpers";
import { createPaginationResponseSchema } from "./paginationSchema";
import { transactionSchema } from "./transactionSchema";

export const createIncomeSchema = z.object({
  name: z
    .string()
    .min(1, "Income name is required")
    .max(
      INCOME_NAME_MAX_LENGTH,
      `Income name must be at most ${INCOME_NAME_MAX_LENGTH} characters`
    ),
  colorTag: z.string().refine(validateOptionalHexColor, {
    message: "Color tag must be a valid hex color code (e.g., #FF5733)",
  }),
});

export const updateIncomeSchema = createIncomeSchema.partial();

export const incomeSchema = createIncomeSchema.extend({
  id: z.string().min(1, "Income ID is required"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const incomeSchemaWithTotalEarned = incomeSchema.extend({
  totalEarned: z.number().int().min(0, "Total earned must be positive"),
});

export const incomeWithTransactionsSchema = incomeSchemaWithTotalEarned.extend({
  transactions: z.array(transactionSchema),
});

export const paginatedIncomesResponseSchema =
  createPaginationResponseSchema(incomeSchema);

export const paginatedIncomesWithTransactionsResponseSchema =
  createPaginationResponseSchema(incomeWithTransactionsSchema);

export const incomesSummarySchema = z.object({
  totalEarned: z.number().int().positive(),
  count: z.number().int().positive(),
  incomes: z.array(incomeSchemaWithTotalEarned),
});

export const incomesSummaryParamsSchema = z.object({
  maxIncomesToShow: z
    .number()
    .int()
    .min(1, "Max incomes to show must be greater than 0")
    .max(
      INCOME_SUMMARY_MAX_ITEMS,
      `Max incomes to show must be at most ${INCOME_SUMMARY_MAX_ITEMS}`
    )
    .optional(),
});

export const transactionPreviewCountSchema = z
  .number()
  .int()
  .min(1, "Transaction count must be greater than 0")
  .max(
    TRANSACTION_PREVIEW_MAX_COUNT,
    `Transaction count must be at most ${TRANSACTION_PREVIEW_MAX_COUNT}`
  );

export type CreateIncomeDto = z.infer<typeof createIncomeSchema>;
export type UpdateIncomeDto = z.infer<typeof updateIncomeSchema>;
export type IncomeDto = z.infer<typeof incomeSchema>;
export type IncomeDtoWithTotalEarned = z.infer<
  typeof incomeSchemaWithTotalEarned
>;
export type IncomeWithTransactionsDto = z.infer<
  typeof incomeWithTransactionsSchema
>;
export type PaginatedIncomesResponseDto = z.infer<
  typeof paginatedIncomesResponseSchema
>;
export type PaginatedIncomesWithTransactionsResponseDto = z.infer<
  typeof paginatedIncomesWithTransactionsResponseSchema
>;
export type IncomesSummaryDto = z.infer<typeof incomesSummarySchema>;
