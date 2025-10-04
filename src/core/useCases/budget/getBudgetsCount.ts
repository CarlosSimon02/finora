import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { AuthError } from "@/utils";

export const getBudgetsCount =
  (budgetRepository: IBudgetRepository) =>
  async (userId: string): Promise<number> => {
    if (!userId) throw new AuthError();
    return budgetRepository.getCount(userId);
  };
