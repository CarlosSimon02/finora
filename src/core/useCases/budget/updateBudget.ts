import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import {
  BudgetDto,
  UpdateBudgetDto,
  updateBudgetSchema,
} from "@/core/schemas/budgetSchema";
import { AuthError, DomainValidationError } from "@/utils";

export const updateBudget =
  (budgetRepository: IBudgetRepository) =>
  async (
    userId: string,
    budgetId: string,
    input: UpdateBudgetDto
  ): Promise<BudgetDto> => {
    if (!userId) throw new AuthError();
    if (!budgetId) throw new DomainValidationError("Budget ID is required");

    const validatedData = updateBudgetSchema.parse(input);

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
