import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { withAuth } from "@/core/useCases/utils";
import { IncomeId } from "@/core/valueObjects/income";
import { DomainValidationError } from "@/utils";

export const deleteIncome = (incomeRepository: IIncomeRepository) => {
  const useCase = async (
    userId: string,
    input: { incomeId: string }
  ): Promise<void> => {
    const { incomeId } = input;

    // Validate income ID using domain value object
    const incomeIdOrError = IncomeId.create(incomeId);
    if (incomeIdOrError.isFailure) {
      throw new DomainValidationError(incomeIdOrError.error);
    }

    await incomeRepository.deleteOne(userId, incomeId);
  };

  return withAuth(useCase);
};
