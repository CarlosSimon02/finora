import { TRANSACTION_NAME_MAX_LENGTH } from "@/core/constants";
import {
  createTransactionSchema,
  transactionTypeSchema,
  updateTransactionSchema,
} from "@/core/schemas";
import { describe, expect, it } from "vitest";

/**
 * Transaction Schema Tests
 * Testing business rules and domain validation
 * Following: Test behaviors, not implementations
 */

describe("transactionTypeSchema", () => {
  describe("happy path", () => {
    it("should accept valid income type", () => {
      const result = transactionTypeSchema.parse("income");
      expect(result).toBe("income");
    });

    it("should accept valid expense type", () => {
      const result = transactionTypeSchema.parse("expense");
      expect(result).toBe("expense");
    });
  });

  describe("edge cases", () => {
    it("should reject invalid transaction type", () => {
      expect(() => transactionTypeSchema.parse("invalid")).toThrow();
    });

    it("should reject empty string", () => {
      expect(() => transactionTypeSchema.parse("")).toThrow();
    });
  });
});

describe("createTransactionSchema", () => {
  // Valid test data
  const validTransactionData = {
    name: "Grocery Shopping",
    type: "expense" as const,
    amount: 100.5,
    transactionDate: new Date("2024-01-15"),
    emoji: "🛒",
    categoryId: "category-123",
  };

  describe("happy path", () => {
    it("should validate complete valid transaction data", () => {
      const result = createTransactionSchema.parse(validTransactionData);
      expect(result.name).toBe("Grocery Shopping");
      expect(result.type).toBe("expense");
      expect(result.amount).toBe(100.5);
      expect(result.emoji).toBe("🛒");
      expect(result.categoryId).toBe("category-123");
    });

    it("should accept income transaction type", () => {
      const incomeData = { ...validTransactionData, type: "income" as const };
      const result = createTransactionSchema.parse(incomeData);
      expect(result.type).toBe("income");
    });

    it("should trim whitespace from name", () => {
      const dataWithSpaces = {
        ...validTransactionData,
        name: "  Grocery Shopping  ",
      };
      const result = createTransactionSchema.parse(dataWithSpaces);
      expect(result.name).toBe("Grocery Shopping");
    });

    it("should trim whitespace from categoryId", () => {
      const dataWithSpaces = {
        ...validTransactionData,
        categoryId: "  category-123  ",
      };
      const result = createTransactionSchema.parse(dataWithSpaces);
      expect(result.categoryId).toBe("category-123");
    });

    it("should accept amount with 2 decimal places", () => {
      const dataWithDecimals = { ...validTransactionData, amount: 99.99 };
      const result = createTransactionSchema.parse(dataWithDecimals);
      expect(result.amount).toBe(99.99);
    });

    it("should accept amount with 1 decimal place", () => {
      const dataWithDecimals = { ...validTransactionData, amount: 50.5 };
      const result = createTransactionSchema.parse(dataWithDecimals);
      expect(result.amount).toBe(50.5);
    });

    it("should accept whole number amount", () => {
      const dataWithWholeNumber = { ...validTransactionData, amount: 100 };
      const result = createTransactionSchema.parse(dataWithWholeNumber);
      expect(result.amount).toBe(100);
    });

    it("should accept various valid emojis", () => {
      const emojis = ["😀", "🎉", "🍕", "💰", "🏠"];
      emojis.forEach((emoji) => {
        const dataWithEmoji = { ...validTransactionData, emoji };
        const result = createTransactionSchema.parse(dataWithEmoji);
        expect(result.emoji).toBe(emoji);
      });
    });
  });

  describe("name validation", () => {
    it("should reject empty name", () => {
      const invalidData = { ...validTransactionData, name: "" };
      expect(() => createTransactionSchema.parse(invalidData)).toThrow(
        "Transaction name is required"
      );
    });

    it("should reject name with only whitespace", () => {
      const invalidData = { ...validTransactionData, name: "   " };
      expect(() => createTransactionSchema.parse(invalidData)).toThrow(
        "Transaction name is required"
      );
    });

    it("should reject name exceeding maximum length", () => {
      const longName = "a".repeat(TRANSACTION_NAME_MAX_LENGTH + 1);
      const invalidData = { ...validTransactionData, name: longName };
      expect(() => createTransactionSchema.parse(invalidData)).toThrow(
        `Transaction name must be at most ${TRANSACTION_NAME_MAX_LENGTH} characters`
      );
    });

    it("should accept name at maximum length", () => {
      const maxLengthName = "a".repeat(TRANSACTION_NAME_MAX_LENGTH);
      const validData = { ...validTransactionData, name: maxLengthName };
      const result = createTransactionSchema.parse(validData);
      expect(result.name).toBe(maxLengthName);
    });
  });

  describe("type validation", () => {
    it("should reject invalid transaction type", () => {
      const invalidData = { ...validTransactionData, type: "invalid" };
      expect(() => createTransactionSchema.parse(invalidData)).toThrow();
    });

    it("should reject numeric type", () => {
      const invalidData = { ...validTransactionData, type: 123 };
      expect(() => createTransactionSchema.parse(invalidData)).toThrow();
    });
  });

  describe("amount validation", () => {
    it("should reject zero amount", () => {
      const invalidData = { ...validTransactionData, amount: 0 };
      expect(() => createTransactionSchema.parse(invalidData)).toThrow(
        "Amount must be greater than 0"
      );
    });

    it("should reject negative amount", () => {
      const invalidData = { ...validTransactionData, amount: -50 };
      expect(() => createTransactionSchema.parse(invalidData)).toThrow(
        "Amount must be greater than 0"
      );
    });

    it("should reject amount with more than 2 decimal places", () => {
      const invalidData = { ...validTransactionData, amount: 100.123 };
      expect(() => createTransactionSchema.parse(invalidData)).toThrow(
        "Amount must have at most 2 decimal places"
      );
    });

    it("should reject non-numeric amount", () => {
      const invalidData = { ...validTransactionData, amount: "100" };
      expect(() => createTransactionSchema.parse(invalidData)).toThrow();
    });
  });

  describe("transactionDate validation", () => {
    it("should reject invalid date", () => {
      const invalidData = {
        ...validTransactionData,
        transactionDate: "not-a-date",
      };
      expect(() => createTransactionSchema.parse(invalidData)).toThrow(
        "Transaction date must be a valid date"
      );
    });

    it("should reject null date", () => {
      const invalidData = { ...validTransactionData, transactionDate: null };
      expect(() => createTransactionSchema.parse(invalidData)).toThrow();
    });
  });

  describe("emoji validation", () => {
    it("should reject empty emoji", () => {
      const invalidData = { ...validTransactionData, emoji: "" };
      expect(() => createTransactionSchema.parse(invalidData)).toThrow(
        "Only emoji characters are allowed"
      );
    });

    it("should reject text as emoji", () => {
      const invalidData = { ...validTransactionData, emoji: "abc" };
      expect(() => createTransactionSchema.parse(invalidData)).toThrow(
        "Only emoji characters are allowed"
      );
    });

    it("should reject numbers as emoji", () => {
      const invalidData = { ...validTransactionData, emoji: "123" };
      expect(() => createTransactionSchema.parse(invalidData)).toThrow(
        "Only emoji characters are allowed"
      );
    });

    it("should reject emoji with text", () => {
      const invalidData = { ...validTransactionData, emoji: "🛒abc" };
      expect(() => createTransactionSchema.parse(invalidData)).toThrow(
        "Only emoji characters are allowed"
      );
    });

    it("should trim whitespace from emoji", () => {
      const dataWithSpaces = { ...validTransactionData, emoji: "  🛒  " };
      const result = createTransactionSchema.parse(dataWithSpaces);
      expect(result.emoji).toBe("🛒");
    });
  });

  describe("categoryId validation", () => {
    it("should reject empty categoryId", () => {
      const invalidData = { ...validTransactionData, categoryId: "" };
      expect(() => createTransactionSchema.parse(invalidData)).toThrow(
        "Category is required"
      );
    });

    it("should reject categoryId with only whitespace", () => {
      const invalidData = { ...validTransactionData, categoryId: "   " };
      expect(() => createTransactionSchema.parse(invalidData)).toThrow(
        "Category is required"
      );
    });
  });

  describe("missing required fields", () => {
    it("should reject missing name", () => {
      const { name, ...invalidData } = validTransactionData;
      expect(() => createTransactionSchema.parse(invalidData)).toThrow();
    });

    it("should reject missing type", () => {
      const { type, ...invalidData } = validTransactionData;
      expect(() => createTransactionSchema.parse(invalidData)).toThrow();
    });

    it("should reject missing amount", () => {
      const { amount, ...invalidData } = validTransactionData;
      expect(() => createTransactionSchema.parse(invalidData)).toThrow();
    });

    it("should reject missing transactionDate", () => {
      const { transactionDate, ...invalidData } = validTransactionData;
      expect(() => createTransactionSchema.parse(invalidData)).toThrow();
    });

    it("should reject missing emoji", () => {
      const { emoji, ...invalidData } = validTransactionData;
      expect(() => createTransactionSchema.parse(invalidData)).toThrow();
    });

    it("should reject missing categoryId", () => {
      const { categoryId, ...invalidData } = validTransactionData;
      expect(() => createTransactionSchema.parse(invalidData)).toThrow();
    });
  });
});

describe("updateTransactionSchema", () => {
  describe("happy path", () => {
    it("should accept partial update with name only", () => {
      const result = updateTransactionSchema.parse({ name: "Updated Name" });
      expect(result.name).toBe("Updated Name");
    });

    it("should accept partial update with amount only", () => {
      const result = updateTransactionSchema.parse({ amount: 200.5 });
      expect(result.amount).toBe(200.5);
    });

    it("should accept partial update with multiple fields", () => {
      const updateData = {
        name: "Updated Transaction",
        amount: 150.75,
        type: "income" as const,
      };
      const result = updateTransactionSchema.parse(updateData);
      expect(result.name).toBe("Updated Transaction");
      expect(result.amount).toBe(150.75);
      expect(result.type).toBe("income");
    });

    it("should accept empty object for partial update", () => {
      const result = updateTransactionSchema.parse({});
      expect(result).toEqual({});
    });
  });

  describe("validation on provided fields", () => {
    it("should reject invalid name when provided", () => {
      const longName = "a".repeat(TRANSACTION_NAME_MAX_LENGTH + 1);
      expect(() => updateTransactionSchema.parse({ name: longName })).toThrow();
    });

    it("should reject invalid amount when provided", () => {
      expect(() => updateTransactionSchema.parse({ amount: -50 })).toThrow();
    });

    it("should reject invalid emoji when provided", () => {
      expect(() => updateTransactionSchema.parse({ emoji: "abc" })).toThrow();
    });

    it("should reject invalid type when provided", () => {
      expect(() =>
        updateTransactionSchema.parse({ type: "invalid" })
      ).toThrow();
    });
  });
});
