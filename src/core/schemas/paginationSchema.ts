import { z, ZodTypeAny } from "zod";

export const MAX_PER_PAGE = 100;

export const filterOperator = z.enum(["==", ">", ">=", "<", "<=", "!="]);

export const filterValue = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);

export const filterSchema = z.object({
  field: z.string(),
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
      field: z.string(),
      order: z.enum(["asc", "desc"]).default("asc"),
    })
    .optional(),

  filters: z.array(filterSchema).optional().default([]),
  search: z.string().optional(),
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
        field: z.string().optional(),
        order: z.enum(["asc", "desc"]).optional(),
      })
      .optional(),
    filters: z.array(filterSchema).optional(),
    search: z.string().optional(),
    links: z
      .object({
        first: z.string().optional(),
        prev: z.string().nullable().optional(),
        self: z.string().optional(),
        next: z.string().nullable().optional(),
        last: z.string().optional(),
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
