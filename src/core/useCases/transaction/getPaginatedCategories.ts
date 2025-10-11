import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { PaginatedCategoriesResponseDto } from "@/core/schemas/categorySchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
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

    if (!params)
      throw new DomainValidationError("Pagination params are required");

    return transactionRepository.getPaginatedCategories(userId, params);
  };

  return withAuth(useCase);
};
