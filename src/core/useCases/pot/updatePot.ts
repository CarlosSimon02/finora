import { IPotRepository } from "@/core/interfaces/IPotRepository";
import {
  PotDto,
  UpdatePotDto,
  updatePotSchema,
} from "@/core/schemas/potSchema";
import { AuthError, DomainValidationError } from "@/utils";

export const updatePot =
  (potRepository: IPotRepository) =>
  async (
    userId: string,
    potId: string,
    input: UpdatePotDto
  ): Promise<PotDto> => {
    if (!userId) throw new AuthError();
    if (!potId) throw new DomainValidationError("Pot ID is required");

    const validatedData = updatePotSchema.parse(input);

    if (validatedData.name) {
      const existingPot = await potRepository.getOneByName(
        userId,
        validatedData.name
      );
      if (existingPot && existingPot.id !== potId) {
        throw new DomainValidationError("Pot name already exists");
      }
    }

    return potRepository.updateOne(userId, potId, validatedData);
  };
