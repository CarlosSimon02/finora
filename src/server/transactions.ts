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
import { unstable_cacheTag as cacheTag } from "next/cache";
import { protectedProcedure, router } from "./trpc";

const transactionRepository = new TransactionRepository();

export const transactionsRouter = router({
  // Reads - cacheable
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

  // Writes - don't cache here, revalidate via server actions after mutations
  createTransaction: protectedProcedure
    .input(
      (val: unknown) =>
        val as { data: Parameters<ReturnType<typeof createTransaction>>[1] }
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const fn = createTransaction(transactionRepository);
      return await fn(user.id, input.data as any);
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
      return await fn(user.id, input.transactionId, input.data as any);
    }),
  deleteTransaction: protectedProcedure
    .input((val: unknown) => val as { transactionId: string })
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const fn = deleteTransaction(transactionRepository);
      await fn(user.id, input.transactionId);
      return undefined;
    }),
});
