import { Budget } from "@/core/entities/budget";
import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { BudgetDto, UpdateBudgetDto } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import {
  BudgetId,
  BudgetName,
  MaximumSpending,
} from "@/core/valueObjects/budget";
import { ColorTag } from "@/core/valueObjects/transaction";
import { DomainValidationError, NotFoundError } from "@/utils";

export const updateBudget = (budgetRepository: IBudgetRepository) => {
  const useCase = async (
    userId: string,
    input: { budgetId: string; data: UpdateBudgetDto }
  ): Promise<BudgetDto> => {
    const { budgetId, data } = input;

    // Validate budget ID
    const budgetIdOrError = BudgetId.create(budgetId);
    if (budgetIdOrError.isFailure) {
      throw new DomainValidationError(budgetIdOrError.error);
    }

    // Get existing budget
    const existingBudgetDto = await budgetRepository.getOneById(
      userId,
      budgetId
    );
    if (!existingBudgetDto) {
      throw new NotFoundError("Budget not found");
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

    // Reconstitute domain entity
    const budgetOrError = Budget.reconstitute({
      id: budgetIdOrError.value,
      name: BudgetName.create(existingBudgetDto.name).value,
      colorTag: ColorTag.create(existingBudgetDto.colorTag).value,
      maximumSpending: MaximumSpending.create(existingBudgetDto.maximumSpending)
        .value,
      createdAt: existingBudgetDto.createdAt,
      updatedAt: existingBudgetDto.updatedAt,
    });

    if (budgetOrError.isFailure) {
      throw new DomainValidationError(budgetOrError.error);
    }

    const budget = budgetOrError.value;

    // Use entity's update method (validates internally)
    const updateResult = budget.update({
      name: data.name,
      colorTag: data.colorTag,
      maximumSpending: data.maximumSpending,
    });

    if (updateResult.isFailure) {
      throw new DomainValidationError(updateResult.error);
    }

    // Use entity's DTO method
    return budgetRepository.updateOne(userId, budgetId, budget.toDto());
  };

  return withAuth(useCase);
};
