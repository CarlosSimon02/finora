import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { IncomesSummaryDto, incomesSummaryParamsSchema } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";

export const getIncomesSummary = (incomeRepository: IIncomeRepository) => {
  const useCase = async (
    userId: string,
    input: { maxIncomesToShow?: number }
  ): Promise<IncomesSummaryDto> => {
    const { maxIncomesToShow } = input;

    // Validate params (infrastructure concern, not domain)
    const { maxIncomesToShow: limit } = incomesSummaryParamsSchema.parse({
      maxIncomesToShow,
    });

    // Query use case - fetches summary data
    return incomeRepository.getSummary(userId, limit);
  };

  return withAuth(useCase);
};
