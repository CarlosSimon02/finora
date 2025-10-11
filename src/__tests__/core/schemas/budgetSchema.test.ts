import { budgetsSummaryParamsSchema, createBudgetSchema } from "@/core/schemas";
import { describe, expect, it } from "vitest";

describe("budget schemas", () => {
  it("validates createBudgetSchema happy path", () => {
    const parsed = createBudgetSchema.parse({
      name: "Food",
      maximumSpending: 200,
      colorTag: "#277C78",
    });
    expect(parsed.name).toBe("Food");
  });

  it("rejects invalid colorTag", () => {
    expect(() =>
      createBudgetSchema.parse({
        name: "Food",
        maximumSpending: 100,
        colorTag: "not-a-color",
      })
    ).toThrow();
  });

  it("caps budgetsSummaryParamsSchema bounds", () => {
    expect(() =>
      budgetsSummaryParamsSchema.parse({ maxBudgetsToShow: 0 })
    ).toThrow();
  });
});
