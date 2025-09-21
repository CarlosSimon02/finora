import {
  budgetSchemaWithTotalSpending,
  createPaginationResponseSchema,
} from "@/core/schemas";
import { z } from "zod";
import {
  buildCreateModelSchema,
  buildModelSchema,
  buildUpdateModelSchema,
} from "./builders";

export const budgetModelSchema = buildModelSchema(
  budgetSchemaWithTotalSpending,
  ["createdAt", "updatedAt"]
);

export const createBudgetModelSchema = buildCreateModelSchema(
  budgetModelSchema,
  ["createdAt", "updatedAt"]
);

export const updateBudgetModelSchema = buildUpdateModelSchema(
  budgetModelSchema,
  {
    immutableFields: ["totalSpending"],
    serverTimestampFields: ["createdAt", "updatedAt"],
  }
);

export const budgetModelPaginationResponseSchema =
  createPaginationResponseSchema(budgetModelSchema);

export type BudgetModel = z.infer<typeof budgetModelSchema>;

export type BudgetModelPaginationResponse = z.infer<
  typeof budgetModelPaginationResponseSchema
>;

export type CreateBudgetModel = z.infer<typeof createBudgetModelSchema>;
export type UpdateBudgetModel = z.infer<typeof updateBudgetModelSchema>;
