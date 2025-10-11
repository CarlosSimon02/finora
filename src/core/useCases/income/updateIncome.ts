import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import {
  IncomeDto,
  UpdateIncomeDto,
  updateIncomeSchema,
} from "@/core/schemas/incomeSchema";
import { withAuth } from "@/core/useCases/utils";
import { DomainValidationError } from "@/utils";

export const updateIncome = (incomeRepository: IIncomeRepository) => {
  const useCase = async (
    userId: string,
    input: { incomeId: string; data: UpdateIncomeDto }
  ): Promise<IncomeDto> => {
    const { incomeId, data } = input;

    if (!incomeId) throw new DomainValidationError("Income ID is required");

    const validatedData = updateIncomeSchema.parse(data);

    if (validatedData.name) {
      const existingByName = await incomeRepository.getOneByName(
        userId,
        validatedData.name
      );
      if (existingByName && existingByName.id !== incomeId) {
        throw new DomainValidationError("Income name already exists");
      }
    }
    if (validatedData.colorTag) {
      const existingColor = await incomeRepository.getOneByColor(
        userId,
        validatedData.colorTag
      );
      if (existingColor && existingColor.id !== incomeId) {
        throw new DomainValidationError("Income color already in use");
      }
    }
    return incomeRepository.updateOne(userId, incomeId, validatedData);
  };

  return withAuth(useCase);
};
