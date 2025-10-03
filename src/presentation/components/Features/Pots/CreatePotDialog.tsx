"use client";

import { Button } from "@/presentation/components/Primitives";
import { PlusIcon } from "@phosphor-icons/react";
import { CreateUpdatePotDialog } from "./CreateUpdatePotDialog";

export const CreatePotDialog = () => {
  return (
    <CreateUpdatePotDialog title="Add New Pot" operation="create">
      <Button
        icon={{ component: PlusIcon, weight: "bold" }}
        label="Add New Pot"
      />
    </CreateUpdatePotDialog>
  );
};
