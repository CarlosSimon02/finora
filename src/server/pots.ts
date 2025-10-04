import { paginationParamsSchema } from "@/core/schemas/paginationSchema";
import {
  addMoneyToPot,
  createPot,
  deletePot,
  getPaginatedPots,
  getPot,
  getPotsCount,
  listUsedPotColors,
  updatePot,
  withdrawMoneyFromPot,
} from "@/core/useCases/pot";
import { PotRepository } from "@/data/repositories/PotRepository";
import { cacheTags } from "@/utils";
import { unstable_cacheTag as cacheTag, revalidateTag } from "next/cache";
import { protectedProcedure, router } from "./trpc";

const potRepository = new PotRepository();

export const potsRouter = router({
  getPotsCount: protectedProcedure.query(async ({ ctx }) => {
    "use cache";
    cacheTag(cacheTags.POTS_COUNT);
    const { user } = ctx;
    const fn = getPotsCount(potRepository);
    return await fn(user.id);
  }),
  listUsedPotColors: protectedProcedure.query(async ({ ctx }) => {
    "use cache";
    cacheTag(cacheTags.POTS_USED_COLORS);
    const { user } = ctx;
    const fn = listUsedPotColors(potRepository);
    return await fn(user.id);
  }),
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

  createPot: protectedProcedure
    .input(
      (val: unknown) =>
        val as { data: Parameters<ReturnType<typeof createPot>>[1] }
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const fn = createPot(potRepository);
      const result = await fn(user.id, input.data as any);
      revalidateTag(cacheTags.PAGINATED_POTS);
      revalidateTag(cacheTags.POTS_SUMMARY);
      revalidateTag(cacheTags.POTS_COUNT);
      revalidateTag(cacheTags.POTS_USED_COLORS);
      return result;
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
      const result = await fn(user.id, input.potId, input.data as any);
      revalidateTag(cacheTags.PAGINATED_POTS);
      revalidateTag(cacheTags.POTS_SUMMARY);
      revalidateTag(cacheTags.POTS_COUNT);
      revalidateTag(cacheTags.POTS_USED_COLORS);
      return result;
    }),
  deletePot: protectedProcedure
    .input((val: unknown) => val as { potId: string })
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const fn = deletePot(potRepository);
      await fn(user.id, input.potId);
      revalidateTag(cacheTags.PAGINATED_POTS);
      revalidateTag(cacheTags.POTS_COUNT);
      revalidateTag(cacheTags.POTS_USED_COLORS);
      revalidateTag(cacheTags.POTS_SUMMARY);
      return undefined;
    }),
  addMoneyToPot: protectedProcedure
    .input((val: unknown) => val as { potId: string; amount: number })
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const fn = addMoneyToPot(potRepository);
      const result = await fn(user.id, input.potId, { amount: input.amount });
      revalidateTag(cacheTags.PAGINATED_POTS);
      revalidateTag(cacheTags.POTS_SUMMARY);
      return result;
    }),
  withdrawMoneyFromPot: protectedProcedure
    .input((val: unknown) => val as { potId: string; amount: number })
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const fn = withdrawMoneyFromPot(potRepository);
      const result = await fn(user.id, input.potId, { amount: input.amount });
      revalidateTag(cacheTags.PAGINATED_POTS);
      revalidateTag(cacheTags.POTS_SUMMARY);
      return result;
    }),
});
