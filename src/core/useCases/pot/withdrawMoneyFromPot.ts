import { POT_MONEY_OPERATION_MIN } from "@/core/constants";
import { IPotRepository } from "@/core/interfaces/IPotRepository";
import { MoneyOperationInput, PotDto } from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { PotId } from "@/core/valueObjects/pot";
import { Money } from "@/core/valueObjects/shared";
import { DomainValidationError, NotFoundError } from "@/utils";

export const withdrawMoneyFromPot = (potRepository: IPotRepository) => {
  const useCase = async (
    userId: string,
    input: { potId: string; data: MoneyOperationInput }
  ): Promise<PotDto> => {
    const { potId, data } = input;

    // Validate pot ID using domain value object
    const potIdOrError = PotId.create(potId);
    if (potIdOrError.isFailure) {
      throw new DomainValidationError(potIdOrError.error);
    }

    // Validate amount using Money value object
    const moneyOrError = Money.create(data.amount);
    if (moneyOrError.isFailure) {
      throw new DomainValidationError(moneyOrError.error);
    }

    // Business rule: Minimum operation amount
    if (data.amount < POT_MONEY_OPERATION_MIN) {
      throw new DomainValidationError(
        `Amount must be at least ${POT_MONEY_OPERATION_MIN}`
      );
    }

    // Fetch pot to check business rules
    const pot = await potRepository.getOneById(userId, potId);
    if (!pot) {
      throw new NotFoundError("Pot not found");
    }

    // Business rule: Cannot withdraw more than available
    if (pot.totalSaved < data.amount) {
      throw new DomainValidationError("Insufficient funds in pot");
    }

    // Domain validation passed, delegate to repository
    return potRepository.withdrawMoney(userId, potId, data.amount);
  };

  return withAuth(useCase);
};
