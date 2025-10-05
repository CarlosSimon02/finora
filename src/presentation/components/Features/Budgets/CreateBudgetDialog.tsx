"use client";

import { trpc } from "@/lib/trpc/client";
import {
  COLOR_OPTIONS,
  LimitHasReachedDialog,
  LoadingButton,
} from "@/presentation/components/UI";
import { PlusIcon } from "@phosphor-icons/react";
import { CreateUpdateBudgetDialog } from "./CreateUpdateBudgetDialog";

export const CreateBudgetDialog = () => {
  const { data: budgetsCount, isLoading } = trpc.getBudgetsCount.useQuery();

  if (isLoading) {
    return (
      <LoadingButton
        icon={{ component: PlusIcon, weight: "bold" }}
        label="Add New Budget"
        isLoading
      />
    );
  }

  const count = budgetsCount ?? 0;
  const reachedLimit = count >= COLOR_OPTIONS.length;

  const button = (
    <LoadingButton
      icon={{ component: PlusIcon, weight: "bold" }}
      label="Add New Budget"
      isLoading={false}
    />
  );

  const renderWithDialog = (child: React.ReactNode) =>
    reachedLimit ? (
      <LimitHasReachedDialog name="Budgets">{child}</LimitHasReachedDialog>
    ) : (
      <CreateUpdateBudgetDialog title="Add New Budget" operation="create">
        {child}
      </CreateUpdateBudgetDialog>
    );

  return <>{renderWithDialog(button)}</>;
};
