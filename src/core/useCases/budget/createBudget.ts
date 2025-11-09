import { COLOR_OPTIONS } from "@/constants/colors";
import { Result } from "@/core/entities/shared";
import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { BudgetDto, CreateBudgetDto } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { BudgetName, MaximumSpending } from "@/core/valueObjects/budget";
import { ColorTag } from "@/core/valueObjects/transaction";
import { ConflictError, DomainValidationError } from "@/utils";

export const createBudget = (budgetRepository: IBudgetRepository) => {
  const useCase = async (
    userId: string,
    input: { data: CreateBudgetDto }
  ): Promise<BudgetDto> => {
    const { data } = input;

    // Validate using domain value objects
    const validationResults: Result<any>[] = [
      BudgetName.create(data.name),
      ColorTag.create(data.colorTag),
      MaximumSpending.create(data.maximumSpending),
    ];

    const combinedResult = Result.combine(validationResults);
    if (combinedResult.isFailure) {
      throw new DomainValidationError(combinedResult.error);
    }

    // Business rule: Maximum number of budgets
    const currentCount = await budgetRepository.getCount(userId);
    const maxItems = COLOR_OPTIONS.length;
    if (currentCount >= maxItems) {
      throw new DomainValidationError("Maximum number of budgets reached");
    }

    // Business rule: Unique budget name
    const existing = await budgetRepository.getOneByName(userId, data.name);
    if (existing) {
      throw new ConflictError("Budget name already exists");
    }

    // Business rule: Unique color per budget
    const existingColor = await budgetRepository.getOneByColor(
      userId,
      data.colorTag
    );
    if (existingColor) {
      throw new DomainValidationError("Budget color already in use");
    }

    // Domain validation passed, delegate to repository
    return budgetRepository.createOne(userId, data);
  };

  return withAuth(useCase);
};
