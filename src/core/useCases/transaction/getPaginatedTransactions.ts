import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import {
  PaginatedTransactionsResponseDto,
  PaginationParams,
} from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { DomainValidationError } from "@/utils";

export const getPaginatedTransactions = (
  transactionRepository: ITransactionRepository
) => {
  const useCase = async (
    userId: string,
    input: {
      params: PaginationParams;
    }
  ): Promise<PaginatedTransactionsResponseDto> => {
    const { params } = input;

    if (!params)
      throw new DomainValidationError("Pagination params are required");

    return transactionRepository.getPaginated(userId, params);
  };

  return withAuth(useCase);
};
