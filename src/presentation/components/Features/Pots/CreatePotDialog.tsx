"use client";

import { trpc } from "@/lib/trpc/client";
import {
  COLOR_OPTIONS,
  CreateButton,
  LimitHasReachedDialog,
} from "@/presentation/components/UI";
import { CreateUpdatePotDialog } from "./CreateUpdatePotDialog";

export const CreatePotDialog = () => {
  const { data: potsCount, isLoading } = trpc.getPotsCount.useQuery();

  if (isLoading) {
    return <CreateButton label="Add New Pot" isLoading />;
  }

  const count = potsCount ?? 0;
  const reachedLimit = count >= COLOR_OPTIONS.length;

  const button = <CreateButton label="Add New Pot" isLoading={false} />;

  const renderWithDialog = (child: React.ReactNode) =>
    reachedLimit ? (
      <LimitHasReachedDialog name="Pots">{child}</LimitHasReachedDialog>
    ) : (
      <CreateUpdatePotDialog title="Add New Pot" operation="create">
        {child}
      </CreateUpdatePotDialog>
    );

  return <>{renderWithDialog(button)}</>;
};
