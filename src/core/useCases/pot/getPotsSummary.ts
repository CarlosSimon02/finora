import { IPotRepository } from "@/core/interfaces/IPotRepository";
import { PotsSummaryDto, potsSummaryParamsSchema } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";

export const getPotsSummary = (potRepository: IPotRepository) => {
  const useCase = async (
    userId: string,
    input: { maxPotsToShow?: number }
  ): Promise<PotsSummaryDto> => {
    const { maxPotsToShow } = input;

    // Validate params (infrastructure concern, not domain)
    const { maxPotsToShow: limit } = potsSummaryParamsSchema.parse({
      maxPotsToShow,
    });

    // Query use case - fetches summary data
    return potRepository.getSummary(userId, limit);
  };

  return withAuth(useCase);
};
