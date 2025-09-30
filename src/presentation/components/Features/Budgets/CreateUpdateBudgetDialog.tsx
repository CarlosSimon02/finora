"use client";

import { BudgetDto, type CreateBudgetDto } from "@/core/schemas/budgetSchema";
import { Dialog } from "@/presentation/components/UI";
// import {
//   useCreateBudget,
//   useUpdateBudget,
// } from "@/presentation/hooks";
import { useState } from "react";
import { CreateUpdateBudgetForm } from "./CreateUpdateBudgetForm";

type CreateUpdateBudgetDialogProps = {
  title: string;
  description?: string;
  operation: "create" | "update";
  initialData?: BudgetDto;
  onSuccess?: (data: BudgetDto) => void;
  onError?: (error: Error) => void;
  onSettled?: () => void;
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
};

export const CreateUpdateBudgetDialog = ({
  title,
  description,
  operation,
  initialData,
  onSuccess,
  onError,
  onSettled,
  onClose,
  open: propsOpen,
  onOpenChange: propsOnOpenChange,
  children,
}: CreateUpdateBudgetDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = propsOpen !== undefined;
  const open = isControlled ? propsOpen : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    propsOnOpenChange?.(newOpen);

    if (!newOpen) {
      onClose?.();
    }
  };

  // const { mutateAsync: createBudget, isPending: isCreatingBudget } =
  //   useCreateBudget({
  //     onSuccess: (data: BudgetDto) => {
  //       handleOpenChange(false);
  //       onSuccess?.(data);
  //     },
  //     onError: (error: Error) => {
  //       onError?.(error);
  //     },
  //     onSettled: () => {
  //       onSettled?.();
  //     },
  //   });

  // const { mutateAsync: updateBudget, isPending: isUpdatingBudget } =
  //   useUpdateBudget({
  //     onSuccess: (data: BudgetDto) => {
  //       handleOpenChange(false);
  //       onSuccess?.(data);
  //     },
  //     onError: (error: Error) => {
  //       onError?.(error);
  //     },
  //     onSettled: () => {
  //       onSettled?.();
  //     },
  //   });

  const handleSubmit = async (data: CreateBudgetDto) => {
    // if (operation === "create") {
    //   await createBudget(data);
    // } else if (operation === "update" && initialData) {
    //   // Get only the changed fields to optimize network payload
    //   const changedFields = getChangedFields(
    //     initialData,
    //     data
    //   ) as UpdateBudgetDto;
    //   // Only proceed with update if there are actually changes
    //   if (!hasChanges(changedFields)) {
    //     // No changes detected, just close the dialog
    //     debugLog(
    //       "CreateUpdateTransactionDialog",
    //       "No changes detected, closing dialog"
    //     );
    //     handleOpenChange(false);
    //     return;
    //   }
    //   debugLog(
    //     "CreateUpdateTransactionDialog",
    //     "Updating transaction with changes:",
    //     changedFields
    //   );
    //   await updateBudget({
    //     id: initialData.id,
    //     data: changedFields,
    //   });
    // }
  };

  const isSubmitting = false;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
          {description && (
            <Dialog.Description>{description}</Dialog.Description>
          )}
        </Dialog.Header>
        <CreateUpdateBudgetForm
          onSubmit={handleSubmit}
          onCancel={() => handleOpenChange(false)}
          isSubmitting={isSubmitting}
          operation={operation}
          initialData={initialData as BudgetDto}
        />
      </Dialog.Content>
    </Dialog>
  );
};
