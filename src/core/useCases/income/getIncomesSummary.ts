import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import {
  IncomesSummaryDto,
  incomesSummaryParamsSchema,
} from "@/core/schemas/incomeSchema";
import { withAuth } from "@/core/useCases/utils";

export const getIncomesSummary = (incomeRepository: IIncomeRepository) => {
  const useCase = async (
    userId: string,
    input: { maxIncomesToShow?: number }
  ): Promise<IncomesSummaryDto> => {
    const { maxIncomesToShow } = input;

    const { maxIncomesToShow: limit } = incomesSummaryParamsSchema.parse({
      maxIncomesToShow,
    });

    return incomeRepository.getSummary(userId, limit);
  };

  return withAuth(useCase);
};
