import { revalidateTag } from "next/cache";

export const cacheTags = {
  // Transactions
  PAGINATED_TRANSACTIONS: "PAGINATED_TRANSACTIONS",
  PAGINATED_CATEGORIES: "PAGINATED_CATEGORIES",
  TRANSACTION: "TRANSACTION",
  // Budgets
  PAGINATED_BUDGETS_WITH_TRANSACTIONS: "PAGINATED_BUDGETS_WITH_TRANSACTIONS",
  PAGINATED_BUDGETS: "PAGINATED_BUDGETS",
  BUDGET: "BUDGET",
  BUDGETS_SUMMARY: "BUDGETS_SUMMARY",
  BUDGETS_COUNT: "BUDGETS_COUNT",
  BUDGETS_USED_COLORS: "BUDGETS_USED_COLORS",
  // Incomes
  PAGINATED_INCOMES: "PAGINATED_INCOMES",
  PAGINATED_INCOMES_WITH_TRANSACTIONS: "PAGINATED_INCOMES_WITH_TRANSACTIONS",
  INCOME: "INCOME",
  INCOMES_SUMMARY: "INCOMES_SUMMARY",
  INCOMES_COUNT: "INCOMES_COUNT",
  INCOMES_USED_COLORS: "INCOMES_USED_COLORS",
  // Pots
  PAGINATED_POTS: "PAGINATED_POTS",
  POTS_SUMMARY: "POTS_SUMMARY",
  POTS_COUNT: "POTS_COUNT",
  POTS_USED_COLORS: "POTS_USED_COLORS",
} as const;

export const revalidateTransactionsCache = () => {
  revalidateTag(cacheTags.PAGINATED_TRANSACTIONS);
  revalidateTag(cacheTags.PAGINATED_CATEGORIES);
  revalidateTag(cacheTags.TRANSACTION);
};

export const revalidateBudgetsCache = () => {
  revalidateTag(cacheTags.PAGINATED_BUDGETS_WITH_TRANSACTIONS);
  revalidateTag(cacheTags.PAGINATED_BUDGETS);
  revalidateTag(cacheTags.BUDGET);
  revalidateTag(cacheTags.BUDGETS_SUMMARY);
  revalidateTag(cacheTags.BUDGETS_COUNT);
  revalidateTag(cacheTags.BUDGETS_USED_COLORS);
};

export const revalidateIncomesCache = () => {
  revalidateTag(cacheTags.PAGINATED_INCOMES_WITH_TRANSACTIONS);
  revalidateTag(cacheTags.PAGINATED_INCOMES);
  revalidateTag(cacheTags.INCOME);
  revalidateTag(cacheTags.INCOMES_SUMMARY);
  revalidateTag(cacheTags.INCOMES_COUNT);
  revalidateTag(cacheTags.INCOMES_USED_COLORS);
};

export const revalidatePotsCache = () => {
  revalidateTag(cacheTags.PAGINATED_POTS);
  revalidateTag(cacheTags.POTS_SUMMARY);
  revalidateTag(cacheTags.POTS_COUNT);
  revalidateTag(cacheTags.POTS_USED_COLORS);
};
