import { COLOR_OPTIONS } from "@/constants/colors";
import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import {
  BudgetDto,
  CreateBudgetDto,
  createBudgetSchema,
} from "@/core/schemas/budgetSchema";
import { AuthError, ConflictError, DomainValidationError } from "@/utils";

export const createBudget =
  (budgetRepository: IBudgetRepository) =>
  async (userId: string, input: CreateBudgetDto): Promise<BudgetDto> => {
    if (!userId) throw new AuthError();

    const validatedData = createBudgetSchema.parse(input);

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
