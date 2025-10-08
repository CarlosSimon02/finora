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

  // Apply filters first (must come before orderBy)
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

  // Apply text search (prefix match) if provided
  if (params.search && params.search.trim().length > 0) {
    const term = params.search.trim();
    // Firestore prefix search is case-sensitive
    // For case-insensitive search, add a nameLowercase field to documents
    q = q
      .where(searchField, ">=", term)
      .where(searchField, "<=", term + "\uf8ff")
      .orderBy(searchField);

    // Apply additional sort if different from search field
    // This requires a composite index: searchField + sort.field
    const sort = params.sort || { field: "createdAt", order: "asc" as const };
    if (sort.field !== searchField) {
      q = q.orderBy(sort.field, sort.order);
      // Note: This will throw an error if the composite index doesn't exist.
      // Firestore will provide a URL to create the index automatically.
      // Example indexes needed for Transactions:
      // - name (asc) + transactionDate (desc)
      // - name (asc) + transactionDate (asc)
      // - name (asc) + signedAmount (desc)
      // - name (asc) + signedAmount (asc)
    }

    return q;
  }

  // Apply sort (fallback to createdAt asc if missing) - when NOT searching
  const sort = params.sort || { field: "createdAt", order: "asc" as const };
  q = q.orderBy(sort.field, sort.order);

  return q;
}
