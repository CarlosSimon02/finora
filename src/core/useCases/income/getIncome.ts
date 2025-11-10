import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { IncomeDto } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { IncomeId } from "@/core/valueObjects/income";
import { DomainValidationError } from "@/utils";

export const getIncome = (incomeRepository: IIncomeRepository) => {
  const useCase = async (
    userId: string,
    input: { incomeId: string }
  ): Promise<IncomeDto | null> => {
    const { incomeId } = input;

    // Validate income ID using domain value object
    const incomeIdOrError = IncomeId.create(incomeId);
    if (incomeIdOrError.isFailure) {
      throw new DomainValidationError(incomeIdOrError.error);
    }

    return incomeRepository.getOneById(userId, incomeId);
  };

  return withAuth(useCase);
};
