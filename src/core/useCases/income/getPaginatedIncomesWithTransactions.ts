import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { PaginatedIncomesWithTransactionsResponseDto } from "@/core/schemas/incomeSchema";
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
    if (transactionCount && transactionCount <= 0)
      throw new DomainValidationError(
        "Transaction count must be greater than 0"
      );
    if (transactionCount && transactionCount > 50)
      throw new DomainValidationError("Transaction count must be less than 50");

    return incomeRepository.getPaginatedWithTransactions(
      userId,
      params,
      transactionCount
    );
  };
