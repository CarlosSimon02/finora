import {
  POT_MONEY_OPERATION_MIN,
  POT_NAME_MAX_LENGTH,
  POT_TARGET_MIN,
} from "@/core/constants";
import { z } from "zod";
import { trimmedStringSchema, validateOptionalHexColor } from "./helpers";
import { createPaginationResponseSchema } from "./paginationSchema";

export const createPotSchema = z.object({
  name: trimmedStringSchema
    .min(1, "Pot name is required")
    .max(
      POT_NAME_MAX_LENGTH,
      `Pot name must be at most ${POT_NAME_MAX_LENGTH} characters`
    ),
  colorTag: trimmedStringSchema.refine(validateOptionalHexColor, {
    message: "Color tag must be a valid hex color code (e.g., #FF5733)",
  }),
  target: z
    .number()
    .min(POT_TARGET_MIN, `Target must be at least ${POT_TARGET_MIN}`),
});

export const updatePotSchema = createPotSchema.partial();

export const potSchema = createPotSchema.extend({
  id: trimmedStringSchema.min(1, "Pot ID is required"),
  totalSaved: z.number().min(0, "Total saved cannot be negative"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const paginatedPotsResponseSchema =
  createPaginationResponseSchema(potSchema);

export const moneyOperationSchema = z.object({
  amount: z
    .number()
    .min(
      POT_MONEY_OPERATION_MIN,
      `Amount must be at least ${POT_MONEY_OPERATION_MIN}`
    ),
});

export type CreatePotDto = z.infer<typeof createPotSchema>;
export type UpdatePotDto = z.infer<typeof updatePotSchema>;
export type PotDto = z.infer<typeof potSchema>;
export type PaginatedPotsResponseDto = z.infer<
  typeof paginatedPotsResponseSchema
>;
export type MoneyOperationInput = z.infer<typeof moneyOperationSchema>;
