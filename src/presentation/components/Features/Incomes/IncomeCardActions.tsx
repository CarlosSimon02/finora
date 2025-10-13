"use client";

import { IncomeDto } from "@/core/schemas";
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
import { CreateUpdateIncomeDialog } from "./CreateUpdateIncomeDialog";

type IncomeCardActionsProps = {
  income: IncomeDto;
  className?: string;
};

export const IncomeCardActions = ({
  income,
  className,
}: IncomeCardActionsProps) => {
  const utils = trpc.useUtils();

  const handleError = useErrorHandler();

  const { mutateAsync: deleteIncome, isPending: isDeleting } =
    trpc.deleteIncome.useMutation({
      onSuccess: async () => {
        toast.success("Income deleted successfully!");
        await utils.invalidate();
      },
      onError: handleError,
    });

  const handleDelete = async () => {
    await deleteIncome({ incomeId: income.id });
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
        <CreateUpdateIncomeDialog
          title="Edit Income"
          operation="update"
          initialData={income}
          onError={handleError}
        >
          <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
            Edit Income
          </DropdownMenu.Item>
        </CreateUpdateIncomeDialog>
        <DropdownMenuSeparator />
        <ConfirmDeleteDialog
          title={`Delete '${income.name}'`}
          description="Are you sure you want to delete this income? This action cannot be reversed."
          onDelete={handleDelete}
          isDeleting={isDeleting}
        >
          <DropdownMenu.Item
            variant="destructive"
            onSelect={(e) => e.preventDefault()}
          >
            Delete Income
          </DropdownMenu.Item>
        </ConfirmDeleteDialog>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
