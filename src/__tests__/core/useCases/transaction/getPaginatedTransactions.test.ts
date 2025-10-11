import {
  createMockTransactionRepository,
  resetRepositoryMocks,
} from "@/__tests__/utils/mockRepositories";
import {
  createPaginatedTransactionsResponse,
  createValidPaginationParams,
  createValidTransaction,
} from "@/__tests__/utils/testFactories";
import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { getPaginatedTransactions } from "@/core/useCases/transaction/getPaginatedTransactions";
import { AuthError, DomainValidationError } from "@/utils";
import { beforeEach, describe, expect, it, Mocked } from "vitest";

/**
 * getPaginatedTransactions Use Case Tests
 * Testing business logic and authorization
 * Following: Mock all dependencies, test behaviors
 */

describe("getPaginatedTransactions", () => {
  // Test doubles
  let mockRepository: Mocked<ITransactionRepository>;
  let useCase: ReturnType<typeof getPaginatedTransactions>;

  // Test data
  const validUserId = "user-123";
  const validPaginationParams = createValidPaginationParams();

  beforeEach(() => {
    mockRepository = createMockTransactionRepository();
    useCase = getPaginatedTransactions(mockRepository);
  });

  describe("happy path", () => {
    it("should retrieve paginated transactions with valid input", async () => {
      // Arrange
      const transactions = [
        createValidTransaction({ id: "trans-1" }),
        createValidTransaction({ id: "trans-2" }),
      ];
      const expectedResponse = createPaginatedTransactionsResponse(
        transactions,
        2
      );
      mockRepository.getPaginated.mockResolvedValue(expectedResponse);

      // Act
      const result = await useCase(validUserId, {
        params: validPaginationParams,
      });

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockRepository.getPaginated).toHaveBeenCalledWith(
        validUserId,
        validPaginationParams
      );
      expect(mockRepository.getPaginated).toHaveBeenCalledTimes(1);
    });

    it("should return empty data array when no transactions found", async () => {
      // Arrange
      const emptyResponse = createPaginatedTransactionsResponse([], 0);
      mockRepository.getPaginated.mockResolvedValue(emptyResponse);

      // Act
      const result = await useCase(validUserId, {
        params: validPaginationParams,
      });

      // Assert
      expect(result.data).toEqual([]);
      expect(result.meta.pagination.totalItems).toBe(0);
    });

    it("should retrieve transactions with custom pagination", async () => {
      // Arrange
      const customParams = createValidPaginationParams({
        pagination: { page: 2, perPage: 20 },
      });
      const transactions = [createValidTransaction()];
      const expectedResponse = createPaginatedTransactionsResponse(
        transactions,
        25
      );
      mockRepository.getPaginated.mockResolvedValue(expectedResponse);

      // Act
      const result = await useCase(validUserId, { params: customParams });

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockRepository.getPaginated).toHaveBeenCalledWith(
        validUserId,
        customParams
      );
    });

    it("should retrieve transactions with sorting", async () => {
      // Arrange
      const paramsWithSort = createValidPaginationParams({
        sort: { field: "transactionDate", order: "desc" },
      });
      const transactions = [
        createValidTransaction({ id: "trans-1" }),
        createValidTransaction({ id: "trans-2" }),
      ];
      const expectedResponse = createPaginatedTransactionsResponse(
        transactions,
        2
      );
      mockRepository.getPaginated.mockResolvedValue(expectedResponse);

      // Act
      const result = await useCase(validUserId, { params: paramsWithSort });

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockRepository.getPaginated).toHaveBeenCalledWith(
        validUserId,
        paramsWithSort
      );
    });

    it("should retrieve transactions with filters", async () => {
      // Arrange
      const paramsWithFilters = createValidPaginationParams({
        filters: [{ field: "type", operator: "==", value: "expense" }],
      });
      const transactions = [
        createValidTransaction({ type: "expense" }),
        createValidTransaction({ type: "expense" }),
      ];
      const expectedResponse = createPaginatedTransactionsResponse(
        transactions,
        2
      );
      mockRepository.getPaginated.mockResolvedValue(expectedResponse);

      // Act
      const result = await useCase(validUserId, { params: paramsWithFilters });

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockRepository.getPaginated).toHaveBeenCalledWith(
        validUserId,
        paramsWithFilters
      );
    });

    it("should retrieve transactions with search query", async () => {
      // Arrange
      const paramsWithSearch = createValidPaginationParams({
        search: "grocery",
      });
      const transactions = [
        createValidTransaction({ name: "Grocery Shopping" }),
      ];
      const expectedResponse = createPaginatedTransactionsResponse(
        transactions,
        1
      );
      mockRepository.getPaginated.mockResolvedValue(expectedResponse);

      // Act
      const result = await useCase(validUserId, { params: paramsWithSearch });

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(mockRepository.getPaginated).toHaveBeenCalledWith(
        validUserId,
        paramsWithSearch
      );
    });

    it("should pass through repository result unchanged", async () => {
      // Arrange
      const customResponse = createPaginatedTransactionsResponse(
        [createValidTransaction({ name: "Custom" })],
        100
      );
      mockRepository.getPaginated.mockResolvedValue(customResponse);

      // Act
      const result = await useCase(validUserId, {
        params: validPaginationParams,
      });

      // Assert
      expect(result).toBe(customResponse);
    });
  });

  describe("authorization", () => {
    it("should throw AuthError when userId is empty string", async () => {
      // Arrange
      const emptyUserId = "";

      // Act & Assert
      await expect(
        useCase(emptyUserId, { params: validPaginationParams })
      ).rejects.toThrowError(AuthError);

      expect(mockRepository.getPaginated).not.toHaveBeenCalled();
    });

    it("should throw AuthError when userId is null", async () => {
      // Act & Assert
      await expect(
        useCase(null as any, { params: validPaginationParams })
      ).rejects.toThrowError(AuthError);

      expect(mockRepository.getPaginated).not.toHaveBeenCalled();
    });

    it("should throw AuthError when userId is undefined", async () => {
      // Act & Assert
      await expect(
        useCase(undefined as any, { params: validPaginationParams })
      ).rejects.toThrowError(AuthError);

      expect(mockRepository.getPaginated).not.toHaveBeenCalled();
    });
  });

  describe("params validation", () => {
    it("should throw DomainValidationError when params is null", async () => {
      // Act & Assert
      await expect(
        useCase(validUserId, { params: null as any })
      ).rejects.toThrow(DomainValidationError);
      await expect(
        useCase(validUserId, { params: null as any })
      ).rejects.toThrow("Pagination params are required");

      expect(mockRepository.getPaginated).not.toHaveBeenCalled();
    });

    it("should throw DomainValidationError when params is undefined", async () => {
      // Act & Assert
      await expect(
        useCase(validUserId, { params: undefined as any })
      ).rejects.toThrow(DomainValidationError);

      expect(mockRepository.getPaginated).not.toHaveBeenCalled();
    });
  });

  describe("repository integration", () => {
    it("should propagate repository errors", async () => {
      // Arrange
      const repositoryError = new Error("Database connection failed");
      mockRepository.getPaginated.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(
        useCase(validUserId, { params: validPaginationParams })
      ).rejects.toThrow("Database connection failed");

      expect(mockRepository.getPaginated).toHaveBeenCalledTimes(1);
    });

    it("should handle repository timeout errors", async () => {
      // Arrange
      const timeoutError = new Error("Query timeout");
      mockRepository.getPaginated.mockRejectedValue(timeoutError);

      // Act & Assert
      await expect(
        useCase(validUserId, { params: validPaginationParams })
      ).rejects.toThrow("Query timeout");

      expect(mockRepository.getPaginated).toHaveBeenCalledWith(
        validUserId,
        validPaginationParams
      );
    });
  });

  describe("pagination metadata", () => {
    it("should return correct pagination metadata for first page", async () => {
      // Arrange
      const transactions = [createValidTransaction()];
      const response = createPaginatedTransactionsResponse(transactions, 25);
      mockRepository.getPaginated.mockResolvedValue(response);

      // Act
      const result = await useCase(validUserId, {
        params: validPaginationParams,
      });

      // Assert
      expect(result.meta.pagination.page).toBe(1);
      expect(result.meta.pagination.totalItems).toBe(25);
      expect(result.meta.pagination.hasNextPage).toBe(true);
      expect(result.meta.pagination.hasPrevPage).toBe(false);
    });

    it("should handle large datasets", async () => {
      // Arrange
      const transactions = Array.from({ length: 10 }, (_, i) =>
        createValidTransaction({ id: `trans-${i}` })
      );
      const response = createPaginatedTransactionsResponse(transactions, 1000);
      mockRepository.getPaginated.mockResolvedValue(response);

      // Act
      const result = await useCase(validUserId, {
        params: validPaginationParams,
      });

      // Assert
      expect(result.data).toHaveLength(10);
      expect(result.meta.pagination.totalItems).toBe(1000);
      expect(result.meta.pagination.totalPages).toBeGreaterThan(1);
    });
  });

  describe("edge cases", () => {
    it("should handle pagination for different users", async () => {
      // Arrange
      const userIds = ["user-1", "user-2", "user-3"];

      for (const userId of userIds) {
        resetRepositoryMocks(mockRepository);
        const response = createPaginatedTransactionsResponse(
          [createValidTransaction()],
          1
        );
        mockRepository.getPaginated.mockResolvedValue(response);

        // Act
        const result = await useCase(userId, {
          params: validPaginationParams,
        });

        // Assert
        expect(result).toEqual(response);
        expect(mockRepository.getPaginated).toHaveBeenCalledWith(
          userId,
          validPaginationParams
        );
      }
    });

    it("should handle mixed transaction types in results", async () => {
      // Arrange
      const transactions = [
        createValidTransaction({ type: "income", signedAmount: 100 }),
        createValidTransaction({ type: "expense", signedAmount: -50 }),
        createValidTransaction({ type: "income", signedAmount: 200 }),
      ];
      const response = createPaginatedTransactionsResponse(transactions, 3);
      mockRepository.getPaginated.mockResolvedValue(response);

      // Act
      const result = await useCase(validUserId, {
        params: validPaginationParams,
      });

      // Assert
      expect(result.data).toHaveLength(3);
      expect(result.data[0].type).toBe("income");
      expect(result.data[1].type).toBe("expense");
      expect(result.data[2].type).toBe("income");
    });

    it("should handle pagination with maximum perPage", async () => {
      // Arrange
      const maxParams = createValidPaginationParams({
        pagination: { page: 1, perPage: 100 },
      });
      const transactions = Array.from({ length: 100 }, (_, i) =>
        createValidTransaction({ id: `trans-${i}` })
      );
      const response = createPaginatedTransactionsResponse(transactions, 100);
      mockRepository.getPaginated.mockResolvedValue(response);

      // Act
      const result = await useCase(validUserId, { params: maxParams });

      // Assert
      expect(result.data).toHaveLength(100);
      expect(mockRepository.getPaginated).toHaveBeenCalledWith(
        validUserId,
        maxParams
      );
    });
  });

  describe("input validation order", () => {
    it("should check authorization before params validation", async () => {
      // Arrange
      const emptyUserId = "";

      // Act & Assert
      // Should throw AuthError, not DomainValidationError
      await expect(
        useCase(emptyUserId, { params: null as any })
      ).rejects.toThrowError(AuthError);

      expect(mockRepository.getPaginated).not.toHaveBeenCalled();
    });
  });
});
