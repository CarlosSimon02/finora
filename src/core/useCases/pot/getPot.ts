import { IPotRepository } from "@/core/interfaces/IPotRepository";
import { PotDto } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { PotId } from "@/core/valueObjects/pot";
import { DomainValidationError } from "@/utils";

export const getPot = (potRepository: IPotRepository) => {
  const useCase = async (
    userId: string,
    input: { potId: string }
  ): Promise<PotDto | null> => {
    const { potId } = input;

    // Validate pot ID using domain value object
    const potIdOrError = PotId.create(potId);
    if (potIdOrError.isFailure) {
      throw new DomainValidationError(potIdOrError.error);
    }

    return potRepository.getOneById(userId, potId);
  };

  return withAuth(useCase);
};
