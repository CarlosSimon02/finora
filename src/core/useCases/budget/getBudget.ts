import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { BudgetDto } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { BudgetId } from "@/core/valueObjects/budget";
import { DomainValidationError } from "@/utils";

export const getBudget = (budgetRepository: IBudgetRepository) => {
  const useCase = async (
    userId: string,
    input: { budgetId: string }
  ): Promise<BudgetDto | null> => {
    const { budgetId } = input;

    // Validate budget ID using domain value object
    const budgetIdOrError = BudgetId.create(budgetId);
    if (budgetIdOrError.isFailure) {
      throw new DomainValidationError(budgetIdOrError.error);
    }

    return budgetRepository.getOneById(userId, budgetId);
  };

  return withAuth(useCase);
};
