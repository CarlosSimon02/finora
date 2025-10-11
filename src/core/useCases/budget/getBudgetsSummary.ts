import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { BudgetsSummaryDto, budgetsSummaryParamsSchema } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";

export const getBudgetsSummary = (budgetRepository: IBudgetRepository) => {
  const useCase = async (
    userId: string,
    input: { maxBudgetsToShow?: number }
  ): Promise<BudgetsSummaryDto> => {
    const { maxBudgetsToShow } = input;

    const { maxBudgetsToShow: limit } = budgetsSummaryParamsSchema.parse({
      maxBudgetsToShow,
    });

    return budgetRepository.getSummary(userId, limit);
  };

  return withAuth(useCase);
};
