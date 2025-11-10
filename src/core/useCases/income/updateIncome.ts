import { Income } from "@/core/entities/income";
import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { IncomeDto, UpdateIncomeDto } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { IncomeId, IncomeName } from "@/core/valueObjects/income";
import { ColorTag } from "@/core/valueObjects/transaction";
import { DomainValidationError, NotFoundError } from "@/utils";

export const updateIncome = (incomeRepository: IIncomeRepository) => {
  const useCase = async (
    userId: string,
    input: { incomeId: string; data: UpdateIncomeDto }
  ): Promise<IncomeDto> => {
    const { incomeId, data } = input;

    // Validate income ID
    const incomeIdOrError = IncomeId.create(incomeId);
    if (incomeIdOrError.isFailure) {
      throw new DomainValidationError(incomeIdOrError.error);
    }

    // Get existing income
    const existingIncomeDto = await incomeRepository.getOneById(
      userId,
      incomeId
    );
    if (!existingIncomeDto) {
      throw new NotFoundError("Income not found");
    }

    // Business rule: Unique income name
    if (data.name) {
      const existingByName = await incomeRepository.getOneByName(
        userId,
        data.name
      );
      if (existingByName && existingByName.id !== incomeId) {
        throw new DomainValidationError("Income name already exists");
      }
    }

    // Business rule: Unique color per income
    if (data.colorTag) {
      const existingColor = await incomeRepository.getOneByColor(
        userId,
        data.colorTag
      );
      if (existingColor && existingColor.id !== incomeId) {
        throw new DomainValidationError("Income color already in use");
      }
    }

    // Reconstitute domain entity
    const incomeOrError = Income.reconstitute({
      id: incomeIdOrError.value,
      name: IncomeName.create(existingIncomeDto.name).value,
      colorTag: ColorTag.create(existingIncomeDto.colorTag).value,
      createdAt: existingIncomeDto.createdAt,
      updatedAt: existingIncomeDto.updatedAt,
    });

    if (incomeOrError.isFailure) {
      throw new DomainValidationError(incomeOrError.error);
    }

    const income = incomeOrError.value;

    // Use entity's update method (validates internally)
    const updateResult = income.update({
      name: data.name,
      colorTag: data.colorTag,
    });

    if (updateResult.isFailure) {
      throw new DomainValidationError(updateResult.error);
    }

    // Use entity's DTO method
    return incomeRepository.updateOne(userId, incomeId, income.toDto());
  };

  return withAuth(useCase);
};
