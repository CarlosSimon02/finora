import { Result } from "@/core/entities/shared";
import { IPotRepository } from "@/core/interfaces/IPotRepository";
import { PotDto, UpdatePotDto } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { PotId, PotName, PotTarget } from "@/core/valueObjects/pot";
import { ColorTag } from "@/core/valueObjects/transaction";
import { DomainValidationError } from "@/utils";

export const updatePot = (potRepository: IPotRepository) => {
  const useCase = async (
    userId: string,
    input: { potId: string; data: UpdatePotDto }
  ): Promise<PotDto> => {
    const { potId, data } = input;

    // Validate pot ID using domain value object
    const potIdOrError = PotId.create(potId);
    if (potIdOrError.isFailure) {
      throw new DomainValidationError(potIdOrError.error);
    }

    // Validate each field if provided using domain value objects
    const validationResults: Result<any>[] = [];

    if (data.name !== undefined) {
      validationResults.push(PotName.create(data.name));
    }

    if (data.colorTag !== undefined) {
      validationResults.push(ColorTag.create(data.colorTag));
    }

    if (data.target !== undefined) {
      validationResults.push(PotTarget.create(data.target));
    }

    // Check all validations
    const combinedResult = Result.combine(validationResults);
    if (combinedResult.isFailure) {
      throw new DomainValidationError(combinedResult.error);
    }

    // Business rule: Unique pot name
    if (data.name) {
      const existingPot = await potRepository.getOneByName(userId, data.name);
      if (existingPot && existingPot.id !== potId) {
        throw new DomainValidationError("Pot name already exists");
      }
    }

    // Business rule: Unique color per pot
    if (data.colorTag) {
      const existingColorPot = await potRepository.getOneByColor(
        userId,
        data.colorTag
      );
      if (existingColorPot && existingColorPot.id !== potId) {
        throw new DomainValidationError("Pot color already in use");
      }
    }

    // Domain validation passed, delegate to repository
    return potRepository.updateOne(userId, potId, data);
  };

  return withAuth(useCase);
};
