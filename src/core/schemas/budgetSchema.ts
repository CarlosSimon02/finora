import {
  BUDGET_NAME_MAX_LENGTH,
  BUDGET_SUMMARY_MAX_ITEMS,
  BUDGET_TRANSACTION_PREVIEW_MAX_COUNT,
} from "@/core/constants";
import { z } from "zod";
import { trimmedStringSchema, validateOptionalHexColor } from "./helpers";
import { createPaginationResponseSchema } from "./paginationSchema";
import { transactionSchema } from "./transactionSchema";

export const createBudgetSchema = z.object({
  name: trimmedStringSchema
    .min(1, "Budget name is required")
    .max(
      BUDGET_NAME_MAX_LENGTH,
      `Budget name must be at most ${BUDGET_NAME_MAX_LENGTH} characters`
    ),
  maximumSpending: z
    .number()
    .positive("Maximum spending must be greater than 0")
    .finite("Maximum spending must be a finite number"),
  colorTag: trimmedStringSchema.refine(validateOptionalHexColor, {
    message: "Color tag must be a valid hex color code (e.g., #FF5733)",
  }),
});

export const updateBudgetSchema = createBudgetSchema.partial();

export const budgetSchema = createBudgetSchema.extend({
  id: trimmedStringSchema.min(1, "Budget ID is required"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const budgetSchemaWithTotalSpending = budgetSchema.extend({
  totalSpending: z.number().min(0, "Total spending must be non-negative"),
});

export const budgetWithTransactionsSchema =
  budgetSchemaWithTotalSpending.extend({
    transactions: z.array(transactionSchema),
  });

export const paginatedBudgetsResponseSchema =
  createPaginationResponseSchema(budgetSchema);

export const paginatedBudgetsWithTransactionsResponseSchema =
  createPaginationResponseSchema(budgetWithTransactionsSchema);

export const budgetsSummarySchema = z.object({
  totalMaxSpending: z.number().int().positive(),
  totalSpending: z.number().int().positive(),
  count: z.number().int().positive(),
  budgets: z.array(budgetSchemaWithTotalSpending),
});

export const budgetsSummaryParamsSchema = z.object({
  maxBudgetsToShow: z
    .number()
    .int()
    .min(1, "Max budgets to show must be greater than 0")
    .max(
      BUDGET_SUMMARY_MAX_ITEMS,
      `Max budgets to show must be at most ${BUDGET_SUMMARY_MAX_ITEMS}`
    )
    .optional(),
});

export const budgetTransactionPreviewCountSchema = z
  .number()
  .int()
  .min(1, "Transaction count must be greater than 0")
  .max(
    BUDGET_TRANSACTION_PREVIEW_MAX_COUNT,
    `Transaction count must be at most ${BUDGET_TRANSACTION_PREVIEW_MAX_COUNT}`
  );

export type CreateBudgetDto = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetDto = z.infer<typeof updateBudgetSchema>;
export type BudgetDto = z.infer<typeof budgetSchema>;
export type BudgetWithTotalSpendingDto = z.infer<
  typeof budgetSchemaWithTotalSpending
>;
export type BudgetWithTransactionsDto = z.infer<
  typeof budgetWithTransactionsSchema
>;
export type PaginatedBudgetsResponseDto = z.infer<
  typeof paginatedBudgetsResponseSchema
>;
export type PaginatedBudgetsWithTransactionsResponseDto = z.infer<
  typeof paginatedBudgetsWithTransactionsResponseSchema
>;
export type BudgetsSummaryDto = z.infer<typeof budgetsSummarySchema>;
