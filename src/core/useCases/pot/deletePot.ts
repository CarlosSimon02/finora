import { IPotRepository } from "@/core/interfaces/IPotRepository";
import { AuthError, DomainValidationError } from "@/utils";

export const deletePot =
  (potRepository: IPotRepository) =>
  async (userId: string, potId: string): Promise<void> => {
    if (!userId) throw new AuthError();
    if (!potId) throw new DomainValidationError("Pot ID is required");

    await potRepository.deleteOne(userId, potId);
  };
