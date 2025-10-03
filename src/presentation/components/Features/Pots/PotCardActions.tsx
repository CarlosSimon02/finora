"use client";

import { PotDto } from "@/core/schemas/potSchema";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/presentation/components/Primitives";
import {
  ConfirmDeleteDialog,
  DropdownMenu,
} from "@/presentation/components/UI";
import { DotsThreeIcon } from "@phosphor-icons/react";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";
import { CreateUpdatePotDialog } from "./CreateUpdatePotDialog";

type PotCardActionsProps = {
  pot: PotDto;
  className?: string;
};

export const PotCardActions = ({ pot, className }: PotCardActionsProps) => {
  const utils = trpc.useUtils();

  const handleError = (error: unknown) => {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "Something went wrong";
    toast.error(message);
  };

  const { mutateAsync: deletePot, isPending: isDeleting } =
    trpc.deletePot.useMutation({
      onSuccess: () => {
        toast.success("Pot deleted successfully!");
        utils.getPaginatedPots.invalidate();
        utils.getPot.invalidate({ potId: pot.id });
      },
      onError: (err) => handleError(err),
    });

  const handleDelete = async () => {
    await deletePot({ potId: pot.id });
  };

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button
          variant="tertiary"
          iconOnly
          label="Open menu"
          icon={{ component: DotsThreeIcon, weight: "bold" }}
          className={className}
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <CreateUpdatePotDialog
          title="Edit Pot"
          operation="update"
          initialData={pot}
          onError={handleError}
        >
          <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
            Edit Pot
          </DropdownMenu.Item>
        </CreateUpdatePotDialog>
        <DropdownMenuSeparator />
        <ConfirmDeleteDialog
          title={`Delete '${pot.name}'`}
          description="Are you sure you want to delete this pot? This action cannot be reversed, and all the data inside it will be removed forever."
          onDelete={handleDelete}
          isDeleting={isDeleting}
        >
          <DropdownMenu.Item
            variant="destructive"
            onSelect={(e) => e.preventDefault()}
          >
            Delete Pot
          </DropdownMenu.Item>
        </ConfirmDeleteDialog>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
