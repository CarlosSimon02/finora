import { budgetsSummaryParamsSchema } from "@/core/schemas";
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
import { BudgetRepository } from "@/data/repositories/BudgetRepository";
import { cacheTags } from "@/utils";
import { unstable_cacheTag as cacheTag, revalidateTag } from "next/cache";
import { protectedProcedure, router } from "./trpc";

const budgetRepository = new BudgetRepository();

export const budgetsRouter = router({
  getBudgetsCount: protectedProcedure.query(async ({ ctx }) => {
    "use cache";
    cacheTag(cacheTags.BUDGETS_COUNT);
    const { user } = ctx;
    const fn = getBudgetsCount(budgetRepository);
    return await fn(user.id);
  }),
  listUsedBudgetColors: protectedProcedure.query(async ({ ctx }) => {
    "use cache";
    cacheTag(cacheTags.BUDGETS_USED_COLORS);
    const { user } = ctx;
    const fn = listUsedBudgetColors(budgetRepository);
    return await fn(user.id);
  }),
  getBudgetsSummary: protectedProcedure
    .input(budgetsSummaryParamsSchema)
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.BUDGETS_SUMMARY);

      const { user } = ctx;
      const fn = getBudgetsSummary(budgetRepository);
      return await fn(user.id, input.maxBudgetsToShow);
    }),
  getPaginatedBudgetsWithTransactions: protectedProcedure
    .input(paginationParamsSchema)
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.PAGINATED_BUDGETS_WITH_TRANSACTIONS);

      const { user } = ctx;
      const fn = getPaginatedBudgetsWithTransactions(budgetRepository);
      return await fn(user.id, input);
    }),
  getPaginatedBudgets: protectedProcedure
    .input(paginationParamsSchema)
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.PAGINATED_BUDGETS);

      const { user } = ctx;
      const fn = getPaginatedBudgets(budgetRepository);
      return await fn(user.id, input);
    }),
  getBudget: protectedProcedure
    .input((val: unknown) => val as { budgetId: string })
    .query(async ({ ctx, input }) => {
      const { user } = ctx;
      const fn = getBudget(budgetRepository);
      return await fn(user.id, input.budgetId);
    }),

  createBudget: protectedProcedure
    .input(
      (val: unknown) =>
        val as { data: Parameters<ReturnType<typeof createBudget>>[1] }
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const fn = createBudget(budgetRepository);
      const result = await fn(user.id, input.data as any);
      revalidateTag(cacheTags.PAGINATED_BUDGETS);
      revalidateTag(cacheTags.PAGINATED_BUDGETS_WITH_TRANSACTIONS);
      revalidateTag(cacheTags.BUDGETS_SUMMARY);
      revalidateTag(cacheTags.BUDGETS_COUNT);
      revalidateTag(cacheTags.PAGINATED_CATEGORIES);
      revalidateTag(cacheTags.BUDGETS_USED_COLORS);
      return result;
    }),
  updateBudget: protectedProcedure
    .input(
      (val: unknown) =>
        val as {
          budgetId: string;
          data: Parameters<ReturnType<typeof updateBudget>>[2];
        }
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const fn = updateBudget(budgetRepository);
      const result = await fn(user.id, input.budgetId, input.data as any);
      revalidateTag(cacheTags.PAGINATED_BUDGETS);
      revalidateTag(cacheTags.PAGINATED_BUDGETS_WITH_TRANSACTIONS);
      revalidateTag(cacheTags.BUDGETS_SUMMARY);
      revalidateTag(cacheTags.BUDGETS_COUNT);
      revalidateTag(cacheTags.PAGINATED_CATEGORIES);
      revalidateTag(cacheTags.BUDGETS_USED_COLORS);
      return result;
    }),
  deleteBudget: protectedProcedure
    .input((val: unknown) => val as { budgetId: string })
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const fn = deleteBudget(budgetRepository);
      await fn(user.id, input.budgetId);
      revalidateTag(cacheTags.PAGINATED_BUDGETS);
      revalidateTag(cacheTags.PAGINATED_BUDGETS_WITH_TRANSACTIONS);
      revalidateTag(cacheTags.BUDGETS_SUMMARY);
      revalidateTag(cacheTags.BUDGETS_COUNT);
      revalidateTag(cacheTags.PAGINATED_CATEGORIES);
      revalidateTag(cacheTags.BUDGETS_USED_COLORS);
      return undefined;
    }),
});
