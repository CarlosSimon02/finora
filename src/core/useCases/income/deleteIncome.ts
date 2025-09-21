import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { AuthError, DomainValidationError } from "@/utils";

export const deleteIncome =
  (incomeRepository: IIncomeRepository) =>
  async (userId: string, incomeId: string): Promise<void> => {
    if (!userId) throw new AuthError();
    if (!incomeId) throw new DomainValidationError("Income ID is required");

    await incomeRepository.deleteOne(userId, incomeId);
  };
