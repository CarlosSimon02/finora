import { PaginationParams, paginationParamsSchema } from "@/core/schemas";

type ParseSearchParamsOptions = {
  defaultPage?: number;
  defaultPerPage?: number;
  defaultSort?: { field: string; order: "asc" | "desc" };
};

/**
 * Parse and validate search params for server-side components
 * Used in page.tsx server components to extract pagination, sort, search, and filter params
 */
export const parseSearchParams = (
  searchParams: Record<string, string | string[] | undefined>,
  options: ParseSearchParamsOptions = {}
): PaginationParams => {
  const { defaultPage = 1, defaultPerPage = 10, defaultSort } = options;

  const params: Partial<PaginationParams> = {
    pagination: {
      page: defaultPage,
      perPage: defaultPerPage,
    },
    filters: [],
    search: "",
  };

  // Parse page
  const pageParam = searchParams.page;
  if (typeof pageParam === "string") {
    const parsed = parseInt(pageParam, 10);
    if (!isNaN(parsed) && parsed > 0) {
      params.pagination!.page = parsed;
    }
  }

  // Parse perPage
  const perPageParam = searchParams.perPage;
  if (typeof perPageParam === "string") {
    const parsed = parseInt(perPageParam, 10);
    if (!isNaN(parsed) && parsed > 0) {
      params.pagination!.perPage = parsed;
    }
  }

  // Parse sort
  const sortField = searchParams.sortField;
  const sortOrder = searchParams.sortOrder;
  if (typeof sortField === "string") {
    params.sort = {
      field: sortField,
      order: sortOrder === "desc" ? "desc" : "asc",
    };
  } else if (defaultSort) {
    params.sort = defaultSort;
  }

  // Parse search
  const search = searchParams.search;
  if (typeof search === "string" && search.trim()) {
    params.search = search.trim();
  }

  // Parse filters
  const filtersParam = searchParams.filters;
  if (typeof filtersParam === "string") {
    try {
      const parsed = JSON.parse(filtersParam);
      if (Array.isArray(parsed)) {
        params.filters = parsed;
      }
    } catch {
      params.filters = [];
    }
  }

  // Validate with Zod schema
  const result = paginationParamsSchema.safeParse(params);

  if (result.success) {
    return result.data;
  } else {
    console.warn("Invalid search parameters, using defaults:", result.error);
    return paginationParamsSchema.parse({
      pagination: { page: defaultPage, perPage: defaultPerPage },
      filters: [],
      search: "",
      ...(defaultSort && { sort: defaultSort }),
    });
  }
};
