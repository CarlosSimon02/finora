import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { BudgetsSummaryDto, budgetsSummaryParamsSchema } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";

export const getBudgetsSummary = (budgetRepository: IBudgetRepository) => {
  const useCase = async (
    userId: string,
    input: { maxBudgetsToShow?: number }
  ): Promise<BudgetsSummaryDto> => {
    const { maxBudgetsToShow } = input;

    // Validate params (infrastructure concern, not domain)
    const { maxBudgetsToShow: limit } = budgetsSummaryParamsSchema.parse({
      maxBudgetsToShow,
    });

    // Query use case - fetches summary data
    return budgetRepository.getSummary(userId, limit);
  };

  return withAuth(useCase);
};
