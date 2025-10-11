import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { withAuth } from "@/core/useCases/utils";
import { DomainValidationError } from "@/utils";

export const deleteIncome = (incomeRepository: IIncomeRepository) => {
  const useCase = async (
    userId: string,
    input: { incomeId: string }
  ): Promise<void> => {
    const { incomeId } = input;

    if (!incomeId) throw new DomainValidationError("Income ID is required");

    await incomeRepository.deleteOne(userId, incomeId);
  };

  return withAuth(useCase);
};
