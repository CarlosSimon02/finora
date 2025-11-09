import { IPotRepository } from "@/core/interfaces/IPotRepository";
import { PaginatedPotsResponseDto, PaginationParams } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { DomainValidationError } from "@/utils";

export const getPaginatedPots = (potRepository: IPotRepository) => {
  const useCase = async (
    userId: string,
    input: { params: PaginationParams }
  ): Promise<PaginatedPotsResponseDto> => {
    const { params } = input;

    // Simple validation - pagination params are infrastructure concerns, not domain
    if (!params) {
      throw new DomainValidationError("Pagination params are required");
    }

    // Query use case - no business rules to enforce
    return potRepository.getPaginated(userId, params);
  };

  return withAuth(useCase);
};
