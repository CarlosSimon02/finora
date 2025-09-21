import {
  createPaginationResponseSchema,
  incomeSchemaWithTotalEarned,
} from "@/core/schemas";
import { z } from "zod";
import {
  buildCreateModelSchema,
  buildModelSchema,
  buildUpdateModelSchema,
} from "./builders";

export const incomeModelSchema = buildModelSchema(incomeSchemaWithTotalEarned, [
  "createdAt",
  "updatedAt",
]);

export const createIncomeModelSchema = buildCreateModelSchema(
  incomeModelSchema,
  ["createdAt", "updatedAt"]
);

export const updateIncomeModelSchema = buildUpdateModelSchema(
  incomeModelSchema,
  {
    immutableFields: ["totalEarned"],
    serverTimestampFields: ["createdAt", "updatedAt"],
  }
);

export const incomeModelPaginationResponseSchema =
  createPaginationResponseSchema(incomeModelSchema);

export type IncomeModel = z.infer<typeof incomeModelSchema>;

export type IncomeModelPaginationResponse = z.infer<
  typeof incomeModelPaginationResponseSchema
>;

export type CreateIncomeModel = z.infer<typeof createIncomeModelSchema>;
export type UpdateIncomeModel = z.infer<typeof updateIncomeModelSchema>;
