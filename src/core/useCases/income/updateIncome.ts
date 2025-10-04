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
