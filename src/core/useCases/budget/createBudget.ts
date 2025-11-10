import { COLOR_OPTIONS } from "@/constants/colors";
import { Budget } from "@/core/entities/budget";
import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { BudgetDto, CreateBudgetDto } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { ConflictError, DomainValidationError } from "@/utils";

export const createBudget = (budgetRepository: IBudgetRepository) => {
  const useCase = async (
    userId: string,
    input: { data: CreateBudgetDto }
  ): Promise<BudgetDto> => {
    const { data } = input;

    // Create domain entity (validates internally)
    const budgetOrError = Budget.create({
      name: data.name,
      colorTag: data.colorTag,
      maximumSpending: data.maximumSpending,
    });

    if (budgetOrError.isFailure) {
      throw new DomainValidationError(budgetOrError.error);
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

    const budget = budgetOrError.value;

    // Use entity's DTO method
    return budgetRepository.createOne(userId, budget.toDto());
  };

  return withAuth(useCase);
};
