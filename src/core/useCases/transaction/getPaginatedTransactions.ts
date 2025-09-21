import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { PaginatedTransactionsResponseDto } from "@/core/schemas/transactionSchema";
import { AuthError, DomainValidationError } from "@/utils";

export const getPaginatedTransactions =
  (transactionRepository: ITransactionRepository) =>
  async (
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedTransactionsResponseDto> => {
    if (!userId) throw new AuthError();
    if (!params)
      throw new DomainValidationError("Pagination params are required");

    return transactionRepository.getPaginated(userId, params);
  };
