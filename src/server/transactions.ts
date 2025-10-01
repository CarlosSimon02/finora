import { paginationParamsSchema } from "@/core/schemas/paginationSchema";
import {
  createTransaction,
  deleteTransaction,
  getPaginatedCategories,
  getPaginatedTransactions,
  getTransaction,
  updateTransaction,
} from "@/core/useCases/transaction";
import { TransactionRepository } from "@/data/repositories/TransactionRepository";
import { cacheTags } from "@/utils/cache";
import { unstable_cacheTag as cacheTag, revalidateTag } from "next/cache";
import { protectedProcedure, router } from "./trpc";

const transactionRepository = new TransactionRepository();

export const transactionsRouter = router({
  getPaginatedTransactions: protectedProcedure
    .input(paginationParamsSchema)
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.PAGINATED_TRANSACTIONS);

      const { user } = ctx;
      const fn = getPaginatedTransactions(transactionRepository);
      return await fn(user.id, input);
    }),
  getPaginatedCategories: protectedProcedure
    .input(paginationParamsSchema)
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.PAGINATED_CATEGORIES);

      const { user } = ctx;
      const fn = getPaginatedCategories(transactionRepository);
      return await fn(user.id, input);
    }),
  getTransaction: protectedProcedure
    .input((val: unknown) => val as { transactionId: string })
    .query(async ({ ctx, input }) => {
      const { user } = ctx;
      const fn = getTransaction(transactionRepository);
      return await fn(user.id, input.transactionId);
    }),

  createTransaction: protectedProcedure
    .input(
      (val: unknown) =>
        val as { data: Parameters<ReturnType<typeof createTransaction>>[1] }
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const fn = createTransaction(transactionRepository);
      const result = await fn(user.id, input.data as any);
      revalidateTag(cacheTags.PAGINATED_TRANSACTIONS);
      revalidateTag(cacheTags.PAGINATED_CATEGORIES);
      revalidateTag(cacheTags.BUDGETS_SUMMARY);
      revalidateTag(cacheTags.PAGINATED_BUDGETS_WITH_TRANSACTIONS);
      revalidateTag(cacheTags.INCOMES_SUMMARY);
      revalidateTag(cacheTags.PAGINATED_INCOMES_WITH_TRANSACTIONS);
      return result;
    }),
  updateTransaction: protectedProcedure
    .input(
      (val: unknown) =>
        val as {
          transactionId: string;
          data: Parameters<ReturnType<typeof updateTransaction>>[2];
        }
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const fn = updateTransaction(transactionRepository);
      const result = await fn(user.id, input.transactionId, input.data as any);
      revalidateTag(cacheTags.PAGINATED_TRANSACTIONS);
      revalidateTag(cacheTags.PAGINATED_CATEGORIES);
      revalidateTag(cacheTags.BUDGETS_SUMMARY);
      revalidateTag(cacheTags.PAGINATED_BUDGETS_WITH_TRANSACTIONS);
      revalidateTag(cacheTags.INCOMES_SUMMARY);
      revalidateTag(cacheTags.PAGINATED_INCOMES_WITH_TRANSACTIONS);
      return result;
    }),
  deleteTransaction: protectedProcedure
    .input((val: unknown) => val as { transactionId: string })
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const fn = deleteTransaction(transactionRepository);
      await fn(user.id, input.transactionId);
      revalidateTag(cacheTags.PAGINATED_TRANSACTIONS);
      revalidateTag(cacheTags.PAGINATED_CATEGORIES);
      revalidateTag(cacheTags.BUDGETS_SUMMARY);
      revalidateTag(cacheTags.PAGINATED_BUDGETS_WITH_TRANSACTIONS);
      revalidateTag(cacheTags.INCOMES_SUMMARY);
      revalidateTag(cacheTags.PAGINATED_INCOMES_WITH_TRANSACTIONS);
      return undefined;
    }),
});
