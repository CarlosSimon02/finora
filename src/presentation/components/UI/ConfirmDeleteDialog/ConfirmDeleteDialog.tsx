"use client";

import { Button } from "@/presentation/components/Primitives";
import { Dialog, LoadingButton } from "@/presentation/components/UI";
import { useState } from "react";

export type ConfirmDeleteDialogProps = {
  title: string;
  description: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
  children: React.ReactNode;
};

export const ConfirmDeleteDialog = ({
  title,
  description,
  open: propsOpen,
  onOpenChange: propsOnOpenChange,
  onDelete,
  isDeleting,
  children,
}: ConfirmDeleteDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = propsOpen !== undefined;
  const open = isControlled ? propsOpen : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    propsOnOpenChange?.(newOpen);
  };

  const handleDelete = async () => {
    await onDelete();
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>{description}</Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer className="gap-5">
          <Button
            variant="tertiary"
            onClick={() => handleOpenChange(false)}
            label="No, Go Back"
          />
          <LoadingButton
            variant="destructive"
            onClick={handleDelete}
            isLoading={isDeleting}
            label={isDeleting ? "Deleting..." : "Yes, Confirm Deletion"}
          />
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
};
