import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { withAuth } from "@/core/useCases/utils";

export const listUsedBudgetColors = (budgetRepository: IBudgetRepository) => {
  const useCase = async (userId: string): Promise<string[]> => {
    // Simple query - fetch colors currently in use
    return budgetRepository.getUsedColors(userId);
  };

  return withAuth(useCase);
};
