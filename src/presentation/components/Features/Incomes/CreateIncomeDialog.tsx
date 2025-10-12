"use client";

import { trpc } from "@/lib/trpc/client";
import {
  COLOR_OPTIONS,
  CreateButton,
  LimitHasReachedDialog,
} from "@/presentation/components/UI";
import { CreateUpdateIncomeDialog } from "./CreateUpdateIncomeDialog";

export const CreateIncomeDialog = () => {
  const { data: incomesCount, isLoading } = trpc.getIncomesCount.useQuery();

  if (isLoading) {
    return <CreateButton label="Add New Income" isLoading />;
  }

  const count = incomesCount ?? 0;
  const reachedLimit = count >= COLOR_OPTIONS.length;

  const button = <CreateButton label="Add New Income" isLoading={false} />;

  const renderWithDialog = (child: React.ReactNode) =>
    reachedLimit ? (
      <LimitHasReachedDialog name="Incomes">{child}</LimitHasReachedDialog>
    ) : (
      <CreateUpdateIncomeDialog title="Add New Income" operation="create">
        {child}
      </CreateUpdateIncomeDialog>
    );

  return <>{renderWithDialog(button)}</>;
};
