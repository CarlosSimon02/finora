import { IPotRepository } from "@/core/interfaces/IPotRepository";
import {
  MoneyOperationInput,
  moneyOperationSchema,
  PotDto,
} from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { DomainValidationError, NotFoundError } from "@/utils";

export const withdrawMoneyFromPot = (potRepository: IPotRepository) => {
  const useCase = async (
    userId: string,
    input: { potId: string; data: MoneyOperationInput }
  ): Promise<PotDto> => {
    const { potId, data } = input;

    if (!potId) throw new DomainValidationError("Pot ID is required");

    const validatedData = moneyOperationSchema.parse(data);

    const pot = await potRepository.getOneById(userId, potId);
    if (!pot) {
      throw new NotFoundError("Pot not found");
    }

    if (pot.totalSaved < validatedData.amount) {
      throw new DomainValidationError("Insufficient funds in pot");
    }

    return potRepository.withdrawMoney(userId, potId, validatedData.amount);
  };

  return withAuth(useCase);
};
