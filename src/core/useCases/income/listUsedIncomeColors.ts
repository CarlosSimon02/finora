import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { withAuth } from "@/core/useCases/utils";

export const listUsedIncomeColors = (incomeRepository: IIncomeRepository) => {
  const useCase = async (userId: string): Promise<string[]> => {
    return incomeRepository.getUsedColors(userId);
  };

  return withAuth(useCase);
};
