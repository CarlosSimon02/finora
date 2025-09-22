import { IRecurringBillRepository } from "@/core/interfaces/IRecurringBillRepository";
import {
  CreateRecurringBillPaymentDto,
  RecurringBillDto,
  RecurringBillPaymentDto,
  createRecurringBillPaymentSchema,
} from "@/core/schemas";
import { AuthError, NotFoundError } from "@/utils/errors";

type PayRecurringBillResult = {
  bill: RecurringBillDto;
  payment: RecurringBillPaymentDto;
  transactionId: string;
};

export const payRecurringBill =
  (recurringBillRepository: IRecurringBillRepository) =>
  async (
    userId: string,
    billId: string,
    input: CreateRecurringBillPaymentDto
  ): Promise<PayRecurringBillResult> => {
    if (!userId) throw new AuthError();

    const bill = await recurringBillRepository.getOneById(userId, billId);
    if (!bill) throw new NotFoundError("Recurring bill not found");

    const validated = createRecurringBillPaymentSchema.parse(input);

    const { transactionId, payment } =
      await recurringBillRepository.createTransactionFromBill(
        userId,
        billId,
        validated
      );

    return { bill, payment, transactionId };
  };
