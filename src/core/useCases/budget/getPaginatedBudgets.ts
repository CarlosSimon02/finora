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

    // Simple validation - pagination params are infrastructure concerns, not domain
    if (!params) {
      throw new DomainValidationError("Pagination params are required");
    }

    // Query use case - no business rules to enforce
    return budgetRepository.getPaginated(userId, params);
  };

  return withAuth(useCase);
};
