import { IRecurringBillRepository } from "@/core/interfaces/IRecurringBillRepository";
import { AuthError } from "@/utils";

export const deleteRecurringBill =
  (recurringBillRepository: IRecurringBillRepository) =>
  async (userId: string, billId: string): Promise<void> => {
    if (!userId) throw new AuthError();
    await recurringBillRepository.deleteOne(userId, billId);
  };
