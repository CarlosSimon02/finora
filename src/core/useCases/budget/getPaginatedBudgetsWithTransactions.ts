import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import {
  PaginatedBudgetsWithTransactionsResponseDto,
  budgetTransactionPreviewCountSchema,
} from "@/core/schemas/budgetSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
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

    if (!params)
      throw new DomainValidationError("Pagination params are required");

    const parsedCount =
      transactionCount !== undefined
        ? budgetTransactionPreviewCountSchema.parse(transactionCount)
        : undefined;

    return budgetRepository.getPaginatedWithTransactions(
      userId,
      params,
      parsedCount
    );
  };

  return withAuth(useCase);
};
