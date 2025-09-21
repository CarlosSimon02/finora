import { IPotRepository } from "@/core/interfaces/IPotRepository";
import {
  MoneyOperationInput,
  moneyOperationSchema,
  PotDto,
} from "@/core/schemas/potSchema";
import { AuthError, DomainValidationError, NotFoundError } from "@/utils";

export const addMoneyToPot =
  (potRepository: IPotRepository) =>
  async (
    userId: string,
    potId: string,
    input: MoneyOperationInput
  ): Promise<PotDto> => {
    if (!userId) throw new AuthError();
    if (!potId) throw new DomainValidationError("Pot ID is required");

    const validatedData = moneyOperationSchema.parse(input);

    const pot = await potRepository.getOneById(userId, potId);
    if (!pot) {
      throw new NotFoundError("Pot not found");
    }

    return potRepository.addToTotalSaved(userId, potId, validatedData.amount);
  };
