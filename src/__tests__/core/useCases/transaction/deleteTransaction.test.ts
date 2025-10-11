import { createMockTransactionRepository } from "@/__tests__/utils/mockRepositories";
import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { deleteTransaction } from "@/core/useCases/transaction/deleteTransaction";
import { AuthError, DomainValidationError } from "@/utils";
import { beforeEach, describe, expect, it, Mocked } from "vitest";

/**
 * deleteTransaction Use Case Tests
 * Testing business logic and authorization
 * Following: Mock all dependencies, test behaviors
 */

describe("deleteTransaction", () => {
  // Test doubles
  let mockRepository: Mocked<ITransactionRepository>;
  let useCase: ReturnType<typeof deleteTransaction>;

  // Test data
  const validUserId = "user-123";
  const validTransactionId = "transaction-123";

  beforeEach(() => {
    mockRepository = createMockTransactionRepository();
    useCase = deleteTransaction(mockRepository);
  });

  describe("happy path", () => {
    it("should delete transaction with valid input", async () => {
      // Arrange
      mockRepository.deleteOne.mockResolvedValue(undefined);

      // Act
      await useCase(validUserId, { transactionId: validTransactionId });

      // Assert
      expect(mockRepository.deleteOne).toHaveBeenCalledWith(
        validUserId,
        validTransactionId
      );
      expect(mockRepository.deleteOne).toHaveBeenCalledTimes(1);
    });

    it("should return void on successful deletion", async () => {
      // Arrange
      mockRepository.deleteOne.mockResolvedValue(undefined);

      // Act
      const result = await useCase(validUserId, {
        transactionId: validTransactionId,
      });

      // Assert
      expect(result).toBeUndefined();
    });

    it("should delete transaction with different IDs", async () => {
      // Arrange
      const differentTransactionIds = ["trans-001", "trans-002", "trans-003"];

      for (const transactionId of differentTransactionIds) {
        mockRepository.deleteOne.mockResolvedValue(undefined);

        // Act
        await useCase(validUserId, { transactionId });

        // Assert
        expect(mockRepository.deleteOne).toHaveBeenCalledWith(
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

      expect(mockRepository.deleteOne).not.toHaveBeenCalled();
    });

    it("should throw AuthError when userId is null", async () => {
      // Act & Assert
      await expect(
        useCase(null as any, { transactionId: validTransactionId })
      ).rejects.toThrowError(AuthError);

      expect(mockRepository.deleteOne).not.toHaveBeenCalled();
    });

    it("should throw AuthError when userId is undefined", async () => {
      // Act & Assert
      await expect(
        useCase(undefined as any, { transactionId: validTransactionId })
      ).rejects.toThrowError(AuthError);

      expect(mockRepository.deleteOne).not.toHaveBeenCalled();
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

      expect(mockRepository.deleteOne).not.toHaveBeenCalled();
    });

    it("should throw DomainValidationError when transactionId is null", async () => {
      // Act & Assert
      await expect(
        useCase(validUserId, { transactionId: null as any })
      ).rejects.toThrow(DomainValidationError);

      expect(mockRepository.deleteOne).not.toHaveBeenCalled();
    });

    it("should throw DomainValidationError when transactionId is undefined", async () => {
      // Act & Assert
      await expect(
        useCase(validUserId, { transactionId: undefined as any })
      ).rejects.toThrow(DomainValidationError);

      expect(mockRepository.deleteOne).not.toHaveBeenCalled();
    });
  });

  describe("repository integration", () => {
    it("should propagate repository errors", async () => {
      // Arrange
      const repositoryError = new Error("Database connection failed");
      mockRepository.deleteOne.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(
        useCase(validUserId, { transactionId: validTransactionId })
      ).rejects.toThrow("Database connection failed");

      expect(mockRepository.deleteOne).toHaveBeenCalledTimes(1);
    });

    it("should propagate NotFoundError from repository", async () => {
      // Arrange
      const notFoundError = new Error("Transaction not found");
      mockRepository.deleteOne.mockRejectedValue(notFoundError);

      // Act & Assert
      await expect(
        useCase(validUserId, { transactionId: validTransactionId })
      ).rejects.toThrow("Transaction not found");

      expect(mockRepository.deleteOne).toHaveBeenCalledWith(
        validUserId,
        validTransactionId
      );
    });
  });

  describe("edge cases", () => {
    it("should handle deletion with special character IDs", async () => {
      // Arrange
      const specialIds = ["trans-123-abc", "trans_456_def", "TRANS789"];

      for (const transactionId of specialIds) {
        mockRepository.deleteOne.mockResolvedValue(undefined);

        // Act
        await useCase(validUserId, { transactionId });

        // Assert
        expect(mockRepository.deleteOne).toHaveBeenCalledWith(
          validUserId,
          transactionId
        );
      }
    });

    it("should handle deletion for different users", async () => {
      // Arrange
      const userIds = ["user-1", "user-2", "user-3"];

      for (const userId of userIds) {
        mockRepository.deleteOne.mockResolvedValue(undefined);

        // Act
        await useCase(userId, { transactionId: validTransactionId });

        // Assert
        expect(mockRepository.deleteOne).toHaveBeenCalledWith(
          userId,
          validTransactionId
        );
      }
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

      expect(mockRepository.deleteOne).not.toHaveBeenCalled();
    });
  });
});
