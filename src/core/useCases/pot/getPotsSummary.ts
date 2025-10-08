import { IPotRepository } from "@/core/interfaces/IPotRepository";
import {
  PotsSummaryDto,
  potsSummaryParamsSchema,
} from "@/core/schemas/potSchema";
import { AuthError } from "@/utils";

export const getPotsSummary =
  (potRepository: IPotRepository) =>
  async (userId: string, maxPotsToShow?: number): Promise<PotsSummaryDto> => {
    if (!userId) throw new AuthError();

    const { maxPotsToShow: limit } = potsSummaryParamsSchema.parse({
      maxPotsToShow,
    });

    return potRepository.getSummary(userId, limit);
  };
