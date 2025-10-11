import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { PaginatedIncomesResponseDto, PaginationParams } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { DomainValidationError } from "@/utils";

export const getPaginatedIncomes = (incomeRepository: IIncomeRepository) => {
  const useCase = async (
    userId: string,
    input: { params: PaginationParams }
  ): Promise<PaginatedIncomesResponseDto> => {
    const { params } = input;

    if (!params)
      throw new DomainValidationError("Pagination params are required");

    return incomeRepository.getPaginated(userId, params);
  };

  return withAuth(useCase);
};
