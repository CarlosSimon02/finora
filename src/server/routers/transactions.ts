import {
  createTransactionSchema,
  updateTransactionSchema,
} from "@/core/schemas";
import { paginationParamsSchema } from "@/core/schemas/paginationSchema";
import {
  createTransaction,
  deleteTransaction,
  getPaginatedCategories,
  getPaginatedTransactions,
  getTransaction,
  updateTransaction,
} from "@/core/useCases/transaction";
import * as demo from "@/data/demo";
import { TransactionRepository } from "@/data/repositories/TransactionRepository";
import {
  protectedProcedure,
  protectedWriteProcedure,
  router,
} from "@/server/trpc";
import {
  cacheTags,
  revalidateBudgetsCache,
  revalidateIncomesCache,
  revalidateTransactionsCache,
} from "@/server/utils";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { z } from "zod";

const transactionRepository = new TransactionRepository();

const revalidateCache = () => {
  revalidateTransactionsCache();
  revalidateBudgetsCache();
  revalidateIncomesCache();
};

export const transactionsRouter = router({
  getPaginatedTransactions: protectedProcedure
    .input(z.object({ params: paginationParamsSchema }))
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.PAGINATED_TRANSACTIONS);

      const { user } = ctx;
      if (user.customClaims?.role === "guest") {
        return demo.getPaginatedTransactions(input.params);
      }
      return await getPaginatedTransactions(transactionRepository)(
        user.id,
        input
      );
    }),
  getPaginatedCategories: protectedProcedure
    .input(z.object({ params: paginationParamsSchema }))
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.PAGINATED_CATEGORIES);

      const { user } = ctx;
      if (user.customClaims?.role === "guest") {
        return demo.getPaginatedCategories(input.params);
      }
      return await getPaginatedCategories(transactionRepository)(
        user.id,
        input
      );
    }),
  getTransaction: protectedProcedure
    .input(z.object({ transactionId: z.string() }))
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.TRANSACTION);

      const { user } = ctx;
      if (user.customClaims?.role === "guest") {
        return demo.getTransaction(input.transactionId);
      }
      return await getTransaction(transactionRepository)(user.id, input);
    }),

  createTransaction: protectedWriteProcedure
    .input(z.object({ data: createTransactionSchema }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const result = await createTransaction(transactionRepository)(
        user.id,
        input
      );
      revalidateCache();
      return result;
    }),
  updateTransaction: protectedWriteProcedure
    .input(
      z.object({
        transactionId: z.string(),
        data: updateTransactionSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const result = await updateTransaction(transactionRepository)(
        user.id,
        input
      );
      revalidateCache();
      return result;
    }),
  deleteTransaction: protectedWriteProcedure
    .input(z.object({ transactionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      await deleteTransaction(transactionRepository)(user.id, input);
      revalidateCache();
      return undefined;
    }),
});
