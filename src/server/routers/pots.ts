import {
  createPotSchema,
  moneyOperationSchema,
  paginationParamsSchema,
  updatePotSchema,
} from "@/core/schemas";
import {
  addMoneyToPot,
  createPot,
  deletePot,
  getPaginatedPots,
  getPot,
  getPotsCount,
  getPotsSummary,
  listUsedPotColors,
  updatePot,
  withdrawMoneyFromPot,
} from "@/core/useCases/pot";
import * as demo from "@/data/demo";
import { PotRepository } from "@/data/repositories/PotRepository";
import {
  protectedProcedure,
  protectedWriteProcedure,
  router,
} from "@/server/trpc";
import { cacheTags, revalidatePotsCache } from "@/server/utils";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { z } from "zod";

const potRepository = new PotRepository();

export const potsRouter = router({
  getPotsCount: protectedProcedure.query(async ({ ctx }) => {
    "use cache";
    cacheTag(cacheTags.POTS_COUNT);
    const { user } = ctx;
    if (user.customClaims?.role === "guest") {
      return demo.getPotsCount();
    }
    return await getPotsCount(potRepository)(user.id);
  }),
  getPotsSummary: protectedProcedure
    .input(z.object({ maxPotsToShow: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.POTS_SUMMARY);
      const { user } = ctx;
      if (user.customClaims?.role === "guest") {
        return demo.getPotsSummary(input.maxPotsToShow);
      }
      return await getPotsSummary(potRepository)(user.id, input);
    }),
  listUsedPotColors: protectedProcedure.query(async ({ ctx }) => {
    "use cache";
    cacheTag(cacheTags.POTS_USED_COLORS);
    const { user } = ctx;
    if (user.customClaims?.role === "guest") {
      return demo.listUsedPotColors();
    }
    return await listUsedPotColors(potRepository)(user.id);
  }),
  getPaginatedPots: protectedProcedure
    .input(z.object({ params: paginationParamsSchema }))
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.PAGINATED_POTS);

      const { user } = ctx;
      if (user.customClaims?.role === "guest") {
        return demo.getPaginatedPots(input.params);
      }
      return await getPaginatedPots(potRepository)(user.id, input);
    }),
  getPot: protectedProcedure
    .input(z.object({ potId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { user } = ctx;
      if (user.customClaims?.role === "guest") {
        return demo.getPot(input.potId);
      }
      return await getPot(potRepository)(user.id, input);
    }),

  createPot: protectedWriteProcedure
    .input(z.object({ data: createPotSchema }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const result = await createPot(potRepository)(user.id, input);
      revalidatePotsCache();
      return result;
    }),
  updatePot: protectedWriteProcedure
    .input(
      z.object({
        potId: z.string(),
        data: updatePotSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const result = await updatePot(potRepository)(user.id, input);
      revalidatePotsCache();
      return result;
    }),
  deletePot: protectedWriteProcedure
    .input(z.object({ potId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      await deletePot(potRepository)(user.id, input);
      revalidatePotsCache();
      return undefined;
    }),
  addMoneyToPot: protectedWriteProcedure
    .input(z.object({ potId: z.string(), data: moneyOperationSchema }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const result = await addMoneyToPot(potRepository)(user.id, input);
      revalidatePotsCache();
      return result;
    }),
  withdrawMoneyFromPot: protectedWriteProcedure
    .input(z.object({ potId: z.string(), data: moneyOperationSchema }))
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const result = await withdrawMoneyFromPot(potRepository)(user.id, input);
      revalidatePotsCache();
      return result;
    }),
});
