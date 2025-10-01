import {
  BudgetDto,
  CreateBudgetDto,
  UpdateBudgetDto,
} from "@/core/schemas/budgetSchema";
import {
  createBudgetAction,
  deleteBudgetAction,
  getBudgetsSummaryAction,
  getPaginatedBudgetsWithTransactionsAction,
  updateBudgetAction,
} from "@/presentation/actions";
import { useMutationWithToast } from "./mutations";
import { createPaginationParams, useQueryWithDefaults } from "./queries";
import { StatusCallbacksType } from "./types";

export const useCreateBudget = ({
  onSuccess,
  onError,
  onSettled,
}: StatusCallbacksType<BudgetDto>) => {
  return useMutationWithToast({
    mutationFn: async (data: CreateBudgetDto) => {
      const response = await createBudgetAction(data);
      if (response.error) throw new Error(response.error);
      if (!response.data)
        throw new Error("No data returned from server action");
      return response.data;
    },
    successMessage: "Budget created successfully!",
    errorMessage: "Create budget failed",
    onSuccess,
    onError,
    onSettled,
  });
};

export const useDeleteBudget = ({
  onSuccess,
  onError,
  onSettled,
}: StatusCallbacksType<void>) => {
  return useMutationWithToast({
    mutationFn: async (data: string) => {
      const response = await deleteBudgetAction(data);
      if (response.error) throw new Error(response.error);
      return;
    },
    successMessage: "Budget deleted successfully!",
    errorMessage: "Delete budget failed",
    onSuccess,
    onError,
    onSettled,
  });
};

export const useUpdateBudget = ({
  onSuccess,
  onError,
  onSettled,
}: StatusCallbacksType<BudgetDto>) => {
  return useMutationWithToast({
    mutationFn: async (data: { id: string; data: UpdateBudgetDto }) => {
      const response = await updateBudgetAction(data);
      if (response.error) throw new Error(response.error);
      if (!response.data)
        throw new Error("No data returned from server action");
      return response.data;
    },
    successMessage: "Budget updated successfully!",
    errorMessage: "Update budget failed",
    onSuccess,
    onError,
    onSettled,
  });
};

export interface UseBudgetsWithTransactionsParams {
  search?: string;
  sortBy?: string;
  order?: string;
  page?: number;
  pageSize?: number;
}

export const useBudgetsWithTransactions = ({
  sortBy = "createdAt",
  order = "desc",
  page = 1,
  pageSize = 4,
}: UseBudgetsWithTransactionsParams) => {
  const params = createPaginationParams({
    search: "",
    sortBy,
    order: order as "asc" | "desc",
    page,
    pageSize,
  });

  const queryKey = ["budgets", params];

  return useQueryWithDefaults({
    queryKey,
    queryFn: async () => {
      const result = await getPaginatedBudgetsWithTransactionsAction(params);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
};

export const useBudgetsSummary = () => {
  const queryKey = ["budget-summary"];

  return useQueryWithDefaults({
    queryKey,
    queryFn: async () => {
      const result = await getBudgetsSummaryAction(undefined);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.data;
    },
  });
};
