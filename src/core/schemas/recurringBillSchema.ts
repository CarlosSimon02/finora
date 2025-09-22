import {
  TRANSACTION_AMOUNT_DECIMALS_REGEX,
  TRANSACTION_NAME_MAX_LENGTH,
} from "@/core/constants";
import { Frequency, RRule } from "rrule";
import { z } from "zod";
import { isValidEmoji } from "./helpers";
import {
  createPaginationResponseSchema,
  paginationParamsSchema,
} from "./paginationSchema";
import { transactionCategorySchema } from "./transactionSchema";

const rruleStringSchema = z
  .string()
  .min(1, "Recurrence rule is required")
  .refine((value) => {
    try {
      const rule = RRule.fromString(value);
      const allowed = [
        Frequency.DAILY,
        Frequency.WEEKLY,
        Frequency.MONTHLY,
        Frequency.YEARLY,
      ];
      return allowed.includes(rule.options.freq!);
    } catch {
      return false;
    }
  }, "RRULE must be valid and have frequency DAILY, WEEKLY, MONTHLY, or YEARLY");

const baseRecurringBillShape = z.object({
  name: z
    .string()
    .min(1, "Bill name is required")
    .max(
      TRANSACTION_NAME_MAX_LENGTH,
      `Bill name must be at most ${TRANSACTION_NAME_MAX_LENGTH} characters`
    ),
  amount: z
    .number()
    .positive("Amount must be greater than 0")
    .refine(
      (val) => TRANSACTION_AMOUNT_DECIMALS_REGEX.test(val.toString()),
      "Amount must have at most 2 decimal places"
    ),
  recipientOrPayer: z.string().nullable(),
  description: z.string().nullable(),
  emoji: z.string().refine(isValidEmoji, {
    message: "Only emoji characters are allowed",
  }),
  categoryId: z.string().min(1, "Category ID is required"),
  rrule: rruleStringSchema,
  dtstart: z.instanceof(Date, { message: "Start date must be a valid date" }),
  until: z.instanceof(Date).optional(),
});

const baseRecurringBillSchema = baseRecurringBillShape.superRefine(
  (data, ctx) => {
    if (data.until && data.until <= data.dtstart) {
      ctx.addIssue({
        code: "custom",
        message: "Until must be after start date",
        path: ["until"],
      });
    }
  }
);

export const createRecurringBillSchema = baseRecurringBillSchema;
export const updateRecurringBillSchema = baseRecurringBillSchema.partial();

export const recurringBillSchema = baseRecurringBillSchema.extend({
  id: z.string().min(1, "Recurring bill ID is required"),
  createdAt: z.instanceof(Date),
  updatedAt: z.instanceof(Date),
  category: transactionCategorySchema,
});

export const paginatedRecurringBillsResponseSchema =
  createPaginationResponseSchema(recurringBillSchema);

export const recurringBillsOffsetSchema = z.object({
  start: z.instanceof(Date).optional(),
  end: z.instanceof(Date).optional(),
});

export const dueSoonParamsSchema = recurringBillsOffsetSchema.extend({
  daysBeforeDue: z.number().int().min(1).max(31).default(2),
});

export const recurringBillsSummarySchema = z.object({
  paid: z.object({
    count: z.number().int().nonnegative(),
    amount: z.number().nonnegative(),
  }),
  upcoming: z.object({
    count: z.number().int().nonnegative(),
    amount: z.number().nonnegative(),
  }),
  dueSoon: z.object({
    count: z.number().int().nonnegative(),
    amount: z.number().nonnegative(),
  }),
});

export const recurringBillsWithTotalsSchema = z.object({
  count: z.number().int().nonnegative(),
  amount: z.number().nonnegative(),
  list: paginatedRecurringBillsResponseSchema,
});

export const createRecurringBillPaymentSchema = z.object({
  billId: z.string().min(1, "Recurring bill ID is required"),
  occurrenceDate: z.instanceof(Date, {
    message: "Occurrence date must be a valid date",
  }),
  amountPaid: z
    .number()
    .positive("Amount must be greater than 0")
    .refine(
      (val) => TRANSACTION_AMOUNT_DECIMALS_REGEX.test(val.toString()),
      "Amount must have at most 2 decimal places"
    ),
  note: z.string().nullable().optional(),
});

export const recurringBillPaymentSchema =
  createRecurringBillPaymentSchema.extend({
    id: z.string().min(1, "Payment ID is required"),
    createdAt: z.instanceof(Date),
    updatedAt: z.instanceof(Date),
    transactionId: z.string().nullable().optional(),
  });

export const paginatedParamsWithSearchSchema = paginationParamsSchema;

export type CreateRecurringBillPaymentDto = z.infer<
  typeof createRecurringBillPaymentSchema
>;
export type RecurringBillPaymentDto = z.infer<
  typeof recurringBillPaymentSchema
>;
export type CreateRecurringBillDto = z.infer<typeof createRecurringBillSchema>;
export type UpdateRecurringBillDto = z.infer<typeof updateRecurringBillSchema>;
export type RecurringBillDto = z.infer<typeof recurringBillSchema>;
export type PaginatedRecurringBillsResponseDto = z.infer<
  typeof paginatedRecurringBillsResponseSchema
>;
export type RecurringBillsOffsetDto = z.infer<
  typeof recurringBillsOffsetSchema
>;
export type DueSoonParamsDto = z.infer<typeof dueSoonParamsSchema>;
export type RecurringBillsSummaryDto = z.infer<
  typeof recurringBillsSummarySchema
>;
export type RecurringBillsWithTotalsDto = z.infer<
  typeof recurringBillsWithTotalsSchema
>;
