import { COLOR_OPTIONS } from "@/constants/colors";
import { Income } from "@/core/entities/income";
import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { CreateIncomeDto, IncomeDto } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { ConflictError, DomainValidationError } from "@/utils";

export const createIncome = (incomeRepository: IIncomeRepository) => {
  const useCase = async (
    userId: string,
    input: { data: CreateIncomeDto }
  ): Promise<IncomeDto> => {
    const { data } = input;

    // Create domain entity (validates internally)
    const incomeOrError = Income.create({
      name: data.name,
      colorTag: data.colorTag,
    });

    if (incomeOrError.isFailure) {
      throw new DomainValidationError(incomeOrError.error);
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

    const income = incomeOrError.value;

    // Use entity's DTO method
    return incomeRepository.createOne(userId, income.toDto());
  };

  return withAuth(useCase);
};
