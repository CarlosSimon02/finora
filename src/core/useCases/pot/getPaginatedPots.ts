import { IPotRepository } from "@/core/interfaces/IPotRepository";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { PaginatedPotsResponseDto } from "@/core/schemas/potSchema";
import { AuthError, DomainValidationError } from "@/utils";

export const getPaginatedPots =
  (potRepository: IPotRepository) =>
  async (
    userId: string,
    params: PaginationParams
  ): Promise<PaginatedPotsResponseDto> => {
    if (!userId) throw new AuthError();
    if (!params)
      throw new DomainValidationError("Pagination params are required");

    return potRepository.getPaginated(userId, params);
  };
