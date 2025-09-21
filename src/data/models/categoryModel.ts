import { categorySchema, createPaginationResponseSchema } from "@/core/schemas";
import { z } from "zod";
import {
  buildCreateModelSchema,
  buildModelSchema,
  buildUpdateModelSchema,
} from "./builders";

export const categoryModelSchema = buildModelSchema(categorySchema, [
  "createdAt",
  "updatedAt",
]);

export const createCategoryModelSchema = buildCreateModelSchema(
  categoryModelSchema,
  ["createdAt", "updatedAt"]
);

export const updateCategoryModelSchema = buildUpdateModelSchema(
  categoryModelSchema,
  {
    serverTimestampFields: ["createdAt", "updatedAt"],
  }
);

export const categoryModelPaginationResponseSchema =
  createPaginationResponseSchema(categoryModelSchema);

export type CategoryModelPaginationResponse = z.infer<
  typeof categoryModelPaginationResponseSchema
>;
export type CategoryModel = z.infer<typeof categoryModelSchema>;
export type CreateCategoryModel = z.infer<typeof createCategoryModelSchema>;
export type UpdateCategoryModel = z.infer<typeof updateCategoryModelSchema>;
