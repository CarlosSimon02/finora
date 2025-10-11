import { COLOR_OPTIONS } from "@/constants/colors";
import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { BudgetDto, CreateBudgetDto, createBudgetSchema } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { ConflictError, DomainValidationError } from "@/utils";

export const createBudget = (budgetRepository: IBudgetRepository) => {
  const useCase = async (
    userId: string,
    input: { data: CreateBudgetDto }
  ): Promise<BudgetDto> => {
    const { data } = input;

    const validatedData = createBudgetSchema.parse(data);

    const currentCount = await budgetRepository.getCount(userId);
    const maxItems = COLOR_OPTIONS.length;
    if (currentCount >= maxItems) {
      throw new DomainValidationError("Maximum number of budgets reached");
    }

    const existing = await budgetRepository.getOneByName(
      userId,
      validatedData.name
    );
    if (existing) throw new ConflictError("Budget name already exists");

    const existingColor = await budgetRepository.getOneByColor(
      userId,
      validatedData.colorTag
    );
    if (existingColor) {
      throw new DomainValidationError("Budget color already in use");
    }

    return budgetRepository.createOne(userId, validatedData);
  };

  return withAuth(useCase);
};
