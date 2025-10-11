import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import {
  PaginatedIncomesWithTransactionsResponseDto,
  transactionPreviewCountSchema,
} from "@/core/schemas/incomeSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
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

  return withAuth(useCase);
};
