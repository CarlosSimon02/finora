"use client";

import { TransactionDto } from "@/core/schemas";
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
import { CreateUpdateTransactionDialog } from "../CreateUpdateTransactionDialog";

type TransactionActionsProps = {
  transaction: TransactionDto;
  className?: string;
};

export const TransactionActions = ({
  transaction,
  className,
}: TransactionActionsProps) => {
  const utils = trpc.useUtils();

  const handleError = useErrorHandler();

  const { mutateAsync: deleteTransaction, isPending: isDeleting } =
    trpc.deleteTransaction.useMutation({
      onSuccess: async () => {
        toast.success("Transaction deleted successfully!");
        await utils.invalidate();
      },
      onError: handleError,
    });

  const handleDelete = async () => {
    await deleteTransaction({ transactionId: transaction.id });
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
        <CreateUpdateTransactionDialog
          title="Edit Transaction"
          operation="update"
          initialData={transaction}
          onError={handleError}
        >
          <DropdownMenu.Item onSelect={(e) => e.preventDefault()}>
            Edit Transaction
          </DropdownMenu.Item>
        </CreateUpdateTransactionDialog>
        <DropdownMenuSeparator />
        <ConfirmDeleteDialog
          title={`Delete '${transaction.name}'`}
          description="Are you sure you want to delete this transaction? This action cannot be reversed, and all the data inside it will be removed forever."
          onDelete={handleDelete}
          isDeleting={isDeleting}
        >
          <DropdownMenu.Item
            variant="destructive"
            onSelect={(e) => e.preventDefault()}
          >
            Delete Transaction
          </DropdownMenu.Item>
        </ConfirmDeleteDialog>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
};
