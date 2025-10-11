import {
  createMockTransactionRepository,
  resetRepositoryMocks,
} from "@/__tests__/utils/mockRepositories";
import {
  createValidTransaction,
  createValidTransactionData,
} from "@/__tests__/utils/testFactories";
import { ITransactionRepository } from "@/core/interfaces/ITransactionRepository";
import { createTransaction } from "@/core/useCases/transaction/createTransaction";
import { AuthError } from "@/utils";
import { beforeEach, describe, expect, it, Mocked } from "vitest";
import { ZodError } from "zod";

/**
 * createTransaction Use Case Tests
 * Testing business logic and authorization
 * Following: Mock all dependencies, test behaviors
 */

describe("createTransaction", () => {
  // Test doubles
  let mockRepository: Mocked<ITransactionRepository>;
  let useCase: ReturnType<typeof createTransaction>;

  // Test data
  const validUserId = "user-123";
  const validTransactionData = createValidTransactionData();
  const expectedTransaction = createValidTransaction();

  beforeEach(() => {
    mockRepository = createMockTransactionRepository();
    useCase = createTransaction(mockRepository);
  });

  describe("happy path", () => {
    it("should create transaction with valid input", async () => {
      // Arrange
      mockRepository.createOne.mockResolvedValue(expectedTransaction);

      // Act
      const result = await useCase(validUserId, {
        data: validTransactionData,
      });

      // Assert
      expect(result).toEqual(expectedTransaction);
      expect(mockRepository.createOne).toHaveBeenCalledWith(
        validUserId,
        validTransactionData
      );
      expect(mockRepository.createOne).toHaveBeenCalledTimes(1);
    });

    it("should create income transaction", async () => {
      // Arrange
      const incomeData = createValidTransactionData({ type: "income" });
      const incomeTransaction = createValidTransaction({
        type: "income",
        signedAmount: 100.5,
      });
      mockRepository.createOne.mockResolvedValue(incomeTransaction);

      // Act
      const result = await useCase(validUserId, { data: incomeData });

      // Assert
      expect(result).toEqual(incomeTransaction);
      expect(mockRepository.createOne).toHaveBeenCalledWith(
        validUserId,
        incomeData
      );
    });

    it("should create expense transaction", async () => {
      // Arrange
      const expenseData = createValidTransactionData({ type: "expense" });
      const expenseTransaction = createValidTransaction({
        type: "expense",
        signedAmount: -100.5,
      });
      mockRepository.createOne.mockResolvedValue(expenseTransaction);

      // Act
      const result = await useCase(validUserId, { data: expenseData });

      // Assert
      expect(result).toEqual(expenseTransaction);
    });

    it("should pass through repository result", async () => {
      // Arrange
      const customTransaction = createValidTransaction({
        id: "custom-id",
        name: "Custom Transaction",
      });
      mockRepository.createOne.mockResolvedValue(customTransaction);

      // Act
      const result = await useCase(validUserId, {
        data: validTransactionData,
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
        useCase(emptyUserId, { data: validTransactionData })
      ).rejects.toThrowError(AuthError);

      expect(mockRepository.createOne).not.toHaveBeenCalled();
    });

    it("should throw AuthError when userId is null", async () => {
      // Act & Assert
      await expect(
        useCase(null as any, { data: validTransactionData })
      ).rejects.toThrowError(AuthError);

      expect(mockRepository.createOne).not.toHaveBeenCalled();
    });

    it("should throw AuthError when userId is undefined", async () => {
      // Act & Assert
      await expect(
        useCase(undefined as any, { data: validTransactionData })
      ).rejects.toThrowError(AuthError);

      expect(mockRepository.createOne).not.toHaveBeenCalled();
    });
  });

  describe("validation", () => {
    it("should throw ZodError when transaction name is empty", async () => {
      // Arrange
      const invalidData = createValidTransactionData({ name: "" });

      // Act & Assert
      await expect(useCase(validUserId, { data: invalidData })).rejects.toThrow(
        ZodError
      );

      expect(mockRepository.createOne).not.toHaveBeenCalled();
    });

    it("should throw ZodError when amount is negative", async () => {
      // Arrange
      const invalidData = createValidTransactionData({ amount: -100 });

      // Act & Assert
      await expect(useCase(validUserId, { data: invalidData })).rejects.toThrow(
        ZodError
      );

      expect(mockRepository.createOne).not.toHaveBeenCalled();
    });

    it("should throw ZodError when amount is zero", async () => {
      // Arrange
      const invalidData = createValidTransactionData({ amount: 0 });

      // Act & Assert
      await expect(useCase(validUserId, { data: invalidData })).rejects.toThrow(
        ZodError
      );

      expect(mockRepository.createOne).not.toHaveBeenCalled();
    });

    it("should throw ZodError when type is invalid", async () => {
      // Arrange
      const invalidData = { ...validTransactionData, type: "invalid" };

      // Act & Assert
      await expect(
        useCase(validUserId, { data: invalidData as any })
      ).rejects.toThrow(ZodError);

      expect(mockRepository.createOne).not.toHaveBeenCalled();
    });

    it("should throw ZodError when emoji is not valid", async () => {
      // Arrange
      const invalidData = createValidTransactionData({ emoji: "abc" });

      // Act & Assert
      await expect(useCase(validUserId, { data: invalidData })).rejects.toThrow(
        ZodError
      );

      expect(mockRepository.createOne).not.toHaveBeenCalled();
    });

    it("should throw ZodError when categoryId is empty", async () => {
      // Arrange
      const invalidData = createValidTransactionData({ categoryId: "" });

      // Act & Assert
      await expect(useCase(validUserId, { data: invalidData })).rejects.toThrow(
        ZodError
      );

      expect(mockRepository.createOne).not.toHaveBeenCalled();
    });

    it("should throw ZodError when required fields are missing", async () => {
      // Arrange
      const invalidData = { name: "Test" };

      // Act & Assert
      await expect(
        useCase(validUserId, { data: invalidData as any })
      ).rejects.toThrow(ZodError);

      expect(mockRepository.createOne).not.toHaveBeenCalled();
    });
  });

  describe("repository integration", () => {
    it("should propagate repository errors", async () => {
      // Arrange
      const repositoryError = new Error("Database connection failed");
      mockRepository.createOne.mockRejectedValue(repositoryError);

      // Act & Assert
      await expect(
        useCase(validUserId, { data: validTransactionData })
      ).rejects.toThrow("Database connection failed");

      expect(mockRepository.createOne).toHaveBeenCalledTimes(1);
    });

    it("should call repository with validated data", async () => {
      // Arrange
      const dataWithWhitespace = createValidTransactionData({
        name: "  Transaction Name  ",
        categoryId: "  category-123  ",
      });
      mockRepository.createOne.mockResolvedValue(expectedTransaction);

      // Act
      await useCase(validUserId, { data: dataWithWhitespace });

      // Assert
      expect(mockRepository.createOne).toHaveBeenCalledWith(validUserId, {
        ...dataWithWhitespace,
        name: "Transaction Name",
        categoryId: "category-123",
      });
    });
  });

  describe("edge cases", () => {
    it("should handle transaction with maximum allowed amount", async () => {
      // Arrange
      const maxAmount = 999_999_999_999;
      const dataWithMaxAmount = createValidTransactionData({
        amount: maxAmount,
      });
      const transactionWithMaxAmount = createValidTransaction({
        amount: maxAmount,
      });
      mockRepository.createOne.mockResolvedValue(transactionWithMaxAmount);

      // Act
      const result = await useCase(validUserId, { data: dataWithMaxAmount });

      // Assert
      expect(result.amount).toBe(maxAmount);
    });

    it("should handle transaction with decimal amounts", async () => {
      // Arrange
      const dataWithDecimals = createValidTransactionData({ amount: 99.99 });
      const transactionWithDecimals = createValidTransaction({
        amount: 99.99,
      });
      mockRepository.createOne.mockResolvedValue(transactionWithDecimals);

      // Act
      const result = await useCase(validUserId, { data: dataWithDecimals });

      // Assert
      expect(result.amount).toBe(99.99);
    });

    it("should handle different emoji characters", async () => {
      // Arrange
      const emojis = ["😀", "🎉", "💰"];
      for (const emoji of emojis) {
        resetRepositoryMocks(mockRepository);
        const dataWithEmoji = createValidTransactionData({ emoji });
        const transactionWithEmoji = createValidTransaction({ emoji });
        mockRepository.createOne.mockResolvedValue(transactionWithEmoji);

        // Act
        const result = await useCase(validUserId, { data: dataWithEmoji });

        // Assert
        expect(result.emoji).toBe(emoji);
      }
    });
  });
});
