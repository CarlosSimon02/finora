"use client";

import { Button } from "@/presentation/components/Primitives";
import { PlusIcon } from "@phosphor-icons/react";
import { CreateUpdateBudgetDialog } from "./CreateUpdateBudgetDialog";

export const CreateBudgetDialog = () => {
  return (
    <CreateUpdateBudgetDialog title="Add New Budget" operation="create">
      <Button
        icon={{ component: PlusIcon, weight: "bold" }}
        label="Add New Budget"
      />
    </CreateUpdateBudgetDialog>
  );
};
