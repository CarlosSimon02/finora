import { COLOR_OPTIONS } from "@/constants/colors";
import { Result } from "@/core/entities/shared";
import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { CreateIncomeDto, IncomeDto } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { IncomeName } from "@/core/valueObjects/income";
import { ColorTag } from "@/core/valueObjects/transaction";
import { ConflictError, DomainValidationError } from "@/utils";

export const createIncome = (incomeRepository: IIncomeRepository) => {
  const useCase = async (
    userId: string,
    input: { data: CreateIncomeDto }
  ): Promise<IncomeDto> => {
    const { data } = input;

    // Validate using domain value objects
    const validationResults: Result<any>[] = [
      IncomeName.create(data.name),
      ColorTag.create(data.colorTag),
    ];

    const combinedResult = Result.combine(validationResults);
    if (combinedResult.isFailure) {
      throw new DomainValidationError(combinedResult.error);
    }

    // Business rule: Maximum number of incomes
    const currentCount = await incomeRepository.getCount(userId);
    const maxItems = COLOR_OPTIONS.length;
    if (currentCount >= maxItems) {
      throw new DomainValidationError("Maximum number of incomes reached");
    }

    // Business rule: Unique income name
    const incomeExists = await incomeRepository.getOneByName(userId, data.name);
    if (incomeExists) {
      throw new ConflictError("Income name already exists");
    }

    // Business rule: Unique color per income
    const existingColor = await incomeRepository.getOneByColor(
      userId,
      data.colorTag
    );
    if (existingColor) {
      throw new DomainValidationError("Income color already in use");
    }

    // Domain validation passed, delegate to repository
    return incomeRepository.createOne(userId, data);
  };

  return withAuth(useCase);
};
