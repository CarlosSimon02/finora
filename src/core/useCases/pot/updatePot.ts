import { IPotRepository } from "@/core/interfaces/IPotRepository";
import {
  PotDto,
  UpdatePotDto,
  updatePotSchema,
} from "@/core/schemas/potSchema";
import { withAuth } from "@/core/useCases/utils";
import { DomainValidationError } from "@/utils";

export const updatePot = (potRepository: IPotRepository) => {
  const useCase = async (
    userId: string,
    input: { potId: string; data: UpdatePotDto }
  ): Promise<PotDto> => {
    const { potId, data } = input;

    if (!potId) throw new DomainValidationError("Pot ID is required");

    const validatedData = updatePotSchema.parse(data);

    if (validatedData.name) {
      const existingPot = await potRepository.getOneByName(
        userId,
        validatedData.name
      );
      if (existingPot && existingPot.id !== potId) {
        throw new DomainValidationError("Pot name already exists");
      }
    }

    if (validatedData.colorTag) {
      const existingColorPot = await potRepository.getOneByColor(
        userId,
        validatedData.colorTag
      );
      if (existingColorPot && existingColorPot.id !== potId) {
        throw new DomainValidationError("Pot color already in use");
      }
    }

    return potRepository.updateOne(userId, potId, validatedData);
  };

  return withAuth(useCase);
};
