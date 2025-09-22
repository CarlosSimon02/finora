import type { IBudgetRepository } from "@/core/interfaces/IBudgetRepository";
import { BudgetDto } from "@/core/schemas";
import { createBudget } from "@/core/useCases/budget/createBudget";
import { AuthError, ConflictError } from "@/utils/errors";
import { beforeEach, describe, expect, it, vi } from "vitest";

const makeRepo = (): IBudgetRepository => {
  return {
    createOne: vi.fn(),
    getOneById: vi.fn(),
    getOneByName: vi.fn(),
    getPaginated: vi.fn(),
    updateOne: vi.fn(),
    deleteOne: vi.fn(),
    getPaginatedWithTransactions: vi.fn(),
    getSummary: vi.fn(),
  };
};

const validInput = {
  name: "Food",
  maximumSpending: 100,
  colorTag: "#ff0000",
};

describe("createBudget use case", () => {
  let repo: IBudgetRepository;
  let action: ReturnType<typeof createBudget>;

  beforeEach(() => {
    vi.clearAllMocks();
    repo = makeRepo();
    action = createBudget(repo);
  });

  it("throws AuthError when userId is falsy", async () => {
    await expect(action("", validInput)).rejects.toBeInstanceOf(AuthError);
    await expect(action(undefined as any, validInput)).rejects.toBeInstanceOf(
      AuthError
    );
    await expect(action(null as any, validInput)).rejects.toBeInstanceOf(
      AuthError
    );
  });

  it("throws ConflictError when name already exists", async () => {
    repo.getOneByName = vi.fn().mockResolvedValue({} as BudgetDto);

    await expect(action("u1", validInput)).rejects.toBeInstanceOf(
      ConflictError
    );
    expect(repo.getOneByName).toHaveBeenCalledWith("u1", "Food");
  });

  it("throws validation error for invalid input", async () => {
    const invalidInput = { name: "", maximumSpending: -10, colorTag: "bad" };

    await expect(action("u1", invalidInput)).rejects.toThrow();
    expect(repo.getOneByName).not.toHaveBeenCalled();
    expect(repo.createOne).not.toHaveBeenCalled();
  });

  it("propagates errors from repository methods", async () => {
    const testError = new Error("Database error");

    // Test getOneByName error propagation
    repo.getOneByName = vi.fn().mockRejectedValue(testError);
    await expect(action("u1", validInput)).rejects.toThrow(testError);

    // Test createOne error propagation
    vi.clearAllMocks();
    repo.getOneByName = vi.fn().mockResolvedValue(null);
    repo.createOne = vi.fn().mockRejectedValue(testError);
    await expect(action("u1", validInput)).rejects.toThrow(testError);
  });

  it("creates budget when valid and unique", async () => {
    repo.getOneByName = vi.fn().mockResolvedValue(null);

    const budget = {
      id: "b1",
      name: "Food",
      maximumSpending: 100,
      colorTag: "#ff0000",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    repo.createOne = vi.fn().mockResolvedValue(budget);

    const result = await action("u1", validInput);

    expect(result).toEqual(budget);
    expect(repo.getOneByName).toHaveBeenCalledWith("u1", "Food");
    expect(repo.createOne).toHaveBeenCalledWith("u1", validInput);
  });

  it("calls createOne with validated and trimmed data", async () => {
    repo.getOneByName = vi.fn().mockResolvedValue(null);

    const createOneMock = vi.fn().mockImplementation(async (userId, data) => ({
      id: "b1",
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    repo.createOne = createOneMock;

    const inputWithWhitespace = {
      name: " Food ",
      maximumSpending: 100,
      colorTag: "#ff0000",
    };

    await action("u1", inputWithWhitespace);

    expect(createOneMock).toHaveBeenCalledWith(
      "u1",
      expect.objectContaining({
        name: "Food", // Should be trimmed by validation
        maximumSpending: 100,
        colorTag: "#ff0000",
      })
    );
  });
});
