import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { withAuth } from "@/core/useCases/utils";
import { BudgetId } from "@/core/valueObjects/budget";
import { DomainValidationError } from "@/utils";

export const deleteBudget = (budgetRepository: IBudgetRepository) => {
  const useCase = async (
    userId: string,
    input: { budgetId: string }
  ): Promise<void> => {
    const { budgetId } = input;

    // Validate budget ID using domain value object
    const budgetIdOrError = BudgetId.create(budgetId);
    if (budgetIdOrError.isFailure) {
      throw new DomainValidationError(budgetIdOrError.error);
    }

    await budgetRepository.deleteOne(userId, budgetId);
  };

  return withAuth(useCase);
};
