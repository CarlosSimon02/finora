import { IPotRepository } from "@/core/interfaces/IPotRepository";
import {
  PotsSummaryDto,
  potsSummaryParamsSchema,
} from "@/core/schemas/potSchema";
import { withAuth } from "@/core/useCases/utils";

export const getPotsSummary = (potRepository: IPotRepository) => {
  const useCase = async (
    userId: string,
    input: { maxPotsToShow?: number }
  ): Promise<PotsSummaryDto> => {
    const { maxPotsToShow } = input;

    const { maxPotsToShow: limit } = potsSummaryParamsSchema.parse({
      maxPotsToShow,
    });

    return potRepository.getSummary(userId, limit);
  };

  return withAuth(useCase);
};
