import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { withAuth } from "@/core/useCases/utils";

export const getBudgetsCount = (budgetRepository: IBudgetRepository) => {
  const useCase = async (userId: string): Promise<number> => {
    return budgetRepository.getCount(userId);
  };

  return withAuth(useCase);
};
