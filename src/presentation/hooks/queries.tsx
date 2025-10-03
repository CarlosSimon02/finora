// hooks/usePagination.ts
import { PaginationParams, paginationParamsSchema } from "@/core/schemas";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";

type UsePaginationOptions = {
  defaultPage?: number;
  defaultPerPage?: number;
  includeParams?: (keyof PaginationParams)[];
};

export const usePagination = (options: UsePaginationOptions = {}) => {
  const {
    defaultPage = 1,
    defaultPerPage = 10,
    includeParams = ["pagination"],
  } = options;

  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse and validate URL parameters
  const validatedParams = useMemo(() => {
    const params: Record<string, any> = {};

    // Always include pagination
    if (includeParams.includes("pagination")) {
      const page = searchParams.get("page");
      const perPage = searchParams.get("perPage");

      params.pagination = {
        page: page ? parseInt(page, 10) : defaultPage,
        perPage: perPage ? parseInt(perPage, 10) : defaultPerPage,
      };
    }

    // Include sort if requested
    if (includeParams.includes("sort")) {
      const sortField = searchParams.get("sortField");
      const sortOrder = searchParams.get("sortOrder");

      if (sortField) {
        params.sort = {
          field: sortField,
          order: sortOrder === "desc" ? "desc" : "asc",
        };
      }
    }

    // Include search if requested
    if (includeParams.includes("search")) {
      const search = searchParams.get("search");
      if (search) {
        params.search = search;
      }
    }

    // Include filters if requested (you'd need to implement filter parsing based on your needs)
    if (includeParams.includes("filters")) {
      // This is a simplified example - you'd need to implement based on your filter structure
      const filtersParam = searchParams.get("filters");
      if (filtersParam) {
        try {
          params.filters = JSON.parse(filtersParam);
        } catch {
          params.filters = [];
        }
      }
    }

    // Validate with Zod schema
    const result = paginationParamsSchema.safeParse(params);

    if (result.success) {
      return result.data;
    } else {
      console.warn("Invalid URL parameters, using defaults:", result.error);
      return paginationParamsSchema.parse({});
    }
  }, [searchParams, defaultPage, defaultPerPage, includeParams]);

  // Get current page from validated params
  const page = validatedParams.pagination.page;

  // Update URL with new parameters
  const setPaginationParams = useCallback(
    (updates: Partial<PaginationParams>) => {
      const params = new URLSearchParams(searchParams);

      // Merge current validated params with updates
      const newParams = {
        ...validatedParams,
        ...updates,
        pagination: {
          ...validatedParams.pagination,
          ...(updates.pagination || {}),
        },
      };

      // Handle page parameter - remove if it's 1, set otherwise
      if (newParams.pagination.page === 1) {
        params.delete("page");
      } else {
        params.set("page", newParams.pagination.page.toString());
      }

      // Handle perPage parameter - remove if it's default, set otherwise
      if (newParams.pagination.perPage === defaultPerPage) {
        params.delete("perPage");
      } else {
        params.set("perPage", newParams.pagination.perPage.toString());
      }

      // Handle sort parameters
      if (newParams.sort) {
        params.set("sortField", newParams.sort.field);
        params.set("sortOrder", newParams.sort.order);
      } else {
        params.delete("sortField");
        params.delete("sortOrder");
      }

      // Handle search parameter
      if (newParams.search) {
        params.set("search", newParams.search);
      } else {
        params.delete("search");
      }

      // Handle filters parameter (simplified)
      if (newParams.filters && newParams.filters.length > 0) {
        params.set("filters", JSON.stringify(newParams.filters));
      } else {
        params.delete("filters");
      }

      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams, validatedParams, defaultPerPage]
  );

  // Convenience function for just setting page
  const setPage = useCallback(
    (newPage: number) => {
      setPaginationParams({
        pagination: { ...validatedParams.pagination, page: newPage },
      });
    },
    [setPaginationParams, validatedParams.pagination]
  );

  // Convenience function for just setting perPage
  const setPerPage = useCallback(
    (newPerPage: number) => {
      setPaginationParams({
        pagination: { ...validatedParams.pagination, perPage: newPerPage },
      });
    },
    [setPaginationParams, validatedParams.pagination]
  );

  // Sync URL if page is invalid (fallback)
  useEffect(() => {
    const currentPageParam = searchParams.get("page");
    if (currentPageParam) {
      const parsed = parseInt(currentPageParam, 10);
      if (isNaN(parsed) || parsed < 1) {
        // Remove invalid page parameter
        const params = new URLSearchParams(searchParams);
        params.delete("page");
        router.replace(`?${params.toString()}`, { scroll: false });
      }
    }
  }, [searchParams, router]);

  return {
    // Current state
    page,
    perPage: validatedParams.pagination.perPage,
    sort: validatedParams.sort,
    filters: validatedParams.filters,
    search: validatedParams.search,

    // Update functions
    setPage,
    setPerPage,
    setPaginationParams,

    // Full validated params for use in queries
    validatedParams,
  };
};
