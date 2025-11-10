import { Pot } from "@/core/entities/pot";
import { IPotRepository } from "@/core/interfaces/IPotRepository";
import { PotDto, UpdatePotDto } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { PotId, PotName, PotTarget } from "@/core/valueObjects/pot";
import { Money } from "@/core/valueObjects/shared";
import { ColorTag } from "@/core/valueObjects/transaction";
import { DomainValidationError, NotFoundError } from "@/utils";

export const updatePot = (potRepository: IPotRepository) => {
  const useCase = async (
    userId: string,
    input: { potId: string; data: UpdatePotDto }
  ): Promise<PotDto> => {
    const { potId, data } = input;

    // Validate pot ID
    const potIdOrError = PotId.create(potId);
    if (potIdOrError.isFailure) {
      throw new DomainValidationError(potIdOrError.error);
    }

    // Get existing pot
    const existingPotDto = await potRepository.getOneById(userId, potId);
    if (!existingPotDto) {
      throw new NotFoundError("Pot not found");
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

    // Reconstitute domain entity
    const potOrError = Pot.reconstitute({
      id: potIdOrError.value,
      name: PotName.create(existingPotDto.name).value,
      colorTag: ColorTag.create(existingPotDto.colorTag).value,
      target: PotTarget.create(existingPotDto.target).value,
      totalSaved: Money.create(existingPotDto.totalSaved).value,
      createdAt: existingPotDto.createdAt,
      updatedAt: existingPotDto.updatedAt,
    });

    if (potOrError.isFailure) {
      throw new DomainValidationError(potOrError.error);
    }

    const pot = potOrError.value;

    // Use entity's update method (validates internally)
    const updateResult = pot.update({
      name: data.name,
      colorTag: data.colorTag,
      target: data.target,
    });

    if (updateResult.isFailure) {
      throw new DomainValidationError(updateResult.error);
    }

    // Use entity's DTO method
    return potRepository.updateOne(userId, potId, pot.toDto());
  };

  return withAuth(useCase);
};
