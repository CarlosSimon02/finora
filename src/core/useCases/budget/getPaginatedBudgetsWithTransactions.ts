import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import {
  PaginatedBudgetsWithTransactionsResponseDto,
  budgetTransactionPreviewCountSchema,
} from "@/core/schemas/budgetSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { AuthError, DomainValidationError } from "@/utils";

export const getPaginatedBudgetsWithTransactions =
  (budgetRepository: IBudgetRepository) =>
  async (
    userId: string,
    params: PaginationParams,
    transactionCount?: number
  ): Promise<PaginatedBudgetsWithTransactionsResponseDto> => {
    if (!userId) throw new AuthError();
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
