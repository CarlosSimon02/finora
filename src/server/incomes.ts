import { incomesSummaryParamsSchema } from "@/core/schemas";
import { paginationParamsSchema } from "@/core/schemas/paginationSchema";
import {
  createIncome,
  deleteIncome,
  getIncome,
  getIncomesCount,
  listUsedIncomeColors,
  updateIncome,
} from "@/core/useCases/income";
import { getIncomesSummary } from "@/core/useCases/income/getIncomesSummary";
import { getPaginatedIncomes } from "@/core/useCases/income/getPaginatedIncomes";
import { getPaginatedIncomesWithTransactions } from "@/core/useCases/income/getPaginatedIncomesWithTransactions";
import { IncomeRepository } from "@/data/repositories/IncomeRepository";
import { cacheTags } from "@/utils";
import { unstable_cacheTag as cacheTag, revalidateTag } from "next/cache";
import { protectedProcedure, router } from "./trpc";

const incomeRepository = new IncomeRepository();

export const incomesRouter = router({
  getIncomesCount: protectedProcedure.query(async ({ ctx }) => {
    "use cache";
    cacheTag(cacheTags.INCOMES_COUNT);
    const { user } = ctx;
    const fn = getIncomesCount(incomeRepository);
    return await fn(user.id);
  }),
  listUsedIncomeColors: protectedProcedure.query(async ({ ctx }) => {
    "use cache";
    cacheTag(cacheTags.INCOMES_USED_COLORS);
    const { user } = ctx;
    const fn = listUsedIncomeColors(incomeRepository);
    return await fn(user.id);
  }),
  getIncomesSummary: protectedProcedure
    .input(incomesSummaryParamsSchema)
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.INCOMES_SUMMARY);

      const { user } = ctx;
      const fn = getIncomesSummary(incomeRepository);
      return await fn(user.id, input.maxIncomesToShow);
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
  getIncome: protectedProcedure
    .input((val: unknown) => val as { incomeId: string })
    .query(async ({ ctx, input }) => {
      const { user } = ctx;
      const fn = getIncome(incomeRepository);
      return await fn(user.id, input.incomeId);
    }),

  createIncome: protectedProcedure
    .input(
      (val: unknown) =>
        val as { data: Parameters<ReturnType<typeof createIncome>>[1] }
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const fn = createIncome(incomeRepository);
      const result = await fn(user.id, input.data as any);
      revalidateTag(cacheTags.PAGINATED_INCOMES);
      revalidateTag(cacheTags.PAGINATED_INCOMES_WITH_TRANSACTIONS);
      revalidateTag(cacheTags.INCOMES_SUMMARY);
      revalidateTag(cacheTags.INCOMES_COUNT);
      return result;
    }),
  updateIncome: protectedProcedure
    .input(
      (val: unknown) =>
        val as {
          incomeId: string;
          data: Parameters<ReturnType<typeof updateIncome>>[2];
        }
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const fn = updateIncome(incomeRepository);
      const result = await fn(user.id, input.incomeId, input.data as any);
      revalidateTag(cacheTags.PAGINATED_INCOMES);
      revalidateTag(cacheTags.PAGINATED_INCOMES_WITH_TRANSACTIONS);
      revalidateTag(cacheTags.INCOMES_SUMMARY);
      revalidateTag(cacheTags.INCOMES_COUNT);
      return result;
    }),
  deleteIncome: protectedProcedure
    .input((val: unknown) => val as { incomeId: string })
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const fn = deleteIncome(incomeRepository);
      await fn(user.id, input.incomeId);
      revalidateTag(cacheTags.PAGINATED_INCOMES);
      revalidateTag(cacheTags.PAGINATED_INCOMES_WITH_TRANSACTIONS);
      revalidateTag(cacheTags.INCOMES_SUMMARY);
      revalidateTag(cacheTags.INCOMES_COUNT);
      return undefined;
    }),
});
