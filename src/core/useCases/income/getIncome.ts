import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { IncomeDto } from "@/core/schemas/incomeSchema";
import { AuthError, DomainValidationError } from "@/utils";

export const getIncome =
  (incomeRepository: IIncomeRepository) =>
  async (userId: string, incomeId: string): Promise<IncomeDto | null> => {
    if (!userId) throw new AuthError();
    if (!incomeId) throw new DomainValidationError("Income ID is required");

    return incomeRepository.getOneById(userId, incomeId);
  };
