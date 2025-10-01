import { paginationParamsSchema } from "@/core/schemas/paginationSchema";
import { getPaginatedPots } from "@/core/useCases/pot";
import { PotRepository } from "@/data/repositories/PotRepository";
import { cacheTags } from "@/utils/cache";
import { unstable_cacheTag as cacheTag } from "next/cache";
import { protectedProcedure, router } from "./trpc";

const potRepository = new PotRepository();

export const potsRouter = router({
  getPaginatedPots: protectedProcedure
    .input(paginationParamsSchema)
    .query(async ({ ctx, input }) => {
      "use cache";
      cacheTag(cacheTags.PAGINATED_POTS);

      const { user } = ctx;
      const fn = getPaginatedPots(potRepository);
      return await fn(user.id, input);
    }),
});
