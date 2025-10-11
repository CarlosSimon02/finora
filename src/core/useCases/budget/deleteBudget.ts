import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { withAuth } from "@/core/useCases/utils";
import { DomainValidationError } from "@/utils";

export const deleteBudget = (budgetRepository: IBudgetRepository) => {
  const useCase = async (
    userId: string,
    input: { budgetId: string }
  ): Promise<void> => {
    const { budgetId } = input;

    if (!budgetId) throw new DomainValidationError("Budget ID is required");

    await budgetRepository.deleteOne(userId, budgetId);
  };

  return withAuth(useCase);
};
