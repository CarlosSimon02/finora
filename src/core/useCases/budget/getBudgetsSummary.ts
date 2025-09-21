import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import {
  BudgetsSummaryDto,
  budgetsSummaryParamsSchema,
} from "@/core/schemas/budgetSchema";
import { AuthError } from "@/utils";

export const getBudgetsSummary =
  (budgetRepository: IBudgetRepository) =>
  async (
    userId: string,
    maxBudgetsToShow?: number
  ): Promise<BudgetsSummaryDto> => {
    if (!userId) throw new AuthError();

    const { maxBudgetsToShow: limit } = budgetsSummaryParamsSchema.parse({
      maxBudgetsToShow,
    });

    return budgetRepository.getSummary(userId, limit);
  };
