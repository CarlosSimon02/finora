import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { PaginatedCategoriesResponseDto } from "@/core/schemas/categorySchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { AuthError, DomainValidationError } from "@/utils";

export const getPaginatedCategories =
  (transactionRepository: ITransactionRepository) =>
  async (
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedCategoriesResponseDto> => {
    if (!userId) throw new AuthError();
    if (!params)
      throw new DomainValidationError("Pagination params are required");

    return transactionRepository.getPaginatedCategories(userId, params);
  };
