import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import {
  PaginatedIncomesWithTransactionsResponseDto,
  PaginationParams,
  transactionPreviewCountSchema,
} from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { DomainValidationError } from "@/utils";

export const getPaginatedIncomesWithTransactions = (
  incomeRepository: IIncomeRepository
) => {
  const useCase = async (
    userId: string,
    input: { params: PaginationParams; transactionCount?: number }
  ): Promise<PaginatedIncomesWithTransactionsResponseDto> => {
    const { params, transactionCount } = input;

    // Simple validation - pagination params are infrastructure concerns, not domain
    if (!params) {
      throw new DomainValidationError("Pagination params are required");
    }

    // Validate transaction count if provided
    const parsedCount =
      transactionCount !== undefined
        ? transactionPreviewCountSchema.parse(transactionCount)
        : undefined;

    // Query use case - fetches incomes with their transactions
    return incomeRepository.getPaginatedWithTransactions(
      userId,
      params,
      parsedCount
    );
  };

  return withAuth(useCase);
};
