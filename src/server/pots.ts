import { paginationParamsSchema } from "@/core/schemas/paginationSchema";
import {
  addMoneyToPot,
  createPot,
  deletePot,
  getPaginatedPots,
  getPot,
  updatePot,
  withdrawMoneyFromPot,
} from "@/core/useCases/pot";
import { PotRepository } from "@/data/repositories/PotRepository";
import { cacheTags } from "@/utils/cache";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { protectedProcedure, router } from "./trpc";

const potRepository = new PotRepository();

export const potsRouter = router({
  // Reads - cacheable
  getPaginatedPots: protectedProcedure
    .input(paginationParamsSchema)
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.PAGINATED_POTS);

      const { user } = ctx;
      const fn = getPaginatedPots(potRepository);
      return await fn(user.id, input);
    }),
  getPot: protectedProcedure
    .input((val: unknown) => val as { potId: string })
    .query(async ({ ctx, input }) => {
      const { user } = ctx;
      const fn = getPot(potRepository);
      return await fn(user.id, input.potId);
    }),

  // Writes - not cached here
  createPot: protectedProcedure
    .input(
      (val: unknown) =>
        val as { data: Parameters<ReturnType<typeof createPot>>[1] }
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const fn = createPot(potRepository);
      return await fn(user.id, input.data as any);
    }),
  updatePot: protectedProcedure
    .input(
      (val: unknown) =>
        val as {
          potId: string;
          data: Parameters<ReturnType<typeof updatePot>>[2];
        }
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const fn = updatePot(potRepository);
      return await fn(user.id, input.potId, input.data as any);
    }),
  deletePot: protectedProcedure
    .input((val: unknown) => val as { potId: string })
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const fn = deletePot(potRepository);
      await fn(user.id, input.potId);
      return undefined;
    }),
  addMoneyToPot: protectedProcedure
    .input((val: unknown) => val as { potId: string; amount: number })
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const fn = addMoneyToPot(potRepository);
      return await fn(user.id, input.potId, { amount: input.amount });
    }),
  withdrawMoneyFromPot: protectedProcedure
    .input((val: unknown) => val as { potId: string; amount: number })
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const fn = withdrawMoneyFromPot(potRepository);
      return await fn(user.id, input.potId, { amount: input.amount });
    }),
});
