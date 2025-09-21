import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import {
  IncomeDto,
  UpdateIncomeDto,
  updateIncomeSchema,
} from "@/core/schemas/incomeSchema";
import { AuthError, DomainValidationError } from "@/utils";

export const updateIncome =
  (incomeRepository: IIncomeRepository) =>
  async (
    userId: string,
    incomeId: string,
    input: UpdateIncomeDto
  ): Promise<IncomeDto> => {
    if (!userId) throw new AuthError();
    if (!incomeId) throw new DomainValidationError("Income ID is required");

    const validatedData = updateIncomeSchema.parse(input);
    return incomeRepository.updateOne(userId, incomeId, validatedData);
  };
