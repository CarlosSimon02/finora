import { IRecurringBillRepository } from "@/core/interfaces/IRecurringBillRepository";
import {
  RecurringBillDto,
  UpdateRecurringBillDto,
  updateRecurringBillSchema,
} from "@/core/schemas";
import { AuthError } from "@/utils";

export const updateRecurringBill =
  (recurringBillRepository: IRecurringBillRepository) =>
  async (
    userId: string,
    billId: string,
    input: UpdateRecurringBillDto
  ): Promise<RecurringBillDto> => {
    if (!userId) throw new AuthError();
    const validated = updateRecurringBillSchema.parse(input);
    return recurringBillRepository.updateOne(userId, billId, validated);
  };
