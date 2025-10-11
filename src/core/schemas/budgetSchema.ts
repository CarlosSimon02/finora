import {
  BUDGET_SUMMARY_MAX_ITEMS,
  BUDGET_TRANSACTION_PREVIEW_MAX_COUNT,
} from "@/core/constants";
import { z } from "zod";
import {
  baseCreateSchema,
  baseEntitySchema,
  moneyAmountSchema,
  nonNegativeMoneyAmountSchema,
} from "./helpers";
import { createPaginationResponseSchema } from "./paginationSchema";
import { transactionSchema } from "./transactionSchema";

export const createBudgetSchema = baseCreateSchema.extend({
  maximumSpending: moneyAmountSchema,
});

export const updateBudgetSchema = createBudgetSchema.partial();

export const budgetSchema = baseCreateSchema.extend({
  ...baseEntitySchema.shape,
  maximumSpending: moneyAmountSchema,
});

export const budgetSchemaWithTotalSpending = budgetSchema.extend({
  totalSpending: nonNegativeMoneyAmountSchema,
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
  totalMaxSpending: z.number().int().nonnegative(),
  totalSpending: z.number().int().nonnegative(),
  count: z.number().int().nonnegative(),
  budgets: z.array(budgetSchemaWithTotalSpending),
});

export const budgetsSummaryParamsSchema = z
  .object({
    maxBudgetsToShow: z
      .number()
      .int()
      .min(1, "Max budgets to show must be greater than 0")
      .max(
        BUDGET_SUMMARY_MAX_ITEMS,
        `Max budgets to show must be at most ${BUDGET_SUMMARY_MAX_ITEMS}`
      )
      .optional(),
  })
  .default({});

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
