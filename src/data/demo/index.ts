import {
  BudgetDto,
  BudgetsSummaryDto,
  IncomeDto,
  IncomesSummaryDto,
  PaginatedBudgetsResponseDto,
  PaginatedBudgetsWithTransactionsResponseDto,
  PaginatedCategoriesResponseDto,
  PaginatedIncomesResponseDto,
  PaginatedIncomesWithTransactionsResponseDto,
  PaginatedPotsResponseDto,
  PaginatedTransactionsResponseDto,
  PaginationMeta,
  PaginationParams,
  PotDto,
  PotsSummaryDto,
  TransactionDto,
  TransactionTypeDto,
} from "@/core/schemas";
import { budgets } from "./budgets";
import { categories } from "./categories";
import { incomes } from "./incomes";
import { pots } from "./pots";
import { transactions } from "./transactions";

type FilterableItem = Record<string, unknown>;
type ItemWithName = { name: string };

type PaginationResult<T> = {
  data: T[];
  meta: {
    pagination: PaginationMeta;
    sort?: PaginationParams["sort"];
    filters?: PaginationParams["filters"];
    search?: string;
  };
};

const DEFAULT_TRANSACTION_COUNT = 5;

export const applySearch = <T extends ItemWithName>(
  items: T[],
  search?: string
): T[] => {
  if (!search) return items;
  const searchLower = search.toLowerCase();
  return items.filter((item) => item.name.toLowerCase().includes(searchLower));
};

export const applyFilters = <T extends FilterableItem>(
  items: T[],
  filters?: PaginationParams["filters"]
): T[] => {
  if (!filters || filters.length === 0) return items;

  return items.filter((item) =>
    filters.every((filter) => {
      const value = item[filter.field];

      switch (filter.operator) {
        case "==":
          return value === filter.value;
        case "!=":
          return value !== filter.value;
        case ">":
          return typeof value === "number" && value > (filter.value as number);
        case ">=":
          return typeof value === "number" && value >= (filter.value as number);
        case "<":
          return typeof value === "number" && value < (filter.value as number);
        case "<=":
          return typeof value === "number" && value <= (filter.value as number);
        default:
          return true;
      }
    })
  );
};

export const applySorting = <T extends FilterableItem>(
  items: T[],
  sort?: PaginationParams["sort"]
): T[] => {
  if (!sort) return items;

  return [...items].sort((a, b) => {
    const aValue = a[sort.field];
    const bValue = b[sort.field];

    // Handle Date objects
    if (aValue instanceof Date && bValue instanceof Date) {
      const aTime = aValue.getTime();
      const bTime = bValue.getTime();
      return sort.order === "asc" ? aTime - bTime : bTime - aTime;
    }

    // Handle strings
    if (typeof aValue === "string" && typeof bValue === "string") {
      return sort.order === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    // Handle numbers
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sort.order === "asc" ? aValue - bValue : bValue - aValue;
    }

    return 0;
  });
};

export const calculatePaginationMeta = (
  totalItems: number,
  page: number,
  perPage: number
): PaginationMeta => {
  const totalPages = Math.ceil(totalItems / perPage);

  return {
    totalItems,
    page,
    perPage,
    totalPages,
    nextPage: page < totalPages ? page + 1 : null,
    previousPage: page > 1 ? page - 1 : null,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

export const paginateItems = <T extends FilterableItem>(
  items: T[],
  params: PaginationParams
): PaginationResult<T> => {
  const { pagination, sort, filters, search } = params;
  const { page, perPage } = pagination;

  const searchFiltered = applySearch(items as (T & ItemWithName)[], search);
  const filtered = applyFilters(searchFiltered, filters);
  const sorted = applySorting(filtered, sort);

  const offset = (page - 1) * perPage;
  const paginatedData = sorted.slice(offset, offset + perPage);

  return {
    data: paginatedData,
    meta: {
      pagination: calculatePaginationMeta(sorted.length, page, perPage),
      sort,
      filters,
      search,
    },
  };
};

export const calculateTotalFromTransactions = (
  transactionsList: TransactionDto[],
  type: TransactionTypeDto
): number => {
  if (!transactionsList || transactionsList.length === 0) return 0;

  return transactionsList
    .filter((transaction) => transaction && transaction.type === type)
    .reduce((sum, transaction) => sum + transaction.amount, 0);
};

export const getTransactionsByCategory = (
  categoryName: string,
  type: TransactionTypeDto,
  limit?: number
): TransactionDto[] => {
  const filtered = transactions.filter(
    (transaction) =>
      transaction.type === type &&
      transaction.category &&
      transaction.category.name === categoryName
  );

  return limit ? filtered.slice(0, limit) : filtered;
};

export const calculateCategoryTotal = (
  categoryName: string,
  type: TransactionTypeDto
): number => {
  return transactions
    .filter(
      (transaction) =>
        transaction.type === type &&
        transaction.category &&
        transaction.category.name === categoryName
    )
    .reduce((sum, transaction) => sum + transaction.amount, 0);
};

export const getBudget = (budgetId: string): BudgetDto | undefined => {
  return budgets.find((budget) => budget.id === budgetId);
};

export const getBudgetsCount = (): number => {
  return budgets.length;
};

export const getBudgetsSummary = (
  maxBudgetsToShow?: number
): BudgetsSummaryDto => {
  const totalSpending = calculateTotalFromTransactions(transactions, "expense");
  const totalMaxSpending = budgets.reduce(
    (sum, budget) => sum + budget.maximumSpending,
    0
  );

  const budgetsWithSpending = budgets
    .slice(0, maxBudgetsToShow)
    .map((budget) => ({
      ...budget,
      totalSpending: calculateCategoryTotal(budget.name, "expense"),
    }));

  return {
    totalSpending,
    totalMaxSpending,
    budgets: budgetsWithSpending,
    count: budgets.length,
  };
};

export const getPaginatedBudgets = (
  params: PaginationParams
): PaginatedBudgetsResponseDto => {
  return paginateItems(budgets, params);
};

export const getPaginatedBudgetsWithTransactions = (
  params: PaginationParams,
  transactionCount?: number
): PaginatedBudgetsWithTransactionsResponseDto => {
  const paginatedBudgets = getPaginatedBudgets(params);
  const maxTransactionCount = transactionCount || DEFAULT_TRANSACTION_COUNT;

  const budgetsWithTransactions = paginatedBudgets.data.map((budget) => ({
    ...budget,
    totalSpending: calculateCategoryTotal(budget.name, "expense"),
    transactions: getTransactionsByCategory(
      budget.name,
      "expense",
      maxTransactionCount
    ),
  }));

  return {
    ...paginatedBudgets,
    data: budgetsWithTransactions,
  };
};

export const listUsedBudgetColors = (): string[] => {
  return budgets.map((budget) => budget.colorTag);
};

export const getIncome = (incomeId: string): IncomeDto | undefined => {
  return incomes.find((income) => income.id === incomeId);
};

export const getIncomesCount = (): number => {
  return incomes.length;
};

export const getIncomesSummary = (
  maxIncomesToShow?: number
): IncomesSummaryDto => {
  const totalEarned = calculateTotalFromTransactions(transactions, "income");

  const incomesWithEarnings = incomes
    .slice(0, maxIncomesToShow)
    .map((income) => ({
      ...income,
      totalEarned: calculateCategoryTotal(income.name, "income"),
    }));

  return {
    totalEarned,
    incomes: incomesWithEarnings,
    count: incomes.length,
  };
};

export const getPaginatedIncomes = (
  params: PaginationParams
): PaginatedIncomesResponseDto => {
  return paginateItems(incomes, params);
};

export const getPaginatedIncomesWithTransactions = (
  params: PaginationParams,
  transactionCount?: number
): PaginatedIncomesWithTransactionsResponseDto => {
  const paginatedIncomes = getPaginatedIncomes(params);
  const maxTransactionCount = transactionCount || DEFAULT_TRANSACTION_COUNT;

  const incomesWithTransactions = paginatedIncomes.data.map((income) => ({
    ...income,
    totalEarned: calculateCategoryTotal(income.name, "income"),
    transactions: getTransactionsByCategory(
      income.name,
      "income",
      maxTransactionCount
    ),
  }));

  return {
    ...paginatedIncomes,
    data: incomesWithTransactions,
  };
};

export const listUsedIncomeColors = (): string[] => {
  return incomes.map((income) => income.colorTag);
};

export const getPaginatedCategories = (
  params: PaginationParams
): PaginatedCategoriesResponseDto => {
  return paginateItems(categories, params);
};

export const getPaginatedTransactions = (
  params: PaginationParams
): PaginatedTransactionsResponseDto => {
  console.log("params", params);
  return paginateItems(transactions, params);
};

export const getTransaction = (
  transactionId: string
): TransactionDto | undefined => {
  return transactions.find((transaction) => transaction.id === transactionId);
};

// Pots functions

export const getPaginatedPots = (
  params: PaginationParams
): PaginatedPotsResponseDto => {
  return paginateItems(pots, params);
};

export const getPot = (potId: string): PotDto | undefined => {
  return pots.find((pot) => pot.id === potId);
};

export const getPotsCount = (): number => {
  return pots.length;
};

export const getPotsSummary = (maxPotsToShow?: number): PotsSummaryDto => {
  return {
    pots: pots.slice(0, maxPotsToShow),
    totalSaved: pots.reduce((sum, pot) => sum + pot.totalSaved, 0),
    count: pots.length,
  };
};

export const listUsedPotColors = (): string[] => {
  return pots.map((pot) => pot.colorTag);
};
