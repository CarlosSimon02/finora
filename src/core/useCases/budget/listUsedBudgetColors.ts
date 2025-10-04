import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { AuthError } from "@/utils";

export const getUsedColors =
  (budgetRepository: IBudgetRepository) =>
  async (userId: string): Promise<string[]> => {
    if (!userId) throw new AuthError();
    return budgetRepository.getUsedColors(userId);
  };
