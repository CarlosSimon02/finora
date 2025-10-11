import { IPotRepository } from "@/core/interfaces/IPotRepository";
import { PotDto } from "@/core/schemas/potSchema";
import { withAuth } from "@/core/useCases/utils";
import { DomainValidationError } from "@/utils";

export const getPot = (potRepository: IPotRepository) => {
  const useCase = async (
    userId: string,
    input: { potId: string }
  ): Promise<PotDto | null> => {
    const { potId } = input;

    if (!potId) throw new DomainValidationError("Pot ID is required");

    return potRepository.getOneById(userId, potId);
  };

  return withAuth(useCase);
};
