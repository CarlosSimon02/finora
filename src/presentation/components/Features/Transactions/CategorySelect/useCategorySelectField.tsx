"use client";

import { BudgetDto } from "@/core/schemas/budgetSchema";
import { IncomeDto } from "@/core/schemas/incomeSchema";
import { PaginationParams } from "@/core/schemas/paginationSchema";
import { TransactionTypeDto } from "@/core/schemas/transactionSchema";
import { trpc } from "@/lib/trpc/client";
import { useCallback, useEffect, useState } from "react";
import {
  GroupBase,
  MultiValue,
  OptionsOrGroups,
  SingleValue,
} from "react-select";
import { CategoryOptionType } from "./types";

export const useCategoryOptions = (transactionType: TransactionTypeDto) => {
  const utils = trpc.useUtils();

  const loadOptions = useCallback(
    async (
      search: string,
      prevOptions: OptionsOrGroups<
        CategoryOptionType,
        GroupBase<CategoryOptionType>
      >,
      additional?: { page?: number }
    ) => {
      const limitPerPage = 10;
      const nextPage = additional?.page ?? 1;
      const params: PaginationParams = {
        sort: {
          field: "name",
          order: "asc",
        },
        pagination: {
          page: nextPage,
          perPage: limitPerPage,
        },
        filters: [],
        search,
      };

      const response =
        transactionType === "income"
          ? await utils.getPaginatedIncomes.fetch(params)
          : await utils.getPaginatedBudgets.fetch(params);

      const hasMore = response.meta.pagination.nextPage !== null;
      return {
        options:
          response.data.map((item) => ({
            value: item.id,
            label: item.name,
            colorTag: item.colorTag,
          })) ?? [],
        hasMore,
        additional: { page: hasMore ? nextPage + 1 : nextPage },
      };
    },
    [transactionType]
  );

  return { loadOptions };
};

export const useCategorySelection = (
  value: CategoryOptionType | null,
  onChange?: (category: CategoryOptionType | null) => void
) => {
  const [selectedOption, setSelectedOption] =
    useState<SingleValue<CategoryOptionType>>(null);

  const handleChange = useCallback(
    (
      newValue: MultiValue<CategoryOptionType> | SingleValue<CategoryOptionType>
    ) => {
      // Cast to SingleValue since this is a single-select component
      const singleValue = newValue as SingleValue<CategoryOptionType>;
      setSelectedOption(singleValue);
      onChange?.(singleValue);
    },
    [onChange]
  );

  useEffect(() => {
    if (!value) {
      setSelectedOption(null);
    } else if (
      value &&
      (!selectedOption || selectedOption.value !== value.value)
    ) {
      setSelectedOption(value);
    }
  }, [value, selectedOption]);

  return {
    selectedOption,
    setSelectedOption,
    handleChange,
  };
};

export const useCategoryDialogs = (transactionType: TransactionTypeDto) => {
  const [isAddingInProgress, setIsAddingInProgress] = useState(false);
  const [cacheUniq, setCacheUniq] = useState(0);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [isIncomeDialogOpen, setIsIncomeDialogOpen] = useState(false);
  const [initialDialogData, setInitialDialogData] = useState<{
    name: string;
  } | null>(null);
  const [pendingCallback, setPendingCallback] = useState<
    ((option: CategoryOptionType) => void) | null
  >(null);

  const handleIncomeSuccess = useCallback(
    (newCategory: IncomeDto) => {
      setIsAddingInProgress(false);
      setCacheUniq((prev) => prev + 1);
      setIsIncomeDialogOpen(false);
      setInitialDialogData(null);

      const newOption: CategoryOptionType = {
        value: newCategory.id,
        label: newCategory.name,
        colorTag: newCategory.colorTag,
      };

      if (pendingCallback) {
        pendingCallback(newOption);
        setPendingCallback(null);
      }
    },
    [pendingCallback]
  );

  const handleBudgetSuccess = useCallback(
    (newCategory: BudgetDto) => {
      setIsAddingInProgress(false);
      setCacheUniq((prev) => prev + 1);
      setIsBudgetDialogOpen(false);
      setInitialDialogData(null);

      const newOption: CategoryOptionType = {
        value: newCategory.id,
        label: newCategory.name,
        colorTag: newCategory.colorTag,
      };

      if (pendingCallback) {
        pendingCallback(newOption);
        setPendingCallback(null);
      }
    },
    [pendingCallback]
  );

  const handleDialogClose = useCallback(() => {
    setIsAddingInProgress(false);
    setIsBudgetDialogOpen(false);
    setIsIncomeDialogOpen(false);
    setInitialDialogData(null);
    setPendingCallback(null);
  }, []);

  const handleCreateOption = useCallback(
    (inputValue: string, onSuccess: (option: CategoryOptionType) => void) => {
      setIsAddingInProgress(true);
      setInitialDialogData({ name: inputValue });
      setPendingCallback(() => onSuccess);

      if (transactionType === "income") {
        setIsIncomeDialogOpen(true);
      } else {
        setIsBudgetDialogOpen(true);
      }
    },
    [transactionType]
  );

  useEffect(() => {
    setCacheUniq((prev) => prev + 1);
  }, [transactionType]);

  return {
    isAddingInProgress,
    cacheUniq,
    handleCreateOption,
    isBudgetDialogOpen,
    isIncomeDialogOpen,
    initialDialogData,
    handleBudgetSuccess,
    handleIncomeSuccess,
    handleDialogClose,
  };
};
