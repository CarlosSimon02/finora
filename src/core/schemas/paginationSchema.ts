import { z, ZodType } from "zod";
import { trimmedStringSchema } from "./helpers";

export const MAX_PER_PAGE = 100;

export const filterOperator = z.enum(["==", ">", ">=", "<", "<=", "!="]);
export type FilterOperator = z.infer<typeof filterOperator>;

export const sortOrder = z.enum(["asc", "desc"]);
export type SortOrder = z.infer<typeof sortOrder>;

export const filterValue = z.union([
  z.null(),
  trimmedStringSchema,
  z.number(),
  z.boolean(),
  z.undefined(),
]);
export type FilterValue = z.infer<typeof filterValue>;

export const filterSchema = z.object({
  field: trimmedStringSchema,
  operator: filterOperator,
  value: filterValue,
});
export type Filter = z.infer<typeof filterSchema>;

const paginationConfigSchema = z.object({
  page: z.number().int().min(1).default(1),
  perPage: z.number().int().min(1).max(MAX_PER_PAGE).default(10),
  offset: z.number().int().min(0).optional(),
});

const sortConfigSchema = z.object({
  field: trimmedStringSchema,
  order: sortOrder.default("asc"),
});

export const paginationParamsSchema = z.object({
  pagination: paginationConfigSchema
    .optional()
    .default({ page: 1, perPage: 10 }),
  sort: sortConfigSchema.optional(),
  filters: z.array(filterSchema).optional().default([]),
  search: trimmedStringSchema.optional(),
});
export type PaginationParams = z.infer<typeof paginationParamsSchema>;

export const paginationMetaSchema = z.object({
  totalItems: z.number().int().nonnegative(),
  page: z.number().int().min(1),
  perPage: z.number().int().min(1),
  totalPages: z.number().int().min(0),
  nextPage: z.number().int().min(1).nullable(),
  previousPage: z.number().int().min(1).nullable(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;

const paginationLinksSchema = z.object({
  first: trimmedStringSchema.optional(),
  prev: trimmedStringSchema.nullable().optional(),
  self: trimmedStringSchema.optional(),
  next: trimmedStringSchema.nullable().optional(),
  last: trimmedStringSchema.optional(),
});

const responseMetaSchema = z.object({
  pagination: paginationMetaSchema,
  sort: sortConfigSchema.partial().optional(),
  filters: z.array(filterSchema).optional(),
  search: trimmedStringSchema.optional(),
  links: paginationLinksSchema.optional(),
});

export const paginationResponseBaseSchema = z.object({
  data: z.array(z.unknown()),
  meta: responseMetaSchema,
});

export const createPaginationResponseSchema = <T extends ZodType>(
  dataSchema: T
) => {
  return paginationResponseBaseSchema.extend({
    data: z.array(dataSchema),
  });
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: z.infer<typeof responseMetaSchema>;
};

export type PaginatedResponseInferred<T extends ZodType> = z.infer<
  ReturnType<typeof createPaginationResponseSchema<T>>
>;
