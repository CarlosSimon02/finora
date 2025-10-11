import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { withAuth } from "@/core/useCases/utils";

export const getIncomesCount = (incomeRepository: IIncomeRepository) => {
  const useCase = async (userId: string): Promise<number> => {
    return incomeRepository.getCount(userId);
  };

  return withAuth(useCase);
};
