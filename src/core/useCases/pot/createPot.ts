import { COLOR_OPTIONS } from "@/constants/colors";
import { Result } from "@/core/entities/shared";
import { IPotRepository } from "@/core/interfaces/IPotRepository";
import { CreatePotDto, PotDto } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { PotName, PotTarget } from "@/core/valueObjects/pot";
import { ColorTag } from "@/core/valueObjects/transaction";
import { ConflictError, DomainValidationError } from "@/utils";

export const createPot = (potRepository: IPotRepository) => {
  const useCase = async (
    userId: string,
    input: { data: CreatePotDto }
  ): Promise<PotDto> => {
    const { data } = input;

    // Validate using domain value objects
    const validationResults: Result<any>[] = [
      PotName.create(data.name),
      ColorTag.create(data.colorTag),
      PotTarget.create(data.target),
    ];

    const combinedResult = Result.combine(validationResults);
    if (combinedResult.isFailure) {
      throw new DomainValidationError(combinedResult.error);
    }

    // Business rule: Maximum number of pots
    const currentCount = await potRepository.getCount(userId);
    const maxItems = COLOR_OPTIONS.length;
    if (currentCount >= maxItems) {
      throw new DomainValidationError("Maximum number of pots reached");
    }

    // Business rule: Unique pot name
    const existingPot = await potRepository.getOneByName(userId, data.name);
    if (existingPot) {
      throw new ConflictError("Pot name already exists");
    }

    // Business rule: Unique color per pot
    const existingColorPot = await potRepository.getOneByColor(
      userId,
      data.colorTag
    );
    if (existingColorPot) {
      throw new DomainValidationError("Pot color already in use");
    }

    // Domain validation passed, delegate to repository
    return potRepository.createOne(userId, data);
  };

  return withAuth(useCase);
};
