import { paginationParamsSchema } from "@/core/schemas/paginationSchema";
import {
  getBudgetsSummary,
  getPaginatedBudgets,
  getPaginatedBudgetsWithTransactions,
} from "@/core/useCases/budget";
import { BudgetRepository } from "@/data/repositories/BudgetRepository";
import { cacheTags } from "@/utils/cache";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { protectedProcedure, router } from "./trpc";

const budgetRepository = new BudgetRepository();

export const budgetsRouter = router({
  getBudgetsSummary: protectedProcedure.query(async ({ ctx }) => {
    "use cache";
    cacheTag(cacheTags.BUDGETS_SUMMARY);

    const { user } = ctx;
    const fn = getBudgetsSummary(budgetRepository);
    return await fn(user.id);
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
});
