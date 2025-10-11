import {
  budgetsSummaryParamsSchema,
  createBudgetSchema,
  updateBudgetSchema,
} from "@/core/schemas";
import { paginationParamsSchema } from "@/core/schemas/paginationSchema";
import {
  createBudget,
  deleteBudget,
  getBudget,
  getBudgetsCount,
  getBudgetsSummary,
  getPaginatedBudgets,
  getPaginatedBudgetsWithTransactions,
  listUsedBudgetColors,
  updateBudget,
} from "@/core/useCases/budget";
import * as demo from "@/data/demo";
import { BudgetRepository } from "@/data/repositories/BudgetRepository";
import {
  protectedProcedure,
  protectedWriteProcedure,
  router,
} from "@/server/trpc";
import {
  cacheTags,
  revalidateBudgetsCache,
  revalidateTransactionsCache,
} from "@/server/utils";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { z } from "zod";

const budgetRepository = new BudgetRepository();

const revalidateCache = () => {
  revalidateBudgetsCache();
  revalidateTransactionsCache();
};

export const budgetsRouter = router({
  getBudgetsCount: protectedProcedure.query(async ({ ctx }) => {
    "use cache";
    cacheTag(cacheTags.BUDGETS_COUNT);
    const { user } = ctx;
    if (user.customClaims?.role === "guest") {
      return demo.getBudgetsCount();
    }
    return await getBudgetsCount(budgetRepository)(user.id);
  }),
  listUsedBudgetColors: protectedProcedure.query(async ({ ctx }) => {
    "use cache";
    cacheTag(cacheTags.BUDGETS_USED_COLORS);
    const { user } = ctx;
    if (user.customClaims?.role === "guest") {
      return demo.listUsedBudgetColors();
    }
    return await listUsedBudgetColors(budgetRepository)(user.id);
  }),
  getBudgetsSummary: protectedProcedure
    .input(budgetsSummaryParamsSchema)
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.BUDGETS_SUMMARY);

      const { user } = ctx;
      if (user.customClaims?.role === "guest") {
        return demo.getBudgetsSummary(input.maxBudgetsToShow);
      }
      return await getBudgetsSummary(budgetRepository)(user.id, input);
    }),
  getPaginatedBudgetsWithTransactions: protectedProcedure
    .input(
      z.object({
        params: paginationParamsSchema,
        transactionCount: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.PAGINATED_BUDGETS_WITH_TRANSACTIONS);

      const { user } = ctx;
      if (user.customClaims?.role === "guest") {
        return demo.getPaginatedBudgetsWithTransactions(
          input.params,
          input.transactionCount
        );
      }
      return await getPaginatedBudgetsWithTransactions(budgetRepository)(
        user.id,
        input
      );
    }),
  getPaginatedBudgets: protectedProcedure
    .input(z.object({ params: paginationParamsSchema }))
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.PAGINATED_BUDGETS);

      const { user } = ctx;
      if (user.customClaims?.role === "guest") {
        return demo.getPaginatedBudgets(input.params);
      }
      return await getPaginatedBudgets(budgetRepository)(user.id, input);
    }),
  getBudget: protectedProcedure
    .input(z.object({ budgetId: z.string() }))
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.BUDGET);

      const { user } = ctx;
      if (user.customClaims?.role === "guest") {
        return demo.getBudget(input.budgetId);
      }
      return await getBudget(budgetRepository)(user.id, input);
    }),
  createBudget: protectedWriteProcedure
    .input(z.object({ data: createBudgetSchema }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const result = await createBudget(budgetRepository)(user.id, input);
      revalidateCache();
      return result;
    }),
  updateBudget: protectedWriteProcedure
    .input(
      z.object({
        budgetId: z.string(),
        data: updateBudgetSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const result = await updateBudget(budgetRepository)(user.id, input);
      revalidateCache();
      return result;
    }),
  deleteBudget: protectedWriteProcedure
    .input(z.object({ budgetId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      await deleteBudget(budgetRepository)(user.id, input);
      revalidateCache();
      return undefined;
    }),
});
