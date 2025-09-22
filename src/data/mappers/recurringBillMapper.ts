import { RecurringBillDto, RecurringBillPaymentDto } from "@/core/schemas";
import { RecurringBillModel, RecurringBillPaymentModel } from "@/data/models";

export const mapRecurringBillModelToDto = (
  model: RecurringBillModel
): RecurringBillDto => ({
  id: model.id,
  name: model.name,
  amount: model.amount,
  recipientOrPayer: model.recipientOrPayer,
  description: model.description,
  emoji: model.emoji,
  categoryId: model.categoryId,
  rrule: model.rrule,
  dtstart: model.dtstart.toDate(),
  until: model.until ? model.until.toDate() : undefined,
  category: model.category,
  createdAt: model.createdAt.toDate(),
  updatedAt: model.updatedAt.toDate(),
});

export const mapRecurringBillPaymentModelToDto = (
  model: RecurringBillPaymentModel
): RecurringBillPaymentDto => ({
  id: model.id,
  billId: model.billId,
  occurrenceDate: model.occurrenceDate.toDate(),
  amountPaid: model.amountPaid,
  note: model.note ?? null,
  transactionId: model.transactionId ?? null,
  createdAt: model.createdAt.toDate(),
  updatedAt: model.updatedAt.toDate(),
});
