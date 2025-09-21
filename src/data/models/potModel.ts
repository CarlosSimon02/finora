import {
  createPaginationResponseSchema,
  moneyOperationSchema,
  potSchema,
} from "@/core/schemas";
import { z } from "zod";
import {
  buildCreateModelSchema,
  buildModelSchema,
  buildUpdateModelSchema,
} from "./builders";

export const potModelSchema = buildModelSchema(potSchema, [
  "createdAt",
  "updatedAt",
]);

export const createPotModelSchema = buildCreateModelSchema(potModelSchema, [
  "createdAt",
  "updatedAt",
]);

export const updatePotModelSchema = buildUpdateModelSchema(potModelSchema, {
  immutableFields: ["totalSaved"],
  serverTimestampFields: ["createdAt", "updatedAt"],
});

export const potModelPaginationResponseSchema =
  createPaginationResponseSchema(potModelSchema);

export type PotModel = z.infer<typeof potModelSchema>;

export type PotModelPaginationResponse = z.infer<
  typeof potModelPaginationResponseSchema
>;

export type CreatePotModel = z.infer<typeof createPotModelSchema>;
export type UpdatePotModel = z.infer<typeof updatePotModelSchema>;

export type MoneyOperationModel = z.infer<typeof moneyOperationSchema>;
