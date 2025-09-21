import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import {
  BudgetDto,
  CreateBudgetDto,
  createBudgetSchema,
} from "@/core/schemas/budgetSchema";
import { AuthError, ConflictError } from "@/utils";

export const createBudget =
  (budgetRepository: IBudgetRepository) =>
  async (userId: string, input: CreateBudgetDto): Promise<BudgetDto> => {
    if (!userId) throw new AuthError();

    const validatedData = createBudgetSchema.parse(input);

    const existing = await budgetRepository.getOneByName(
      userId,
      validatedData.name
    );
    if (existing) throw new ConflictError("Budget name already exists");

    return budgetRepository.createOne(userId, validatedData);
  };
