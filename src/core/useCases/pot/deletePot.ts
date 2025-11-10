import { IPotRepository } from "@/core/interfaces/IPotRepository";
import { withAuth } from "@/core/useCases/utils";
import { PotId } from "@/core/valueObjects/pot";
import { DomainValidationError } from "@/utils";

export const deletePot = (potRepository: IPotRepository) => {
  const useCase = async (
    userId: string,
    input: { potId: string }
  ): Promise<void> => {
    const { potId } = input;

    // Validate pot ID using domain value object
    const potIdOrError = PotId.create(potId);
    if (potIdOrError.isFailure) {
      throw new DomainValidationError(potIdOrError.error);
    }

    await potRepository.deleteOne(userId, potId);
  };

  return withAuth(useCase);
};
