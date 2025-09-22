import { IRecurringBillRepository } from "@/core/interfaces/IRecurringBillRepository";
import { RecurringBillDto } from "@/core/schemas";
import { AuthError } from "@/utils";

export const getRecurringBill =
  (recurringBillRepository: IRecurringBillRepository) =>
  async (userId: string, billId: string): Promise<RecurringBillDto | null> => {
    if (!userId) throw new AuthError();
    return recurringBillRepository.getOneById(userId, billId);
  };
