import { paginationParamsSchema } from "@/core/schemas/paginationSchema";
import { getIncomesSummary } from "@/core/useCases/income/getIncomesSummary";
import { getPaginatedIncomes } from "@/core/useCases/income/getPaginatedIncomes";
import { getPaginatedIncomesWithTransactions } from "@/core/useCases/income/getPaginatedIncomesWithTransactions";
import { IncomeRepository } from "@/data/repositories/IncomeRepository";
import { cacheTags } from "@/utils/cache";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { protectedProcedure, router } from "./trpc";

const incomeRepository = new IncomeRepository();

export const incomesRouter = router({
  getIncomesSummary: protectedProcedure.query(async ({ ctx }) => {
    "use cache";
    cacheTag(cacheTags.INCOMES_SUMMARY);

    const { user } = ctx;
    const fn = getIncomesSummary(incomeRepository);
    return await fn(user.id);
  }),
  getPaginatedIncomes: protectedProcedure
    .input(paginationParamsSchema)
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.PAGINATED_INCOMES);

      const { user } = ctx;
      const fn = getPaginatedIncomes(incomeRepository);
      return await fn(user.id, input);
    }),
  getPaginatedIncomesWithTransactions: protectedProcedure
    .input(paginationParamsSchema)
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.PAGINATED_INCOMES_WITH_TRANSACTIONS);

      const { user } = ctx;
      const fn = getPaginatedIncomesWithTransactions(incomeRepository);
      return await fn(user.id, input);
    }),
});
