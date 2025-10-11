import {
  createIncomeSchema,
  incomesSummaryParamsSchema,
  paginationParamsSchema,
  updateIncomeSchema,
} from "@/core/schemas";
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
import * as demo from "@/data/demo";
import { IncomeRepository } from "@/data/repositories/IncomeRepository";
import {
  protectedProcedure,
  protectedWriteProcedure,
  router,
} from "@/server/trpc";
import {
  cacheTags,
  revalidateIncomesCache,
  revalidateTransactionsCache,
} from "@/server/utils";
import { unstable_cacheTag as cacheTag } from "next/cache";
import z from "zod";

const incomeRepository = new IncomeRepository();

const revalidateCache = () => {
  revalidateIncomesCache();
  revalidateTransactionsCache();
};

export const incomesRouter = router({
  getIncomesCount: protectedProcedure.query(async ({ ctx }) => {
    "use cache";
    cacheTag(cacheTags.INCOMES_COUNT);
    const { user } = ctx;
    if (user.customClaims?.role === "guest") {
      return demo.getIncomesCount();
    }
    return await getIncomesCount(incomeRepository)(user.id);
  }),
  listUsedIncomeColors: protectedProcedure.query(async ({ ctx }) => {
    "use cache";
    cacheTag(cacheTags.INCOMES_USED_COLORS);
    const { user } = ctx;
    if (user.customClaims?.role === "guest") {
      return demo.listUsedIncomeColors();
    }
    return await listUsedIncomeColors(incomeRepository)(user.id);
  }),
  getIncomesSummary: protectedProcedure
    .input(incomesSummaryParamsSchema)
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.INCOMES_SUMMARY);

      const { user } = ctx;
      if (user.customClaims?.role === "guest") {
        return demo.getIncomesSummary(input.maxIncomesToShow);
      }
      return await getIncomesSummary(incomeRepository)(user.id, {
        maxIncomesToShow: input.maxIncomesToShow,
      });
    }),
  getPaginatedIncomes: protectedProcedure
    .input(z.object({ params: paginationParamsSchema }))
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.PAGINATED_INCOMES);

      const { user } = ctx;
      if (user.customClaims?.role === "guest") {
        return demo.getPaginatedIncomes(input.params);
      }
      return await getPaginatedIncomes(incomeRepository)(user.id, input);
    }),
  getPaginatedIncomesWithTransactions: protectedProcedure
    .input(
      z.object({
        params: paginationParamsSchema,
        transactionCount: z.number().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.PAGINATED_INCOMES_WITH_TRANSACTIONS);

      const { user } = ctx;
      if (user.customClaims?.role === "guest") {
        return demo.getPaginatedIncomesWithTransactions(
          input.params,
          input.transactionCount
        );
      }
      return await getPaginatedIncomesWithTransactions(incomeRepository)(
        user.id,
        input
      );
    }),
  getIncome: protectedProcedure
    .input(z.object({ incomeId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { user } = ctx;
      if (user.customClaims?.role === "guest") {
        return demo.getIncome(input.incomeId);
      }
      return await getIncome(incomeRepository)(user.id, input);
    }),

  createIncome: protectedWriteProcedure
    .input(z.object({ data: createIncomeSchema }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const result = await createIncome(incomeRepository)(user.id, input);
      revalidateCache();
      return result;
    }),
  updateIncome: protectedWriteProcedure
    .input(
      z.object({
        incomeId: z.string(),
        data: updateIncomeSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const result = await updateIncome(incomeRepository)(user.id, input);
      revalidateCache();
      return result;
    }),
  deleteIncome: protectedWriteProcedure
    .input(z.object({ incomeId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      await deleteIncome(incomeRepository)(user.id, input);
      revalidateCache();
      return undefined;
    }),
});
