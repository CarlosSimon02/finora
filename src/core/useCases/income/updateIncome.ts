import { Result } from "@/core/entities/shared";
import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { IncomeDto, UpdateIncomeDto } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { IncomeId, IncomeName } from "@/core/valueObjects/income";
import { ColorTag } from "@/core/valueObjects/transaction";
import { DomainValidationError } from "@/utils";

export const updateIncome = (incomeRepository: IIncomeRepository) => {
  const useCase = async (
    userId: string,
    input: { incomeId: string; data: UpdateIncomeDto }
  ): Promise<IncomeDto> => {
    const { incomeId, data } = input;

    // Validate income ID using domain value object
    const incomeIdOrError = IncomeId.create(incomeId);
    if (incomeIdOrError.isFailure) {
      throw new DomainValidationError(incomeIdOrError.error);
    }

    // Validate each field if provided using domain value objects
    const validationResults: Result<any>[] = [];

    if (data.name !== undefined) {
      validationResults.push(IncomeName.create(data.name));
    }

    if (data.colorTag !== undefined) {
      validationResults.push(ColorTag.create(data.colorTag));
    }

    // Check all validations
    const combinedResult = Result.combine(validationResults);
    if (combinedResult.isFailure) {
      throw new DomainValidationError(combinedResult.error);
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

    // Domain validation passed, delegate to repository
    return incomeRepository.updateOne(userId, incomeId, data);
  };

  return withAuth(useCase);
};
