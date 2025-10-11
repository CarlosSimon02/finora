import {
  createMockTransactionRepository,
  resetRepositoryMocks,
} from "@/__tests__/utils/mockRepositories";
import {
  createValidTransaction,
  createValidUpdateData,
} from "@/__tests__/utils/testFactories";
import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { updateTransaction } from "@/core/useCases/transaction/updateTransaction";
import { AuthError, DomainValidationError } from "@/utils";
import { beforeEach, describe, expect, it, Mocked } from "vitest";
import { ZodError } from "zod";

/**
 * updateTransaction Use Case Tests
 * Testing business logic, authorization, and validation
 * Following: Mock all dependencies, test behaviors
 */

describe("updateTransaction", () => {
  // Test doubles
  let mockRepository: Mocked<ITransactionRepository>;
  let useCase: ReturnType<typeof updateTransaction>;

  // Test data
  const validUserId = "user-123";
  const validTransactionId = "transaction-123";
  const validUpdateData = createValidUpdateData();
  const expectedTransaction = createValidTransaction({
    name: "Updated Transaction",
  });

  beforeEach(() => {
    mockRepository = createMockTransactionRepository();
    useCase = updateTransaction(mockRepository);
  });

  describe("happy path", () => {
    it("should update transaction with valid input", async () => {
      // Arrange
      mockRepository.updateOne.mockResolvedValue(expectedTransaction);

      // Act
      const result = await useCase(validUserId, {
        transactionId: validTransactionId,
        data: validUpdateData,
      });

      // Assert
      expect(result).toEqual(expectedTransaction);
      expect(mockRepository.updateOne).toHaveBeenCalledWith(
        validUserId,
        validTransactionId,
        validUpdateData
      );
      expect(mockRepository.updateOne).toHaveBeenCalledTimes(1);
    });

    it("should update only name field", async () => {
      // Arrange
      const partialUpdate = { name: "New Name" };
      const updatedTransaction = createValidTransaction({ name: "New Name" });
      mockRepository.updateOne.mockResolvedValue(updatedTransaction);

      // Act
      const result = await useCase(validUserId, {
        transactionId: validTransactionId,
        data: partialUpdate,
      });

      // Assert
      expect(result).toEqual(updatedTransaction);
      expect(mockRepository.updateOne).toHaveBeenCalledWith(
        validUserId,
        validTransactionId,
        partialUpdate
      );
    });

    it("should update only amount field", async () => {
      // Arrange
      const partialUpdate = { amount: 250.75 };
      const updatedTransaction = createValidTransaction({ amount: 250.75 });
      mockRepository.updateOne.mockResolvedValue(updatedTransaction);

      // Act
      const result = await useCase(validUserId, {
        transactionId: validTransactionId,
        data: partialUpdate,
      });

      // Assert
      expect(result).toEqual(updatedTransaction);
    });

    it("should update multiple fields", async () => {
      // Arrange
      const multiFieldUpdate = {
        name: "Updated Name",
        amount: 300,
        type: "income" as const,
      };
      const updatedTransaction = createValidTransaction(multiFieldUpdate);
      mockRepository.updateOne.mockResolvedValue(updatedTransaction);

      // Act
      const result = await useCase(validUserId, {
        transactionId: validTransactionId,
        data: multiFieldUpdate,
      });

      // Assert
      expect(result).toEqual(updatedTransaction);
      expect(mockRepository.updateOne).toHaveBeenCalledWith(
        validUserId,
        validTransactionId,
        multiFieldUpdate
      );
    });

    it("should update transaction type from expense to income", async () => {
      // Arrange
      const typeUpdate = { type: "income" as const };
      const updatedTransaction = createValidTransaction({
        type: "income",
        signedAmount: 100.5,
      });
      mockRepository.updateOne.mockResolvedValue(updatedTransaction);

      // Act
      const result = await useCase(validUserId, {
        transactionId: validTransactionId,
        data: typeUpdate,
      });

      // Assert
      expect(result.type).toBe("income");
    });

    it("should pass through repository result", async () => {
      // Arrange
      const customTransaction = createValidTransaction({
        id: "custom-id",
        name: "Custom Updated Transaction",
      });
      mockRepository.updateOne.mockResolvedValue(customTransaction);

      // Act
      const result = await useCase(validUserId, {
        transactionId: validTransactionId,
        data: validUpdateData,
      });

      // Assert
      expect(result).toBe(customTransaction);
    });
  });

  describe("authorization", () => {
    it("should throw AuthError when userId is empty string", async () => {
      // Arrange
      const emptyUserId = "";

      // Act & Assert
      await expect(
        useCase(emptyUserId, {
          transactionId: validTransactionId,
          data: validUpdateData,
        })
      ).rejects.toThrowError(AuthError);

      expect(mockRepository.updateOne).not.toHaveBeenCalled();
    });

    it("should throw AuthError when userId is null", async () => {
      // Act & Assert
      await expect(
        useCase(null as any, {
          transactionId: validTransactionId,
          data: validUpdateData,
        })
      ).rejects.toThrowError(AuthError);

      expect(mockRepository.updateOne).not.toHaveBeenCalled();
    });

    it("should throw AuthError when userId is undefined", async () => {
      // Act & Assert
      await expect(
        useCase(undefined as any, {
          transactionId: validTransactionId,
          data: validUpdateData,
        })
      ).rejects.toThrowError(AuthError);

      expect(mockRepository.updateOne).not.toHaveBeenCalled();
    });
  });

  describe("transactionId validation", () => {
    it("should throw DomainValidationError when transactionId is empty string", async () => {
      // Arrange
      const emptyTransactionId = "";

      // Act & Assert
      await expect(
        useCase(validUserId, {
          transactionId: emptyTransactionId,
          data: validUpdateData,
        })
      ).rejects.toThrow(DomainValidationError);
      await expect(
        useCase(validUserId, {
          transactionId: emptyTransactionId,
          data: validUpdateData,
        })
      ).rejects.toThrow("Transaction ID is required");

      expect(mockRepository.updateOne).not.toHaveBeenCalled();
    });

    it("should throw DomainValidationError when transactionId is null", async () => {
      // Act & Assert
      await expect(
        useCase(validUserId, {
          transactionId: null as any,
          data: validUpdateData,
        })
      ).rejects.toThrow(DomainValidationError);

      expect(mockRepository.updateOne).not.toHaveBeenCalled();
    });

    it("should throw DomainValidationError when transactionId is undefined", async () => {
      // Act & Assert
      await expect(
        useCase(validUserId, {
          transactionId: undefined as any,
          data: validUpdateData,
        })
      ).rejects.toThrow(DomainValidationError);

      expect(mockRepository.updateOne).not.toHaveBeenCalled();
    });
  });

  describe("data validation", () => {
    it("should throw ZodError when name exceeds maximum length", async () => {
      // Arrange
      const longName = "a".repeat(101);
      const invalidData = { name: longName };

      // Act & Assert
      await expect(
        useCase(validUserId, {
          transactionId: validTransactionId,
          data: invalidData,
        })
      ).rejects.toThrow(ZodError);

      expect(mockRepository.updateOne).not.toHaveBeenCalled();
    });

    it("should throw ZodError when amount is negative", async () => {
      // Arrange
      const invalidData = { amount: -100 };

      // Act & Assert
      await expect(
        useCase(validUserId, {
          transactionId: validTransactionId,
          data: invalidData,
        })
      ).rejects.toThrow(ZodError);

      expect(mockRepository.updateOne).not.toHaveBeenCalled();
    });

    it("should throw ZodError when amount is zero", async () => {
      // Arrange
      const invalidData = { amount: 0 };

      // Act & Assert
      await expect(
        useCase(validUserId, {
          transactionId: validTransactionId,
          data: invalidData,
        })
      ).rejects.toThrow(ZodError);

      expect(mockRepository.updateOne).not.toHaveBeenCalled();
    });

    it("should throw ZodError when type is invalid", async () => {
      // Arrange
      const invalidData = { type: "invalid" };

      // Act & Assert
      await expect(
        useCase(validUserId, {
          transactionId: validTransactionId,
          data: invalidData as any,
        })
      ).rejects.toThrow(ZodError);

      expect(mockRepository.updateOne).not.toHaveBeenCalled();
    });

    it("should throw ZodError when emoji is not valid", async () => {
      // Arrange
      const invalidData = { emoji: "abc" };

      // Act & Assert
      await expect(
        useCase(validUserId, {
          transactionId: validTransactionId,
          data: invalidData,
        })
      ).rejects.toThrow(ZodError);

      expect(mockRepository.updateOne).not.toHaveBeenCalled();
    });

    it("should accept empty update data object", async () => {
      // Arrange
      const emptyUpdate = {};
      mockRepository.updateOne.mockResolvedValue(expectedTransaction);

      // Act
      const result = await useCase(validUserId, {
        transactionId: validTransactionId,
        data: emptyUpdate,
      });

      // Assert
      expect(result).toEqual(expectedTransaction);
      expect(mockRepository.updateOne).toHaveBeenCalledWith(
        validUserId,
        validTransactionId,
        emptyUpdate
      );
    });
  });

  describe("repository integration", () => {
    it("should propagate repository errors", async () => {
      // Arrange
      const repositoryError = new Error("Database connection failed");
      mockRepository.updateOne.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(
        useCase(validUserId, {
          transactionId: validTransactionId,
          data: validUpdateData,
        })
      ).rejects.toThrow("Database connection failed");

      expect(mockRepository.updateOne).toHaveBeenCalledTimes(1);
    });

    it("should call repository with validated data", async () => {
      // Arrange
      const dataWithWhitespace = {
        name: "  Updated Name  ",
        categoryId: "  category-456  ",
      };
      mockRepository.updateOne.mockResolvedValue(expectedTransaction);

      // Act
      await useCase(validUserId, {
        transactionId: validTransactionId,
        data: dataWithWhitespace,
      });

      // Assert
      expect(mockRepository.updateOne).toHaveBeenCalledWith(
        validUserId,
        validTransactionId,
        {
          name: "Updated Name",
          categoryId: "category-456",
        }
      );
    });
  });

  describe("edge cases", () => {
    it("should handle update with maximum allowed amount", async () => {
      // Arrange
      const maxAmount = 999_999_999_999;
      const updateWithMaxAmount = { amount: maxAmount };
      const transactionWithMaxAmount = createValidTransaction({
        amount: maxAmount,
      });
      mockRepository.updateOne.mockResolvedValue(transactionWithMaxAmount);

      // Act
      const result = await useCase(validUserId, {
        transactionId: validTransactionId,
        data: updateWithMaxAmount,
      });

      // Assert
      expect(result.amount).toBe(maxAmount);
    });

    it("should handle update with decimal amounts", async () => {
      // Arrange
      const updateWithDecimals = { amount: 199.99 };
      const transactionWithDecimals = createValidTransaction({
        amount: 199.99,
      });
      mockRepository.updateOne.mockResolvedValue(transactionWithDecimals);

      // Act
      const result = await useCase(validUserId, {
        transactionId: validTransactionId,
        data: updateWithDecimals,
      });

      // Assert
      expect(result.amount).toBe(199.99);
    });

    it("should handle update with different emoji characters", async () => {
      // Arrange
      const emojis = ["🎉", "💰", "🏠"];
      for (const emoji of emojis) {
        resetRepositoryMocks(mockRepository);
        const updateWithEmoji = { emoji };
        const transactionWithEmoji = createValidTransaction({ emoji });
        mockRepository.updateOne.mockResolvedValue(transactionWithEmoji);

        // Act
        const result = await useCase(validUserId, {
          transactionId: validTransactionId,
          data: updateWithEmoji,
        });

        // Assert
        expect(result.emoji).toBe(emoji);
      }
    });
  });
});
