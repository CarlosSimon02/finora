import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { IncomesSummaryDto } from "@/core/schemas/incomeSchema";
import { AuthError, DomainValidationError } from "@/utils";

export const getIncomesSummary =
  (incomeRepository: IIncomeRepository) =>
  async (
    userId: string,
    maxIncomesToShow?: number
  ): Promise<IncomesSummaryDto> => {
    if (!userId) throw new AuthError();
    if (maxIncomesToShow && maxIncomesToShow <= 0)
      throw new DomainValidationError(
        "Max incomes to show must be greater than 0"
      );
    if (maxIncomesToShow && maxIncomesToShow > 50)
      throw new DomainValidationError(
        "Max incomes to show must be less than 100"
      );

    return incomeRepository.getSummary(userId, maxIncomesToShow);
  };
