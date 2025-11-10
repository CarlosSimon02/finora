import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import {
  PaginatedBudgetsWithTransactionsResponseDto,
  PaginationParams,
  budgetTransactionPreviewCountSchema,
} from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { DomainValidationError } from "@/utils";

export const getPaginatedBudgetsWithTransactions = (
  budgetRepository: IBudgetRepository
) => {
  const useCase = async (
    userId: string,
    input: { params: PaginationParams; transactionCount?: number }
  ): Promise<PaginatedBudgetsWithTransactionsResponseDto> => {
    const { params, transactionCount } = input;

    // Simple validation - pagination params are infrastructure concerns, not domain
    if (!params) {
      throw new DomainValidationError("Pagination params are required");
    }

    // Validate transaction count if provided
    const parsedCount =
      transactionCount !== undefined
        ? budgetTransactionPreviewCountSchema.parse(transactionCount)
        : undefined;

    // Query use case - fetches budgets with their transactions
    return budgetRepository.getPaginatedWithTransactions(
      userId,
      params,
      parsedCount
    );
  };

  return withAuth(useCase);
};
