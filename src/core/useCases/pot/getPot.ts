import { IPotRepository } from "@/core/interfaces/IPotRepository";
import { PotDto } from "@/core/schemas/potSchema";
import { AuthError, DomainValidationError } from "@/utils";

export const getPot =
  (potRepository: IPotRepository) =>
  async (userId: string, potId: string): Promise<PotDto | null> => {
    if (!userId) throw new AuthError();
    if (!potId) throw new DomainValidationError("Pot ID is required");

    return potRepository.getOneById(userId, potId);
  };
