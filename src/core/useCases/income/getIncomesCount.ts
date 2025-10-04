import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { AuthError } from "@/utils";

export const getIncomesCount =
  (incomeRepository: IIncomeRepository) =>
  async (userId: string): Promise<number> => {
    if (!userId) throw new AuthError();
    return incomeRepository.getCount(userId);
  };
