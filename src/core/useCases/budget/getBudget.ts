import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { BudgetDto } from "@/core/schemas/budgetSchema";
import { AuthError, DomainValidationError } from "@/utils";

export const getBudget =
  (budgetRepository: IBudgetRepository) =>
  async (userId: string, budgetId: string): Promise<BudgetDto | null> => {
    if (!userId) throw new AuthError();
    if (!budgetId) throw new DomainValidationError("Budget ID is required");

    return budgetRepository.getOneById(userId, budgetId);
  };
