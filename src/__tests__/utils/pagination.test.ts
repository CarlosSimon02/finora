import { computePaginationMeta } from "@/utils/pagination";
import { describe, expect, it } from "vitest";

describe("computePaginationMeta", () => {
  it("computes totals and next/prev correctly", () => {
    const meta = computePaginationMeta({
      totalItems: 25,
      page: 2,
      perPage: 10,
    });
    expect(meta.totalPages).toBe(3);
    expect(meta.nextPage).toBe(3);
    expect(meta.previousPage).toBe(1);
    expect(meta.hasNextPage).toBe(true);
    expect(meta.hasPrevPage).toBe(true);
  });

  it("builds links when baseUrl provided", () => {
    const meta = computePaginationMeta({
      totalItems: 20,
      page: 1,
      perPage: 10,
      baseUrl: "/api/items",
    });
    expect(meta.links?.self).toContain("page=1");
    expect(meta.links?.next).toContain("page=2");
  });
});
