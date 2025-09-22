import { IRecurringBillRepository } from "@/core/interfaces/IRecurringBillRepository";
import {
  RecurringBillsOffsetDto,
  recurringBillsOffsetSchema,
} from "@/core/schemas";
import { AuthError } from "@/utils";

export const getRecurringBillsTotalAmount =
  (recurringBillRepository: IRecurringBillRepository) =>
  async (userId: string, offset?: RecurringBillsOffsetDto): Promise<number> => {
    if (!userId) throw new AuthError();
    const validated = offset
      ? recurringBillsOffsetSchema.parse(offset)
      : undefined;
    return recurringBillRepository.getTotalAmount(userId, validated);
  };
