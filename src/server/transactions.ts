import { paginationParamsSchema } from "@/core/schemas/paginationSchema";
import {
  getPaginatedCategories,
  getPaginatedTransactions,
} from "@/core/useCases/transaction";
import { TransactionRepository } from "@/data/repositories/TransactionRepository";
import { cacheTags } from "@/utils/cache";
import { unstable_cacheTag as cacheTag } from "next/cache";
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
});
