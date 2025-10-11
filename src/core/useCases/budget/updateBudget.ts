import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { BudgetDto, UpdateBudgetDto, updateBudgetSchema } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { DomainValidationError } from "@/utils";

export const updateBudget = (budgetRepository: IBudgetRepository) => {
  const useCase = async (
    userId: string,
    input: { budgetId: string; data: UpdateBudgetDto }
  ): Promise<BudgetDto> => {
    const { budgetId, data } = input;

    if (!budgetId) throw new DomainValidationError("Budget ID is required");

    const validatedData = updateBudgetSchema.parse(data);

    if (validatedData.name) {
      const existingByName = await budgetRepository.getOneByName(
        userId,
        validatedData.name
      );
      if (existingByName && existingByName.id !== budgetId) {
        throw new DomainValidationError("Budget name already exists");
      }
    }
    if (validatedData.colorTag) {
      const existingColor = await budgetRepository.getOneByColor(
        userId,
        validatedData.colorTag
      );
      if (existingColor && existingColor.id !== budgetId) {
        throw new DomainValidationError("Budget color already in use");
      }
    }
    return budgetRepository.updateOne(userId, budgetId, validatedData);
  };

  return withAuth(useCase);
};
