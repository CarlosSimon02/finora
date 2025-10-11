import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { PaginatedBudgetsResponseDto, PaginationParams } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { DomainValidationError } from "@/utils";

export const getPaginatedBudgets = (budgetRepository: IBudgetRepository) => {
  const useCase = async (
    userId: string,
    input: { params: PaginationParams }
  ): Promise<PaginatedBudgetsResponseDto> => {
    const { params } = input;

    if (!params)
      throw new DomainValidationError("Pagination params are required");

    return budgetRepository.getPaginated(userId, params);
  };

  return withAuth(useCase);
};
