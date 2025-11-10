import { COLOR_OPTIONS } from "@/constants/colors";
import { Pot } from "@/core/entities/pot";
import { IPotRepository } from "@/core/interfaces/IPotRepository";
import { CreatePotDto, PotDto } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { ConflictError, DomainValidationError } from "@/utils";

export const createPot = (potRepository: IPotRepository) => {
  const useCase = async (
    userId: string,
    input: { data: CreatePotDto }
  ): Promise<PotDto> => {
    const { data } = input;

    // Create domain entity (validates internally)
    const potOrError = Pot.create({
      name: data.name,
      colorTag: data.colorTag,
      target: data.target,
    });

    if (potOrError.isFailure) {
      throw new DomainValidationError(potOrError.error);
    }

    // Business rule: Maximum number of pots
    const currentCount = await potRepository.getCount(userId);
    const maxItems = COLOR_OPTIONS.length;
    if (currentCount >= maxItems) {
      throw new DomainValidationError("Maximum number of pots reached");
    }

    // Business rule: Unique pot name
    const existing = await potRepository.getOneByName(userId, data.name);
    if (existing) {
      throw new ConflictError("Pot name already exists");
    }

    // Business rule: Unique color per pot
    const existingColor = await potRepository.getOneByColor(
      userId,
      data.colorTag
    );
    if (existingColor) {
      throw new DomainValidationError("Pot color already in use");
    }

    const pot = potOrError.value;

    // Use entity's DTO method
    return potRepository.createOne(userId, pot.toDto());
  };

  return withAuth(useCase);
};
