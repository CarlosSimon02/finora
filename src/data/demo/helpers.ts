import { COLOR_OPTIONS } from "@/constants/colors";
import { CategoryDto, TransactionTypeDto } from "@/core/schemas";
import {
  getCategoryByName,
  getCategoryForExpense,
  getCategoryForIncome,
} from "./categories";

const FALLBACK_CATEGORY: CategoryDto = {
  id: "fallback_cat",
  name: "Uncategorized",
  colorTag: COLOR_OPTIONS[0].value,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const getSafeCategoryByName = (categoryName: string): CategoryDto => {
  const category = getCategoryByName(categoryName);

  if (!category) {
    console.warn(
      `Category "${categoryName}" not found. Using fallback category.`
    );
    return FALLBACK_CATEGORY;
  }

  return category;
};

export const getSafeCategoryForTransaction = (
  categoryName: string,
  transactionType: TransactionTypeDto
): CategoryDto => {
  const category =
    transactionType === "expense"
      ? getCategoryForExpense(categoryName)
      : getCategoryForIncome(categoryName);

  if (!category) {
    console.warn(
      `Category "${categoryName}" not found for ${transactionType} transaction. Using fallback category.`
    );
    return FALLBACK_CATEGORY;
  }

  return category;
};

export const validateCategoryExists = (
  categoryName: string,
  transactionType: TransactionTypeDto
): void => {
  const category =
    transactionType === "expense"
      ? getCategoryForExpense(categoryName)
      : getCategoryForIncome(categoryName);

  if (!category) {
    throw new Error(
      `Invalid category: "${categoryName}" does not exist in ${
        transactionType === "expense" ? "budgets" : "incomes"
      }`
    );
  }
};
