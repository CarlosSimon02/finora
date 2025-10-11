import {
  createMockTransactionRepository,
  resetRepositoryMocks,
} from "@/__tests__/utils/mockRepositories";
import { createValidTransaction } from "@/__tests__/utils/testFactories";
import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { getTransaction } from "@/core/useCases/transaction/getTransaction";
import { AuthError, DomainValidationError } from "@/utils";
import { beforeEach, describe, expect, it, Mocked } from "vitest";

/**
 * getTransaction Use Case Tests
 * Testing business logic and authorization
 * Following: Mock all dependencies, test behaviors
 */

describe("getTransaction", () => {
  // Test doubles
  let mockRepository: Mocked<ITransactionRepository>;
  let useCase: ReturnType<typeof getTransaction>;

  // Test data
  const validUserId = "user-123";
  const validTransactionId = "transaction-123";
  const expectedTransaction = createValidTransaction();

  beforeEach(() => {
    mockRepository = createMockTransactionRepository();
    useCase = getTransaction(mockRepository);
  });

  describe("happy path", () => {
    it("should retrieve transaction with valid input", async () => {
      // Arrange
      mockRepository.getOneById.mockResolvedValue(expectedTransaction);

      // Act
      const result = await useCase(validUserId, {
        transactionId: validTransactionId,
      });

      // Assert
      expect(result).toEqual(expectedTransaction);
      expect(mockRepository.getOneById).toHaveBeenCalledWith(
        validUserId,
        validTransactionId
      );
      expect(mockRepository.getOneById).toHaveBeenCalledTimes(1);
    });

    it("should return null when transaction not found", async () => {
      // Arrange
      mockRepository.getOneById.mockResolvedValue(null);

      // Act
      const result = await useCase(validUserId, {
        transactionId: validTransactionId,
      });

      // Assert
      expect(result).toBeNull();
      expect(mockRepository.getOneById).toHaveBeenCalledWith(
        validUserId,
        validTransactionId
      );
    });

    it("should retrieve income transaction", async () => {
      // Arrange
      const incomeTransaction = createValidTransaction({
        type: "income",
        signedAmount: 500.0,
      });
      mockRepository.getOneById.mockResolvedValue(incomeTransaction);

      // Act
      const result = await useCase(validUserId, {
        transactionId: validTransactionId,
      });

      // Assert
      expect(result).toEqual(incomeTransaction);
      expect(result?.type).toBe("income");
    });

    it("should retrieve expense transaction", async () => {
      // Arrange
      const expenseTransaction = createValidTransaction({
        type: "expense",
        signedAmount: -200.0,
      });
      mockRepository.getOneById.mockResolvedValue(expenseTransaction);

      // Act
      const result = await useCase(validUserId, {
        transactionId: validTransactionId,
      });

      // Assert
      expect(result).toEqual(expenseTransaction);
      expect(result?.type).toBe("expense");
    });

    it("should pass through repository result unchanged", async () => {
      // Arrange
      const customTransaction = createValidTransaction({
        id: "custom-id",
        name: "Custom Transaction",
        amount: 999.99,
      });
      mockRepository.getOneById.mockResolvedValue(customTransaction);

      // Act
      const result = await useCase(validUserId, {
        transactionId: "custom-id",
      });

      // Assert
      expect(result).toBe(customTransaction);
    });

    it("should retrieve transactions with different IDs", async () => {
      // Arrange
      const transactionIds = ["trans-1", "trans-2", "trans-3"];

      for (const transactionId of transactionIds) {
        resetRepositoryMocks(mockRepository);
        const transaction = createValidTransaction({ id: transactionId });
        mockRepository.getOneById.mockResolvedValue(transaction);

        // Act
        const result = await useCase(validUserId, { transactionId });

        // Assert
        expect(result?.id).toBe(transactionId);
        expect(mockRepository.getOneById).toHaveBeenCalledWith(
          validUserId,
          transactionId
        );
      }
    });
  });

  describe("authorization", () => {
    it("should throw AuthError when userId is empty string", async () => {
      // Arrange
      const emptyUserId = "";

      // Act & Assert
      await expect(
        useCase(emptyUserId, { transactionId: validTransactionId })
      ).rejects.toThrowError(AuthError);

      expect(mockRepository.getOneById).not.toHaveBeenCalled();
    });

    it("should throw AuthError when userId is null", async () => {
      // Act & Assert
      await expect(
        useCase(null as any, { transactionId: validTransactionId })
      ).rejects.toThrowError(AuthError);

      expect(mockRepository.getOneById).not.toHaveBeenCalled();
    });

    it("should throw AuthError when userId is undefined", async () => {
      // Act & Assert
      await expect(
        useCase(undefined as any, { transactionId: validTransactionId })
      ).rejects.toThrowError(AuthError);

      expect(mockRepository.getOneById).not.toHaveBeenCalled();
    });
  });

  describe("transactionId validation", () => {
    it("should throw DomainValidationError when transactionId is empty string", async () => {
      // Arrange
      const emptyTransactionId = "";

      // Act & Assert
      await expect(
        useCase(validUserId, { transactionId: emptyTransactionId })
      ).rejects.toThrow(DomainValidationError);
      await expect(
        useCase(validUserId, { transactionId: emptyTransactionId })
      ).rejects.toThrow("Transaction ID is required");

      expect(mockRepository.getOneById).not.toHaveBeenCalled();
    });

    it("should throw DomainValidationError when transactionId is null", async () => {
      // Act & Assert
      await expect(
        useCase(validUserId, { transactionId: null as any })
      ).rejects.toThrow(DomainValidationError);

      expect(mockRepository.getOneById).not.toHaveBeenCalled();
    });

    it("should throw DomainValidationError when transactionId is undefined", async () => {
      // Act & Assert
      await expect(
        useCase(validUserId, { transactionId: undefined as any })
      ).rejects.toThrow(DomainValidationError);

      expect(mockRepository.getOneById).not.toHaveBeenCalled();
    });
  });

  describe("repository integration", () => {
    it("should propagate repository errors", async () => {
      // Arrange
      const repositoryError = new Error("Database connection failed");
      mockRepository.getOneById.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(
        useCase(validUserId, { transactionId: validTransactionId })
      ).rejects.toThrow("Database connection failed");

      expect(mockRepository.getOneById).toHaveBeenCalledTimes(1);
    });

    it("should handle repository timeout errors", async () => {
      // Arrange
      const timeoutError = new Error("Query timeout");
      mockRepository.getOneById.mockRejectedValue(timeoutError);

      // Act & Assert
      await expect(
        useCase(validUserId, { transactionId: validTransactionId })
      ).rejects.toThrow("Query timeout");

      expect(mockRepository.getOneById).toHaveBeenCalledWith(
        validUserId,
        validTransactionId
      );
    });
  });

  describe("edge cases", () => {
    it("should handle retrieval with special character IDs", async () => {
      // Arrange
      const specialIds = ["trans-123-abc", "trans_456_def", "TRANS789"];

      for (const transactionId of specialIds) {
        resetRepositoryMocks(mockRepository);
        const transaction = createValidTransaction({ id: transactionId });
        mockRepository.getOneById.mockResolvedValue(transaction);

        // Act
        const result = await useCase(validUserId, { transactionId });

        // Assert
        expect(result?.id).toBe(transactionId);
        expect(mockRepository.getOneById).toHaveBeenCalledWith(
          validUserId,
          transactionId
        );
      }
    });

    it("should handle retrieval for different users", async () => {
      // Arrange
      const userIds = ["user-1", "user-2", "user-3"];

      for (const userId of userIds) {
        resetRepositoryMocks(mockRepository);
        mockRepository.getOneById.mockResolvedValue(expectedTransaction);

        // Act
        const result = await useCase(userId, {
          transactionId: validTransactionId,
        });

        // Assert
        expect(result).toEqual(expectedTransaction);
        expect(mockRepository.getOneById).toHaveBeenCalledWith(
          userId,
          validTransactionId
        );
      }
    });

    it("should return complete transaction with all properties", async () => {
      // Arrange
      const completeTransaction = createValidTransaction({
        id: "complete-trans",
        name: "Complete Transaction",
        amount: 150.5,
        signedAmount: -150.5,
        type: "expense",
        emoji: "🎯",
        category: {
          id: "cat-123",
          name: "Shopping",
          colorTag: "#277C78",
        },
      });
      mockRepository.getOneById.mockResolvedValue(completeTransaction);

      // Act
      const result = await useCase(validUserId, {
        transactionId: "complete-trans",
      });

      // Assert
      expect(result).toEqual(completeTransaction);
      expect(result?.id).toBe("complete-trans");
      expect(result?.name).toBe("Complete Transaction");
      expect(result?.amount).toBe(150.5);
      expect(result?.category.name).toBe("Shopping");
    });
  });

  describe("input validation order", () => {
    it("should check authorization before transactionId validation", async () => {
      // Arrange
      const emptyUserId = "";
      const emptyTransactionId = "";

      // Act & Assert
      // Should throw AuthError, not DomainValidationError
      await expect(
        useCase(emptyUserId, { transactionId: emptyTransactionId })
      ).rejects.toThrowError(AuthError);

      expect(mockRepository.getOneById).not.toHaveBeenCalled();
    });
  });
});
