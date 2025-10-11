import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { IncomeDto } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { DomainValidationError } from "@/utils";

export const getIncome = (incomeRepository: IIncomeRepository) => {
  const useCase = async (
    userId: string,
    input: { incomeId: string }
  ): Promise<IncomeDto | null> => {
    const { incomeId } = input;

    if (!incomeId) throw new DomainValidationError("Income ID is required");

    return incomeRepository.getOneById(userId, incomeId);
  };

  return withAuth(useCase);
};
