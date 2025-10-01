import { paginationParamsSchema } from "@/core/schemas/paginationSchema";
import { getIncomesSummary } from "@/core/useCases/income/getIncomesSummary";
import { getPaginatedIncomes } from "@/core/useCases/income/getPaginatedIncomes";
import { getPaginatedIncomesWithTransactions } from "@/core/useCases/income/getPaginatedIncomesWithTransactions";
import { IncomeRepository } from "@/data/repositories/incomeRepository";
import {
  getBudgetsSummaryUseCase,
  getPaginatedBudgetsUseCase,
  getPaginatedBudgetsWithTransactionsUseCase,
} from "@/factories/budget";
import { getPaginatedPotsUseCase } from "@/factories/pot";
import {
  getPaginatedCategoriesUseCase,
  getPaginatedTransactionsUseCase,
} from "@/factories/transaction";
import { cacheTags } from "@/utils/cacheTags";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { protectedProcedure, router } from "./trpc";

export const appRouter = router({
  getPaginatedTransactions: protectedProcedure
    .input(paginationParamsSchema)
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.PAGINATED_TRANSACTIONS);

      const { user } = ctx;
      const response = await getPaginatedTransactionsUseCase.execute(
        user.id,
        input
      );
      return response;
    }),
  getPaginatedCategories: protectedProcedure
    .input(paginationParamsSchema)
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.PAGINATED_CATEGORIES);

      const { user } = ctx;
      const response = await getPaginatedCategoriesUseCase.execute(
        user.id,
        input
      );
      return response;
    }),
  getBudgetsSummary: protectedProcedure.query(async ({ ctx }) => {
    "use cache";
    cacheTag(cacheTags.BUDGETS_SUMMARY);

    const { user } = ctx;
    const response = await getBudgetsSummaryUseCase.execute(user.id);
    return response;
  }),
  getPaginatedBudgetsWithTransactions: protectedProcedure
    .input(paginationParamsSchema)
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.PAGINATED_BUDGETS_WITH_TRANSACTIONS);

      const { user } = ctx;
      const response = await getPaginatedBudgetsWithTransactionsUseCase.execute(
        user.id,
        input
      );
      return response;
    }),
  getPaginatedBudgets: protectedProcedure
    .input(paginationParamsSchema)
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.PAGINATED_BUDGETS);

      const { user } = ctx;
      const response = await getPaginatedBudgetsUseCase.execute(user.id, input);
      return response;
    }),
  getIncomesSummary: protectedProcedure.query(async ({ ctx }) => {
    "use cache";
    cacheTag(cacheTags.INCOMES_SUMMARY);

    const { user } = ctx;
    const repo = new IncomeRepository();
    const fn = getIncomesSummary(repo);
    const response = await fn(user.id);
    return response;
  }),
  getPaginatedIncomes: protectedProcedure
    .input(paginationParamsSchema)
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.PAGINATED_INCOMES);

      const { user } = ctx;
      const repo = new IncomeRepository();
      const fn = getPaginatedIncomes(repo);
      const response = await fn(user.id, input);
      return response;
    }),
  getPaginatedIncomesWithTransactions: protectedProcedure
    .input(paginationParamsSchema)
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.PAGINATED_INCOMES_WITH_TRANSACTIONS);

      const { user } = ctx;
      const repo = new IncomeRepository();
      const fn = getPaginatedIncomesWithTransactions(repo);
      const response = await fn(user.id, input);
      return response;
    }),
  getPaginatedPots: protectedProcedure
    .input(paginationParamsSchema)
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.PAGINATED_POTS);

      const { user } = ctx;
      const response = await getPaginatedPotsUseCase.execute(user.id, input);
      return response;
    }),
});

export type AppRouter = typeof appRouter;
