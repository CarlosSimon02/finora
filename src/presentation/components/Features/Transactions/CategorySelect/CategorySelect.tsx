"use client";

import { TransactionTypeDto } from "@/core/schemas/transactionSchema";
import { CreateUpdateBudgetDialog } from "@/presentation/components/Features/Budgets";
import { CreateUpdateIncomeDialog } from "@/presentation/components/Features/Incomes";
import {
  createRSSharedComponents,
  rsMenuBase,
} from "@/presentation/components/Primitives/ReactSelect/ReactSelect";
import { ReactElement, useCallback } from "react";
import { RefCallBack } from "react-hook-form";
import { GroupBase } from "react-select";
import {
  ComponentProps,
  UseAsyncPaginateParams,
  withAsyncPaginate,
} from "react-select-async-paginate";
import type { CreatableProps } from "react-select/creatable";
import Creatable from "react-select/creatable";
import { CategoryOptionType } from "./types";
import {
  useCategoryDialogs,
  useCategoryOptions,
  useCategorySelection,
} from "./useCategorySelectField";

type CategorySelectProps = {
  value: CategoryOptionType | null;
  onChange: (category: CategoryOptionType | null) => void;
  transactionType: TransactionTypeDto;
  disabled?: boolean;
  selectRef: RefCallBack;
  "aria-invalid"?: boolean;
};

type Additional = {
  page: number;
};

type AsyncPaginateCreatableProps<
  OptionType,
  Group extends GroupBase<OptionType>,
  IsMulti extends boolean,
> = CreatableProps<OptionType, IsMulti, Group> &
  UseAsyncPaginateParams<OptionType, Group, Additional> &
  ComponentProps<OptionType, Group, IsMulti>;

type AsyncPaginateCreatableType = <
  OptionType,
  Group extends GroupBase<OptionType>,
  IsMulti extends boolean = false,
>(
  props: AsyncPaginateCreatableProps<OptionType, Group, IsMulti>
) => ReactElement;

const CreatableAsyncPaginate = withAsyncPaginate(
  Creatable
) as AsyncPaginateCreatableType;

const CategoryOptionLabel = ({ label, colorTag }: CategoryOptionType) => (
  <div className="flex items-center gap-3">
    {colorTag && (
      <div
        className="size-4 rounded-full"
        style={{ backgroundColor: colorTag }}
      />
    )}
    <div>{label}</div>
  </div>
);

export const CategorySelect = ({
  value,
  onChange,
  transactionType,
  disabled,
  selectRef,
  "aria-invalid": ariaInvalid,
}: CategorySelectProps) => {
  const { loadOptions } = useCategoryOptions(transactionType);
  const {
    isAddingInProgress,
    cacheUniq,
    handleCreateOption,
    isBudgetDialogOpen,
    isIncomeDialogOpen,
    initialDialogData,
    handleBudgetSuccess,
    handleIncomeSuccess,
    handleDialogClose,
  } = useCategoryDialogs(transactionType);
  const { selectedOption, setSelectedOption, handleChange } =
    useCategorySelection(value, onChange);

  const onCreateOption = useCallback(
    (inputValue: string) => {
      handleCreateOption(inputValue, (newOption) => {
        setSelectedOption(newOption);
        onChange(newOption);
      });
    },
    [handleCreateOption, setSelectedOption, onChange]
  );

  const categoryType = transactionType === "income" ? "income" : "budget";
  const placeholder = `Select or create a ${categoryType} category`;

  const components = createRSSharedComponents<
    CategoryOptionType,
    false,
    GroupBase<CategoryOptionType>
  >(ariaInvalid);

  return (
    <>
      <CreatableAsyncPaginate
        menuPlacement="auto"
        menuPosition="fixed"
        isDisabled={isAddingInProgress || disabled}
        value={selectedOption}
        loadOptions={loadOptions}
        onCreateOption={onCreateOption}
        onChange={handleChange}
        cacheUniqs={[transactionType, cacheUniq]}
        formatOptionLabel={CategoryOptionLabel}
        placeholder={placeholder}
        selectRef={selectRef}
        additional={{ page: 1 }}
        defaultOptions
        components={{
          Control: components.Control,
          DropdownIndicator: components.DropdownIndicator,
          IndicatorSeparator: components.IndicatorSeparator,
          ValueContainer: components.ValueContainer,
          SingleValue: components.SingleValue,
          Placeholder: components.Placeholder,
          Menu: components.Menu,
          MenuList: components.MenuList,
          Option: components.Option,
          LoadingMessage: components.LoadingMessage,
        }}
        styles={{
          menu: () => ({}),
        }}
        classNames={{
          menu: () => rsMenuBase,
        }}
      />

      <CreateUpdateBudgetDialog
        title="Create New Budget"
        description="Create a new budget to track your spending."
        operation="create"
        initialData={initialDialogData || undefined}
        open={isBudgetDialogOpen}
        onOpenChange={(open: boolean) => {
          if (!open) {
            handleDialogClose();
          }
        }}
        onSuccess={handleBudgetSuccess}
        onClose={handleDialogClose}
      />

      <CreateUpdateIncomeDialog
        title="Create New Income"
        description="Create a new income category to track your earnings."
        operation="create"
        initialData={initialDialogData || undefined}
        open={isIncomeDialogOpen}
        onOpenChange={(open: boolean) => {
          if (!open) {
            handleDialogClose();
          }
        }}
        onSuccess={handleIncomeSuccess}
        onClose={handleDialogClose}
      />
    </>
  );
};
