import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import {
  PaginatedCategoriesResponseDto,
  PaginationParams,
} from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { DomainValidationError } from "@/utils";

export const getPaginatedCategories = (
  transactionRepository: ITransactionRepository
) => {
  const useCase = async (
    userId: string,
    input: {
      params: PaginationParams;
    }
  ): Promise<PaginatedCategoriesResponseDto> => {
    const { params } = input;

    // Simple validation - pagination params are infrastructure concerns, not domain
    if (!params) {
      throw new DomainValidationError("Pagination params are required");
    }

    // Query use case - no business rules to enforce
    return transactionRepository.getPaginatedCategories(userId, params);
  };

  return withAuth(useCase);
};
