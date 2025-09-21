import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import {
  IncomesSummaryDto,
  incomesSummaryParamsSchema,
} from "@/core/schemas/incomeSchema";
import { AuthError } from "@/utils";

export const getIncomesSummary =
  (incomeRepository: IIncomeRepository) =>
  async (
    userId: string,
    maxIncomesToShow?: number
  ): Promise<IncomesSummaryDto> => {
    if (!userId) throw new AuthError();

    const { maxIncomesToShow: limit } = incomesSummaryParamsSchema.parse({
      maxIncomesToShow,
    });

    return incomeRepository.getSummary(userId, limit);
  };
