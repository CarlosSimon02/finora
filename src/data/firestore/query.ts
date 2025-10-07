import { PaginationParams } from "@/core/schemas/paginationSchema";

type Query = FirebaseFirestore.Query<FirebaseFirestore.DocumentData>;
type CollectionRef = FirebaseFirestore.CollectionReference<
  FirebaseFirestore.DocumentData,
  FirebaseFirestore.DocumentData
>;

export function buildQueryFromParams(
  collection: CollectionRef,
  params: PaginationParams,
  options?: { searchField?: string }
): Query {
  const searchField = options?.searchField ?? "name";

  let q: Query = collection;

  // Apply text search (prefix match) if provided
  if (params.search && params.search.trim().length > 0) {
    const term = params.search.trim();
    q = q
      .where(searchField, ">=", term)
      .where(searchField, "<=", term + "\uf8ff")
      .orderBy(searchField);
  }

  // Apply filters
  if (params.filters && params.filters.length > 0) {
    for (const filter of params.filters) {
      // Firestore supports ==, >, >=, <, <=, !=
      q = q.where(
        filter.field,
        filter.operator as FirebaseFirestore.WhereFilterOp,
        filter.value as any
      );
    }
  }

  // Apply sort (fallback to createdAt asc if missing)
  const sort = params.sort || { field: "createdAt", order: "asc" as const };
  // If search already ordered by the same field, avoid duplicate orderBy
  if (!params.search) {
    q = q.orderBy(sort.field, sort.order);
  } else if (sort.field !== searchField) {
    q = q.orderBy(sort.field, sort.order);
  }

  return q;
}
