import { IPotRepository } from "@/core/interfaces/IPotRepository";
import {
  CreatePotDto,
  PotDto,
  createPotSchema,
} from "@/core/schemas/potSchema";
import { AuthError, ConflictError, DomainValidationError } from "@/utils";

export const createPot =
  (potRepository: IPotRepository) =>
  async (userId: string, input: CreatePotDto): Promise<PotDto> => {
    if (!userId) throw new AuthError();

    const validatedData = createPotSchema.parse(input);

    const existingPot = await potRepository.getOneByName(
      userId,
      validatedData.name
    );
    if (existingPot) {
      throw new ConflictError("Pot name already exists");
    }

    const existingColorPot = await potRepository.getOneByColor(
      userId,
      validatedData.colorTag
    );
    if (existingColorPot) {
      throw new DomainValidationError("Pot color already in use");
    }

    return potRepository.createOne(userId, validatedData);
  };
