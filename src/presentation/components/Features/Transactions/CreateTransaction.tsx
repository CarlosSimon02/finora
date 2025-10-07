"use client";

import { Button } from "@/presentation/components/Primitives";
import { PlusIcon } from "@phosphor-icons/react";
import { CreateUpdateTransactionDialog } from "./CreateUpdateTransactionDialog";

export const CreateTransactionDialog = () => {
  return (
    <CreateUpdateTransactionDialog
      title="Add New Transaction"
      operation="create"
    >
      <Button
        icon={{ component: PlusIcon, weight: "bold" }}
        label="Add New Transaction"
      />
    </CreateUpdateTransactionDialog>
  );
};
