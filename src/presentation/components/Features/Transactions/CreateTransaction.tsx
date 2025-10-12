"use client";

import { CreateButton } from "@/presentation/components/UI";
import { CreateUpdateTransactionDialog } from "./CreateUpdateTransactionDialog";

export const CreateTransactionDialog = () => {
  return (
    <CreateUpdateTransactionDialog
      title="Add New Transaction"
      operation="create"
    >
      <CreateButton label="Add New Transaction" />
    </CreateUpdateTransactionDialog>
  );
};
