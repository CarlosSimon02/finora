import { PaginationMeta } from "@/core/schemas";

export const computePaginationMeta = ({
  totalItems,
  page,
  perPage,
  baseUrl,
}: {
  totalItems: number;
  page: number;
  perPage: number;
  baseUrl?: string;
}): PaginationMeta & { links?: Record<string, string | null> } => {
  const totalPages = perPage > 0 ? Math.ceil(totalItems / perPage) : 0;
  const nextPage = page < totalPages ? page + 1 : null;
  const previousPage = page > 1 && page <= totalPages + 1 ? page - 1 : null;
  const hasNextPage = nextPage !== null;
  const hasPrevPage = previousPage !== null;

  const result: PaginationMeta & { links?: Record<string, string | null> } = {
    totalItems,
    page,
    perPage,
    totalPages,
    nextPage,
    previousPage,
    hasNextPage,
    hasPrevPage,
  };

  if (baseUrl) {
    const makeLink = (p: number | null) =>
      p
        ? `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}page=${p}&perPage=${perPage}`
        : null;

    result.links = {
      first: makeLink(totalPages > 0 ? 1 : null),
      prev: makeLink(previousPage),
      self: makeLink(page),
      next: makeLink(nextPage),
      last: makeLink(totalPages > 0 ? totalPages : null),
    };
  }

  return result;
};
