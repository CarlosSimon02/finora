import { createPaginationResponseSchema } from "@/core/schemas";
import { z } from "zod";

export async function paginateByCursor<T extends z.ZodTypeAny>({
  baseQuery,
  perPage,
  page,
  dataSchema,
}: {
  baseQuery: FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;
  perPage: number;
  page: number;
  dataSchema: T;
}): Promise<z.infer<ReturnType<typeof createPaginationResponseSchema<T>>>> {
  // Get total items via aggregation
  const totalItems = (await baseQuery.count().get()).data().count;
  let q = baseQuery.limit(perPage);
  if (page > 1) {
    const prev = await baseQuery.limit((page - 1) * perPage).get();
    const last = prev.docs[prev.docs.length - 1];
    if (last) q = q.startAfter(last);
  }
  const snap = await q.get();
  const data = snap.docs.map((d) =>
    dataSchema.parse({ id: d.id, ...d.data() })
  );
  const totalPages = Math.ceil(totalItems / perPage);
  return {
    data,
    meta: {
      pagination: {
        totalItems,
        page,
        perPage,
        totalPages,
        nextPage: snap.size === perPage ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null,
        hasNextPage: snap.size === perPage,
        hasPrevPage: page > 1,
      },
      sort: undefined,
      filters: undefined,
      search: undefined,
    },
  };
}
