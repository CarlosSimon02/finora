import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { Mocked, vi } from "vitest";

/**
 * Mock repository factories
 * Following Interface Segregation and Dependency Inversion principles
 */

export const createMockTransactionRepository =
  (): Mocked<ITransactionRepository> => ({
    createOne: vi.fn(),
    getOneById: vi.fn(),
    getPaginated: vi.fn(),
    updateOne: vi.fn(),
    deleteOne: vi.fn(),
    getPaginatedCategories: vi.fn(),
  });

/**
 * Reset all mocks in a repository
 * Ensures test isolation
 */
export const resetRepositoryMocks = (
  repository: Mocked<ITransactionRepository>
): void => {
  Object.values(repository).forEach((mockFn) => {
    if (vi.isMockFunction(mockFn)) {
      mockFn.mockReset();
    }
  });
};
