import { z } from "zod";
import { baseEntitySchema } from "./helpers";
import { createPaginationResponseSchema } from "./paginationSchema";
import { transactionCategorySchema } from "./transactionSchema";

export const categorySchema = transactionCategorySchema.merge(baseEntitySchema);

export const paginatedCategoriesResponseSchema =
  createPaginationResponseSchema(categorySchema);

export type PaginatedCategoriesResponseDto = z.infer<
  typeof paginatedCategoriesResponseSchema
>;
export type CategoryDto = z.infer<typeof categorySchema>;
