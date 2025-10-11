import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { BudgetDto } from "@/core/schemas/budgetSchema";
import { withAuth } from "@/core/useCases/utils";
import { DomainValidationError } from "@/utils";

export const getBudget = (budgetRepository: IBudgetRepository) => {
  const useCase = async (
    userId: string,
    input: { budgetId: string }
  ): Promise<BudgetDto | null> => {
    const { budgetId } = input;

    if (!budgetId) throw new DomainValidationError("Budget ID is required");

    return budgetRepository.getOneById(userId, budgetId);
  };

  return withAuth(useCase);
};
