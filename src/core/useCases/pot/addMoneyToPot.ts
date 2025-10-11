import { COMMON_MAX_NUMBER } from "@/core/constants";
import { IPotRepository } from "@/core/interfaces/IPotRepository";
import {
  MoneyOperationInput,
  moneyOperationSchema,
  PotDto,
} from "@/core/schemas";
import { withAuth } from "@/core/useCases/utils";
import { DomainValidationError, NotFoundError } from "@/utils";

export const addMoneyToPot = (potRepository: IPotRepository) => {
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

    if (validatedData.amount + pot.totalSaved > COMMON_MAX_NUMBER) {
      throw new DomainValidationError("Amount exceeds maximum number");
    }

    return potRepository.addToTotalSaved(userId, potId, validatedData.amount);
  };

  return withAuth(useCase);
};
