import { IIncomeRepository } from "@/core/interfaces/IIncomeRepository";
import { PaginatedIncomesResponseDto } from "@/core/schemas/incomeSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { AuthError, DomainValidationError } from "@/utils";

export const getPaginatedIncomes =
  (incomeRepository: IIncomeRepository) =>
  async (
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedIncomesResponseDto> => {
    if (!userId) throw new AuthError();
    if (!params)
      throw new DomainValidationError("Pagination params are required");

    return incomeRepository.getPaginated(userId, params);
  };
