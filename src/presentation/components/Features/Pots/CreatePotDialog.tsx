"use client";

import { trpc } from "@/lib/trpc/client";
import {
  COLOR_OPTIONS,
  LimitHasReachedDialog,
  LoadingButton,
} from "@/presentation/components/UI";
import { PlusIcon } from "@phosphor-icons/react";
import { CreateUpdatePotDialog } from "./CreateUpdatePotDialog";

export const CreatePotDialog = () => {
  const { data: potsCount, isLoading } = trpc.getPotsCount.useQuery();

  if (isLoading) {
    return (
      <LoadingButton
        icon={{ component: PlusIcon, weight: "bold" }}
        label="Add New Pot"
        isLoading
      />
    );
  }

  const count = potsCount ?? 0;
  const reachedLimit = count >= COLOR_OPTIONS.length;

  const button = (
    <LoadingButton
      icon={{ component: PlusIcon, weight: "bold" }}
      label="Add New Pot"
      isLoading={false}
    />
  );

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
