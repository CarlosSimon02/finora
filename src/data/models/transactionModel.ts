import {
  createPaginationResponseSchema,
  transactionCategorySchema,
  transactionSchema,
} from "@/core/schemas";
import { z } from "zod";
import {
  buildCreateModelSchema,
  buildModelSchema,
  buildUpdateModelSchema,
} from "./builders";

export const transactionModelSchema = buildModelSchema(
  transactionSchema,
  ["transactionDate", "createdAt", "updatedAt"],
  {
    signedAmount: z.number(),
  }
);

export const createTransactionModelSchema = buildCreateModelSchema(
  transactionModelSchema,
  ["createdAt", "updatedAt"],
  ["transactionDate"]
);

export const updateTransactionModelSchema = buildUpdateModelSchema(
  transactionModelSchema,
  {
    serverTimestampFields: ["createdAt", "updatedAt"],
  }
);

export const updateTransactionCategoryModelSchema = transactionCategorySchema
  .omit({ id: true })
  .partial();

export const transactionModelPaginationResponseSchema =
  createPaginationResponseSchema(transactionModelSchema);

export type TransactionModel = z.infer<typeof transactionModelSchema>;

export type TransactionModelPaginationResponse = z.infer<
  typeof transactionModelPaginationResponseSchema
>;

export type CreateTransactionModel = z.infer<
  typeof createTransactionModelSchema
>;

export type UpdateTransactionModel = z.infer<
  typeof updateTransactionModelSchema
>;

export type UpdateTransactionCategoryModel = z.infer<
  typeof updateTransactionCategoryModelSchema
>;
