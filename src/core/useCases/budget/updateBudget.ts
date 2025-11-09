import { Result } from "@/core/entities/shared";
import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { BudgetDto, UpdateBudgetDto } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import {
  BudgetId,
  BudgetName,
  MaximumSpending,
} from "@/core/valueObjects/budget";
import { ColorTag } from "@/core/valueObjects/transaction";
import { DomainValidationError } from "@/utils";

export const updateBudget = (budgetRepository: IBudgetRepository) => {
  const useCase = async (
    userId: string,
    input: { budgetId: string; data: UpdateBudgetDto }
  ): Promise<BudgetDto> => {
    const { budgetId, data } = input;

    // Validate budget ID using domain value object
    const budgetIdOrError = BudgetId.create(budgetId);
    if (budgetIdOrError.isFailure) {
      throw new DomainValidationError(budgetIdOrError.error);
    }

    // Validate each field if provided using domain value objects
    const validationResults: Result<any>[] = [];

    if (data.name !== undefined) {
      validationResults.push(BudgetName.create(data.name));
    }

    if (data.colorTag !== undefined) {
      validationResults.push(ColorTag.create(data.colorTag));
    }

    if (data.maximumSpending !== undefined) {
      validationResults.push(MaximumSpending.create(data.maximumSpending));
    }

    // Check all validations
    const combinedResult = Result.combine(validationResults);
    if (combinedResult.isFailure) {
      throw new DomainValidationError(combinedResult.error);
    }

    // Business rule: Unique budget name
    if (data.name) {
      const existingByName = await budgetRepository.getOneByName(
        userId,
        data.name
      );
      if (existingByName && existingByName.id !== budgetId) {
        throw new DomainValidationError("Budget name already exists");
      }
    }

    // Business rule: Unique color per budget
    if (data.colorTag) {
      const existingColor = await budgetRepository.getOneByColor(
        userId,
        data.colorTag
      );
      if (existingColor && existingColor.id !== budgetId) {
        throw new DomainValidationError("Budget color already in use");
      }
    }

    // Domain validation passed, delegate to repository
    return budgetRepository.updateOne(userId, budgetId, data);
  };

  return withAuth(useCase);
};
