import {
  PaginatedRecurringBillsResponseDto,
  recurringBillPaymentSchema,
  recurringBillSchema,
} from "@/core/schemas";
import { z } from "zod";
import { zFieldValue, zTimestamp } from "./helpers";

// Recurring Bill
export const recurringBillModelSchema = recurringBillSchema
  .omit({ createdAt: true, updatedAt: true })
  .extend({
    createdAt: zTimestamp,
    updatedAt: zTimestamp,
    dtstart: zTimestamp,
    until: zTimestamp.optional(),
  });

export const createRecurringBillModelSchema = recurringBillModelSchema
  .omit({ createdAt: true, updatedAt: true, category: true, id: true })
  .extend({
    createdAt: zFieldValue,
    updatedAt: zFieldValue,
    id: z.string().min(1),
    dtstart: zTimestamp,
    until: zTimestamp.optional(),
  });

export const updateRecurringBillModelSchema = recurringBillModelSchema
  .omit({ createdAt: true, updatedAt: true, category: true })
  .extend({
    updatedAt: zFieldValue,
    createdAt: zFieldValue,
  })
  .partial();

export const recurringBillModelPaginationResponseSchema = z.object({
  data: z.array(recurringBillModelSchema),
  meta: z
    .custom<PaginatedRecurringBillsResponseDto["meta"]>()
    .transform((val) => val as PaginatedRecurringBillsResponseDto["meta"]),
});

export type RecurringBillModel = z.infer<typeof recurringBillModelSchema>;
export type CreateRecurringBillModel = z.infer<
  typeof createRecurringBillModelSchema
>;
export type UpdateRecurringBillModel = z.infer<
  typeof updateRecurringBillModelSchema
>;
export type RecurringBillModelPaginationResponse = z.infer<
  typeof recurringBillModelPaginationResponseSchema
>;

// Payment History
export const recurringBillPaymentModelSchema = recurringBillPaymentSchema
  .omit({ createdAt: true, updatedAt: true })
  .extend({
    createdAt: zTimestamp,
    updatedAt: zTimestamp,
    occurrenceDate: zTimestamp,
  });

export const createRecurringBillPaymentModelSchema =
  recurringBillPaymentModelSchema
    .omit({ createdAt: true, updatedAt: true, id: true })
    .extend({
      createdAt: zFieldValue,
      updatedAt: zFieldValue,
      id: z.string().min(1),
      occurrenceDate: zTimestamp,
    });

export type RecurringBillPaymentModel = z.infer<
  typeof recurringBillPaymentModelSchema
>;
export type CreateRecurringBillPaymentModel = z.infer<
  typeof createRecurringBillPaymentModelSchema
>;
