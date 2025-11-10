import { Pot } from "@/core/entities/pot";
import { IPotRepository } from "@/core/interfaces/IPotRepository";
import { MoneyOperationInput, PotDto } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { PotId, PotName, PotTarget } from "@/core/valueObjects/pot";
import { Money } from "@/core/valueObjects/shared";
import { ColorTag } from "@/core/valueObjects/transaction";
import { DomainValidationError, NotFoundError } from "@/utils";

export const addMoneyToPot = (potRepository: IPotRepository) => {
  const useCase = async (
    userId: string,
    input: { potId: string; data: MoneyOperationInput }
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

    // Use entity's addMoney method (contains all business logic)
    const addResult = pot.addMoney(data.amount);
    if (addResult.isFailure) {
      throw new DomainValidationError(addResult.error);
    }

    // Use entity's DTO method
    return potRepository.updateOne(userId, potId, pot.toDto());
  };

  return withAuth(useCase);
};
