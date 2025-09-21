import { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { PaginatedBudgetsResponseDto } from "@/core/schemas/budgetSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { AuthError, DomainValidationError } from "@/utils";

export const getPaginatedBudgets =
  (budgetRepository: IBudgetRepository) =>
  async (
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedBudgetsResponseDto> => {
    if (!userId) throw new AuthError();
    if (!params)
      throw new DomainValidationError("Pagination params are required");

    return budgetRepository.getPaginated(userId, params);
  };
