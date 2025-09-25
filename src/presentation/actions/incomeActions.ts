"use server";

import {
  IncomeDto,
  IncomesSummaryDto,
  PaginatedIncomesResponseDto,
  PaginatedIncomesWithTransactionsResponseDto,
  UpdateIncomeDto,
} from "@/core/schemas/incomeSchema";

import { CreateIncomeDto } from "@/core/schemas/incomeSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { createIncome } from "@/core/useCases/income/createIncome";
import { deleteIncome } from "@/core/useCases/income/deleteIncome";
import { getIncomesSummary } from "@/core/useCases/income/getIncomesSummary";
import { getPaginatedIncomes } from "@/core/useCases/income/getPaginatedIncomes";
import { getPaginatedIncomesWithTransactions } from "@/core/useCases/income/getPaginatedIncomesWithTransactions";
import { updateIncome } from "@/core/useCases/income/updateIncome";
import { IncomeRepository } from "@/data/repositories/incomeRepository";
import { actionWithAuth } from "@/utils/actionWithAuth";
import { cacheTags } from "@/utils/cacheTags";
import { unstable_cacheTag as cacheTag, revalidateTag } from "next/cache";

export const createIncomeAction = actionWithAuth<CreateIncomeDto, IncomeDto>(
  async ({ user, data }) => {
    const incomeRepository = new IncomeRepository();
    const createIncomeFn = createIncome(incomeRepository);
    const income = await createIncomeFn(user.id, data);
    return { data: income, error: null };
  }
);

export const deleteIncomeAction = actionWithAuth<string, void>(
  async ({ user, data }) => {
    const incomeRepository = new IncomeRepository();
    const deleteIncomeFn = deleteIncome(incomeRepository);
    await deleteIncomeFn(user.id, data);
    return { data: undefined, error: null };
  }
);

export const updateIncomeAction = actionWithAuth<
  { id: string; data: UpdateIncomeDto },
  IncomeDto
>(async ({ user, data }) => {
  const incomeRepository = new IncomeRepository();
  const updateIncomeFn = updateIncome(incomeRepository);
  const income = await updateIncomeFn(user.id, data.id, data.data);
  return { data: income, error: null };
});

export const getPaginatedIncomesAction = actionWithAuth<
  PaginationParams,
  PaginatedIncomesResponseDto
>(async ({ user, data }) => {
  "use cache";
  cacheTag(cacheTags.PAGINATED_INCOMES);

  const incomeRepository = new IncomeRepository();
  const getPaginatedIncomesFn = getPaginatedIncomes(incomeRepository);
  const response = await getPaginatedIncomesFn(user.id, data);
  return { data: response, error: null };
});

export const getPaginatedIncomesWithTransactionsAction = actionWithAuth<
  PaginationParams,
  PaginatedIncomesWithTransactionsResponseDto
>(async ({ user, data }) => {
  "use cache";
  cacheTag(cacheTags.PAGINATED_INCOMES_WITH_TRANSACTIONS);

  const incomeRepository = new IncomeRepository();
  const getPaginatedIncomesWithTransactionsFn =
    getPaginatedIncomesWithTransactions(incomeRepository);
  const response = await getPaginatedIncomesWithTransactionsFn(user.id, data);
  return { data: response, error: null };
});

export const getIncomesSummaryAction = actionWithAuth<
  number | undefined,
  IncomesSummaryDto
>(async ({ user, data }) => {
  "use cache";
  cacheTag(cacheTags.INCOMES_SUMMARY);

  const incomeRepository = new IncomeRepository();
  const getIncomesSummaryFn = getIncomesSummary(incomeRepository);
  const response = await getIncomesSummaryFn(user.id, data);
  return { data: response, error: null };
});

export const revalidateIncomeTags = async () => {
  revalidateTag(cacheTags.INCOMES_SUMMARY);
  revalidateTag(cacheTags.PAGINATED_INCOMES_WITH_TRANSACTIONS);
};
