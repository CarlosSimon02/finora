"use client";

import { BudgetDto } from "@/core/schemas";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/presentation/components/Primitives";
import {
  ConfirmDeleteDialog,
  DropdownMenu,
} from "@/presentation/components/UI";
import { useErrorHandler } from "@/presentation/hooks";
import { DotsThreeIcon } from "@phosphor-icons/react";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { toast } from "sonner";
import { CreateUpdateBudgetDialog } from "./CreateUpdateBudgetDialog";

type BudgetCardActionsProps = {
  budget: BudgetDto;
  className?: string;
};

export const BudgetCardActions = ({
  budget,
  className,
}: BudgetCardActionsProps) => {
  const utils = trpc.useUtils();

  const handleError = useErrorHandler();

  const { mutateAsync: deleteBudget, isPending: isDeleting } =
    trpc.deleteBudget.useMutation({
      onSuccess: () => {
        toast.success("Pot deleted successfully!");
        utils.invalidate();
      },
      onError: handleError,
    });

  const handleDelete = async () => {
    await deleteBudget({ budgetId: budget.id });
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
        <CreateUpdateBudgetDialog
          title="Edit Budget"
          operation="update"
          initialData={budget}
          onError={handleError}
        >
          <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
            Edit Budget
          </DropdownMenu.Item>
        </CreateUpdateBudgetDialog>
        <DropdownMenuSeparator />
        <ConfirmDeleteDialog
          title={`Delete '${budget.name}'`}
          description="Are you sure you want to delete this budget? This action cannot be reversed, and all the data inside it will be removed forever."
          onDelete={handleDelete}
          isDeleting={isDeleting}
        >
          <DropdownMenu.Item
            variant="destructive"
            onSelect={(e) => e.preventDefault()}
          >
            Delete Budget
          </DropdownMenu.Item>
        </ConfirmDeleteDialog>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
