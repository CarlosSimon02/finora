import { COLOR_OPTIONS } from "@/constants/colors";
import {
  BUDGET_SUMMARY_MAX_ITEMS,
  BUDGET_TRANSACTION_PREVIEW_MAX_COUNT,
  COMMON_MAX_NUMBER,
} from "@/core/constants";
import { z } from "zod";
import {
  idSchema,
  moneyAmountSchema,
  nameSchema,
  validateTwoDecimalPlaces,
} from "./helpers";
import { createPaginationResponseSchema } from "./paginationSchema";
import { transactionSchema } from "./transactionSchema";

export const createBudgetSchema = z.object({
  name: nameSchema,
  maximumSpending: moneyAmountSchema,
  colorTag: z.enum(
    COLOR_OPTIONS.map((o) => o.value),
    "Color tag must be a valid color"
  ),
});

export const updateBudgetSchema = createBudgetSchema.partial();

export const budgetSchema = createBudgetSchema.extend({
  id: idSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const budgetSchemaWithTotalSpending = budgetSchema.extend({
  totalSpending: z
    .number("Amount must be a number")
    .max(COMMON_MAX_NUMBER, `Amount must be at most ${COMMON_MAX_NUMBER}`)
    .refine(
      validateTwoDecimalPlaces,
      "Amount must have at most 2 decimal places"
    ),
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
