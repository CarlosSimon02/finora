import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { withAuth } from "@/core/useCases/utils";

export const listUsedIncomeColors = (incomeRepository: IIncomeRepository) => {
  const useCase = async (userId: string): Promise<string[]> => {
    // Simple query - fetch colors currently in use
    return incomeRepository.getUsedColors(userId);
  };

  return withAuth(useCase);
};
