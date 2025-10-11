import { COLOR_OPTIONS } from "@/constants/colors";
import { IPotRepository } from "@/core/interfaces/IPotRepository";
import { CreatePotDto, PotDto, createPotSchema } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { ConflictError, DomainValidationError } from "@/utils";

export const createPot = (potRepository: IPotRepository) => {
  const useCase = async (
    userId: string,
    input: { data: CreatePotDto }
  ): Promise<PotDto> => {
    const { data } = input;

    const validatedData = createPotSchema.parse(data);

    const currentCount = await potRepository.getCount(userId);
    const maxItems = COLOR_OPTIONS.length;
    if (currentCount >= maxItems) {
      throw new DomainValidationError("Maximum number of pots reached");
    }

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

  return withAuth(useCase);
};
