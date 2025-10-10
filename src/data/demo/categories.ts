import { CategoryDto } from "@/core/schemas";
import { budgets } from "./budgets";
import { incomes } from "./incomes";

const budgetCategories: CategoryDto[] = budgets.map((budget) => ({
  id: `budget_cat_${budget.id}`,
  name: budget.name,
  colorTag: budget.colorTag,
  createdAt: budget.createdAt,
  updatedAt: budget.updatedAt,
}));

const incomeCategories: CategoryDto[] = incomes.map((income) => ({
  id: `income_cat_${income.id}`,
  name: income.name,
  colorTag: income.colorTag,
  createdAt: income.createdAt,
  updatedAt: income.updatedAt,
}));

export const categories: CategoryDto[] = [
  ...budgetCategories,
  ...incomeCategories,
];

export const getBudgetCategories = (): CategoryDto[] => budgetCategories;
export const getIncomeCategories = (): CategoryDto[] => incomeCategories;

export const getCategoryByName = (name: string): CategoryDto | undefined => {
  return categories.find((cat) => cat.name === name);
};

export const isCategoryValid = (categoryName: string): boolean => {
  return categories.some((cat) => cat.name === categoryName);
};

export const getCategoryForExpense = (
  categoryName: string
): CategoryDto | undefined => {
  return budgetCategories.find((cat) => cat.name === categoryName);
};

export const getCategoryForIncome = (
  categoryName: string
): CategoryDto | undefined => {
  return incomeCategories.find((cat) => cat.name === categoryName);
};
