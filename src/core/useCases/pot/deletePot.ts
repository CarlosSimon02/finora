import { IPotRepository } from "@/core/interfaces/IPotRepository";
import { withAuth } from "@/core/useCases/utils";
import { DomainValidationError } from "@/utils";

export const deletePot = (potRepository: IPotRepository) => {
  const useCase = async (
    userId: string,
    input: { potId: string }
  ): Promise<void> => {
    const { potId } = input;

    if (!potId) throw new DomainValidationError("Pot ID is required");

    await potRepository.deleteOne(userId, potId);
  };

  return withAuth(useCase);
};
