"use client";

import { MoneyOperationInput, PotDto } from "@/core/schemas/potSchema";
import { trpc } from "@/lib/trpc/client";
import { CurrencyInput } from "@/presentation/components/Primitives";
import { Dialog, Form, LoadingButton } from "@/presentation/components/UI";
import {
  useErrorHandler,
  useFormDialog,
  useUnsavedChangesGuard,
} from "@/presentation/hooks";
import { formatCurrency } from "@/utils";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type MoneyOperationDialogProps = {
  children: React.ReactNode;
  pot: PotDto;
  operation: "add" | "withdraw";
  onError?: (error: Error) => void;
};

type MoneyOperationFormValues = {
  amount: number | null;
};

export const MoneyOperationDialog = ({
  children,
  pot,
  operation,
  onError,
}: MoneyOperationDialogProps) => {
  const getDefaultValues = useCallback(
    (): MoneyOperationFormValues => ({
      amount: null,
    }),
    []
  );

  const form = useForm<MoneyOperationFormValues>({
    defaultValues: getDefaultValues(),
    mode: "onChange",
  });

  const utils = trpc.useUtils();

  const handleError = useErrorHandler({ onError });

  const addMoneyMutation = trpc.addMoneyToPot.useMutation({
    onSuccess: () => {
      toast.success("Money added successfully!");
      handleOpenChange(false);
      utils.invalidate();
    },
    onError: handleError,
  });

  const withdrawMoneyMutation = trpc.withdrawMoneyFromPot.useMutation({
    onSuccess: () => {
      toast.success("Money withdrawn successfully!");
      handleOpenChange(false);
      utils.invalidate();
    },
    onError: handleError,
  });

  const isPending =
    addMoneyMutation.isPending || withdrawMoneyMutation.isPending;

  const { open, handleOpenChange } = useFormDialog({
    form,
    getDefaultValues,
    isSubmitting: isPending,
  });

  useUnsavedChangesGuard({
    isDirty: form.formState.isDirty,
    isSubmitting: isPending,
  });

  const safeTarget = Math.max(pot.target || 0, 1);
  const inputAmount = Math.max(0, form.watch("amount") ?? 0);
  const exceedsLimit = operation === "withdraw" && inputAmount > pot.totalSaved;
  const newAmount =
    operation === "add"
      ? pot.totalSaved + inputAmount
      : Math.max(0, pot.totalSaved - inputAmount);

  const currentPercentage = (pot.totalSaved / safeTarget) * 100;
  const newPercentage = (newAmount / safeTarget) * 100;
  const operationPercentage = Math.abs(newPercentage - currentPercentage);

  const handleSubmit = async ({ amount }: MoneyOperationFormValues) => {
    const amt = Math.max(0, amount ?? 0);

    if (!amt) {
      form.setError("amount", { type: "validate", message: "Enter an amount" });
      return;
    }

    if (operation === "withdraw" && amt > pot.totalSaved) {
      form.setError("amount", {
        type: "validate",
        message: `Cannot withdraw more than available (${formatCurrency(pot.totalSaved)})`,
      });
      return;
    }

    if (amt === 0) {
      toast.info("No changes to apply");
      return;
    }

    const data: MoneyOperationInput = { amount: amt };

    if (operation === "add") {
      await addMoneyMutation.mutateAsync({
        potId: pot.id,
        data: { amount: amt },
      });
    } else {
      await withdrawMoneyMutation.mutateAsync({
        potId: pot.id,
        data: { amount: amt },
      });
    }

    form.reset();
  };

  const getTitle = () =>
    operation === "add"
      ? `Add to '${pot.name}'`
      : `Withdraw from '${pot.name}'`;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>{getTitle()}</Dialog.Title>
          <Dialog.Description>
            {operation === "add"
              ? "Add money to your pot to keep it separate from your main balance. As soon as you add this money, it will be deducted from your current balance."
              : "Withdraw from your pot to put money back in your main balance. This will reduce the amount you have in this pot."}
          </Dialog.Description>
        </Dialog.Header>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="txt-preset-4">New Amount</span>
                <span className="txt-preset-1">
                  {formatCurrency(newAmount)}
                </span>
              </div>

              <div className="space-y-2">
                <div className="bg-beige-100 relative h-2 w-full rounded-full">
                  <div
                    className="absolute top-0 left-0 h-2 rounded-full"
                    style={{
                      width: `${Math.min(100, currentPercentage)}%`,
                      backgroundColor: pot.colorTag,
                    }}
                  />
                  {inputAmount > 0 && (
                    <div
                      className={`absolute top-0 h-2 rounded-full ${
                        operation === "add"
                          ? "bg-secondary-green"
                          : "bg-secondary-red"
                      }`}
                      style={{
                        left:
                          operation === "add"
                            ? `${Math.min(100, currentPercentage)}%`
                            : `${Math.min(100, newPercentage)}%`,
                        width: `${Math.min(
                          100 -
                            (operation === "add"
                              ? currentPercentage
                              : newPercentage),
                          operationPercentage
                        )}%`,
                      }}
                    />
                  )}
                </div>
                <div className="txt-preset-5 text-grey-500 flex justify-between">
                  <span className="txt-preset-5-bold">
                    {newPercentage.toFixed(1)}%
                  </span>
                  <span>Target of {formatCurrency(safeTarget)}</span>
                </div>
              </div>
            </div>

            <Form.InputField
              control={form.control}
              name="amount"
              label={
                operation === "add" ? "Amount to Add" : "Amount to Withdraw"
              }
              rules={{
                validate: (value) => {
                  const amt = Math.max(0, value ?? 0);
                  if (operation === "withdraw" && amt > pot.totalSaved) {
                    return `Cannot withdraw more than available (${formatCurrency(pot.totalSaved)})`;
                  }
                  return true;
                },
              }}
              inputComponent={({ field }) => (
                <CurrencyInput
                  id="amount"
                  value={field.value ?? ""}
                  onValueChange={(values) =>
                    field.onChange(values.floatValue ?? null)
                  }
                  onBlur={field.onBlur}
                  thousandSeparator
                  allowNegative={false}
                  placeholder="0.00"
                  disabled={isPending}
                  aria-invalid={exceedsLimit}
                />
              )}
            />

            <div className="flex gap-2">
              <LoadingButton
                type="submit"
                disabled={!inputAmount || !!form.formState.errors.amount}
                isLoading={isPending}
                label={
                  operation === "add"
                    ? "Confirm Addition"
                    : "Confirm Withdrawal"
                }
                loadingLabel={
                  operation === "add" ? "Adding..." : "Withdrawing..."
                }
                className="flex-1"
              />
            </div>
          </form>
        </Form>
      </Dialog.Content>
    </Dialog>
  );
};
