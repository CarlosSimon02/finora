import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { AuthError } from "@/utils";

export const getUsedColors =
  (incomeRepository: IIncomeRepository) =>
  async (userId: string): Promise<string[]> => {
    if (!userId) throw new AuthError();
    return incomeRepository.getUsedColors(userId);
  };
