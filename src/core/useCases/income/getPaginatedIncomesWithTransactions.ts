import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import {
  PaginatedIncomesWithTransactionsResponseDto,
  transactionPreviewCountSchema,
} from "@/core/schemas/incomeSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { AuthError, DomainValidationError } from "@/utils";

export const getPaginatedIncomesWithTransactions =
  (incomeRepository: IIncomeRepository) =>
  async (
    userId: string,
    params: PaginationParams,
    transactionCount?: number
  ): Promise<PaginatedIncomesWithTransactionsResponseDto> => {
    if (!userId) throw new AuthError();
    if (!params)
      throw new DomainValidationError("Pagination params are required");

    const parsedCount =
      transactionCount !== undefined
        ? transactionPreviewCountSchema.parse(transactionCount)
        : undefined;

    return incomeRepository.getPaginatedWithTransactions(
      userId,
      params,
      parsedCount
    );
  };
