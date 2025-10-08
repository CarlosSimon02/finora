import { z, ZodTypeAny } from "zod";
import { trimmedStringSchema } from "./helpers";

export const MAX_PER_PAGE = 100;

export const filterOperator = z.enum(["==", ">", ">=", "<", "<=", "!="]);

export const sortOrder = z.enum(["asc", "desc"]);

export const filterValue = z.union([
  z.null(),
  trimmedStringSchema,
  z.number(),
  z.boolean(),
  z.undefined(),
]);

export const filterSchema = z.object({
  field: trimmedStringSchema,
  operator: filterOperator,
  value: filterValue,
});

export const paginationParamsSchema = z.object({
  pagination: z
    .object({
      page: z.number().int().min(1).default(1),
      perPage: z.number().int().min(1).max(MAX_PER_PAGE).default(10),
      offset: z.number().int().min(0).optional(),
    })
    .optional()
    .default({ page: 1, perPage: 10 }),
  sort: z
    .object({
      field: trimmedStringSchema,
      order: sortOrder.default("asc"),
    })
    .optional(),

  filters: z.array(filterSchema).optional().default([]),
  search: trimmedStringSchema.optional(),
});

export type PaginationParams = z.infer<typeof paginationParamsSchema>;

export const paginationMetaSchema = z.object({
  totalItems: z.number().int().nonnegative(), // allow 0
  page: z.number().int().min(1),
  perPage: z.number().int().min(1),
  totalPages: z.number().int().min(0),
  nextPage: z.number().int().min(1).nullable(),
  previousPage: z.number().int().min(1).nullable(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});

export const paginationResponseBaseSchema = z.object({
  data: z.array(z.unknown()),
  meta: z.object({
    pagination: paginationMetaSchema,
    sort: z
      .object({
        field: trimmedStringSchema.optional(),
        order: sortOrder.optional(),
      })
      .optional(),
    filters: z.array(filterSchema).optional(),
    search: trimmedStringSchema.optional(),
    links: z
      .object({
        first: trimmedStringSchema.optional(),
        prev: trimmedStringSchema.nullable().optional(),
        self: trimmedStringSchema.optional(),
        next: trimmedStringSchema.nullable().optional(),
        last: trimmedStringSchema.optional(),
      })
      .optional(),
  }),
});

export const createPaginationResponseSchema = <T extends ZodTypeAny>(
  dataSchema: T
) => {
  return paginationResponseBaseSchema.extend({
    data: z.array(dataSchema),
  });
};

export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export type PaginatedResponse<T extends ZodTypeAny> = z.infer<
  ReturnType<typeof createPaginationResponseSchema<T>>
>;
export type SortOrder = z.infer<typeof sortOrder>;
