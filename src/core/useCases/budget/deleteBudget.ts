import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { AuthError, DomainValidationError } from "@/utils";

export const deleteBudget =
  (budgetRepository: IBudgetRepository) =>
  async (userId: string, budgetId: string): Promise<void> => {
    if (!userId) throw new AuthError();
    if (!budgetId) throw new DomainValidationError("Budget ID is required");

    await budgetRepository.deleteOne(userId, budgetId);
  };
