import { ColorValue } from "@/constants/colors";
import {
  CreateTransactionDto,
  PaginatedCategoriesResponseDto,
  PaginatedTransactionsResponseDto,
  PaginationParams,
  TransactionDto,
  UpdateTransactionDto,
} from "@/core/schemas";

/**
 * Factory functions for creating test data
 * Following DRY and Composition patterns
 */

// Base test data builders
export const createTestDate = (offsetDays = 0): Date => {
  const date = new Date("2024-01-15T00:00:00.000Z");
  date.setDate(date.getDate() + offsetDays);
  return date;
};

// Transaction factories
export const createValidTransactionData = (
  overrides: Partial<CreateTransactionDto> = {}
): CreateTransactionDto => ({
  name: "Grocery Shopping",
  type: "expense",
  amount: 100.5,
  transactionDate: createTestDate(),
  emoji: "🛒",
  categoryId: "category-123",
  ...overrides,
});

export const createValidTransaction = (
  overrides: Partial<TransactionDto> = {}
): TransactionDto => ({
  id: "transaction-123",
  name: "Grocery Shopping",
  type: "expense",
  amount: 100.5,
  signedAmount: -100.5,
  transactionDate: createTestDate(),
  emoji: "🛒",
  category: {
    id: "category-123",
    name: "Food & Dining",
    colorTag: "#277C78",
  },
  createdAt: createTestDate(-1),
  updatedAt: createTestDate(-1),
  ...overrides,
});

export const createValidUpdateData = (
  overrides: Partial<UpdateTransactionDto> = {}
): UpdateTransactionDto => ({
  name: "Updated Transaction",
  ...overrides,
});

// Pagination factories
export const createValidPaginationParams = (
  overrides: Partial<PaginationParams> = {}
): PaginationParams => ({
  pagination: {
    page: 1,
    perPage: 10,
  },
  filters: [],
  ...overrides,
});

export const createPaginatedTransactionsResponse = (
  transactions: TransactionDto[] = [],
  totalItems = 0
): PaginatedTransactionsResponseDto => ({
  data: transactions,
  meta: {
    pagination: {
      totalItems,
      page: 1,
      perPage: 10,
      totalPages: Math.ceil(totalItems / 10),
      nextPage: totalItems > 10 ? 2 : null,
      previousPage: null,
      hasNextPage: totalItems > 10,
      hasPrevPage: false,
    },
  },
});

export const createPaginatedCategoriesResponse = (
  categories: Array<{
    id: string;
    name: string;
    colorTag: ColorValue;
    createdAt: Date;
    updatedAt: Date;
  }> = [],
  totalItems = 0
): PaginatedCategoriesResponseDto => ({
  data: categories,
  meta: {
    pagination: {
      totalItems,
      page: 1,
      perPage: 10,
      totalPages: Math.ceil(totalItems / 10),
      nextPage: totalItems > 10 ? 2 : null,
      previousPage: null,
      hasNextPage: totalItems > 10,
      hasPrevPage: false,
    },
  },
});
