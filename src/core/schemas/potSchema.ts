import {
  COMMON_MAX_NUMBER,
  POT_MONEY_OPERATION_MIN,
  POT_SUMMARY_MAX_ITEMS,
  POT_TARGET_MIN,
} from "@/core/constants";
import { z } from "zod";
import {
  baseCreateSchema,
  baseEntitySchema,
  nonNegativeMoneyAmountSchema,
  validateTwoDecimalPlaces,
} from "./helpers";
import { createPaginationResponseSchema } from "./paginationSchema";

const targetSchema = z
  .number()
  .min(POT_TARGET_MIN, `Target must be at least ${POT_TARGET_MIN}`)
  .max(COMMON_MAX_NUMBER, `Target must be at most ${COMMON_MAX_NUMBER}`)
  .refine(
    validateTwoDecimalPlaces,
    "Target must have at most 2 decimal places"
  );

export const createPotSchema = baseCreateSchema.extend({
  target: targetSchema,
});

export const updatePotSchema = createPotSchema.partial();

export const potSchema = baseCreateSchema.extend({
  ...baseEntitySchema.shape,
  target: targetSchema,
  totalSaved: nonNegativeMoneyAmountSchema,
});

export const paginatedPotsResponseSchema =
  createPaginationResponseSchema(potSchema);

export const moneyOperationSchema = z.object({
  amount: z
    .number()
    .min(
      POT_MONEY_OPERATION_MIN,
      `Amount must be at least ${POT_MONEY_OPERATION_MIN}`
    )
    .max(COMMON_MAX_NUMBER, `Amount must be at most ${COMMON_MAX_NUMBER}`)
    .refine(
      validateTwoDecimalPlaces,
      "Amount must have at most 2 decimal places"
    ),
});

export const potsSummarySchema = z.object({
  totalSaved: z.number().int().nonnegative(),
  count: z.number().int().nonnegative(),
  pots: z.array(potSchema),
});

export const potsSummaryParamsSchema = z
  .object({
    maxPotsToShow: z
      .number()
      .int()
      .min(1, "Max pots to show must be greater than 0")
      .max(
        POT_SUMMARY_MAX_ITEMS,
        `Max pots to show must be at most ${POT_SUMMARY_MAX_ITEMS}`
      )
      .optional(),
  })
  .default({});

export type CreatePotDto = z.infer<typeof createPotSchema>;
export type UpdatePotDto = z.infer<typeof updatePotSchema>;
export type PotDto = z.infer<typeof potSchema>;
export type PaginatedPotsResponseDto = z.infer<
  typeof paginatedPotsResponseSchema
>;
export type MoneyOperationInput = z.infer<typeof moneyOperationSchema>;
export type PotsSummaryDto = z.infer<typeof potsSummarySchema>;
