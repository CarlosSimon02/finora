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
  const { data: potsCount, isLoading: isLoadingPotsCount } =
    trpc.getPotsCount.useQuery();

  const AddPotButton = () => (
    <LoadingButton
      icon={{ component: PlusIcon, weight: "bold" }}
      label="Add New Pot"
      isLoading={isLoadingPotsCount}
    />
  );

  if (isLoadingPotsCount) {
    return <AddPotButton />;
  }

  if (potsCount && potsCount >= COLOR_OPTIONS.length) {
    return (
      <LimitHasReachedDialog name="Pots">
        <AddPotButton />
      </LimitHasReachedDialog>
    );
  }

  return (
    <CreateUpdatePotDialog title="Add New Pot" operation="create">
      <AddPotButton />
    </CreateUpdatePotDialog>
  );
};
