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

    if (!params)
      throw new DomainValidationError("Pagination params are required");

    return potRepository.getPaginated(userId, params);
  };

  return withAuth(useCase);
};
