"use client";

import { MoneyOperationInput, PotDto } from "@/core/schemas/potSchema";
import { trpc } from "@/lib/trpc/client";
import { CurrencyInput, Label } from "@/presentation/components/Primitives";
import { Dialog, LoadingButton } from "@/presentation/components/UI";
import { formatCurrency } from "@/utils";
import { useState } from "react";
import { toast } from "sonner";

type MoneyOperationDialogProps = {
  children: React.ReactNode;
  pot: PotDto;
  operation: "add" | "withdraw";
  onError?: (error: Error) => void;
};

export const MoneyOperationDialog = ({
  children,
  pot,
  operation,
  onError,
}: MoneyOperationDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState<number | null>(null);

  const utils = trpc.useUtils();

  const handleError = (error: unknown) => {
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "Something went wrong";
    toast.error(message);
    onError?.(error as Error);
  };

  const addMoneyMutation = trpc.addMoneyToPot.useMutation({
    onSuccess: () => {
      toast.success("Money added successfully!");
      setIsOpen(false);
      utils.getPaginatedPots.invalidate();
      utils.getPot.invalidate({ potId: pot.id });
    },
    onError: (err) => handleError(err),
  });

  const withdrawMoneyMutation = trpc.withdrawMoneyFromPot.useMutation({
    onSuccess: () => {
      toast.success("Money withdrawn successfully!");
      setIsOpen(false);
      utils.getPaginatedPots.invalidate();
      utils.getPot.invalidate({ potId: pot.id });
    },
    onError: (err) => handleError(err),
  });

  const isPending =
    addMoneyMutation.isPending || withdrawMoneyMutation.isPending;

  const safeTarget = Math.max(pot.target || 0, 1);
  const inputAmount = Math.max(0, amount ?? 0);
  const newAmount =
    operation === "add"
      ? pot.totalSaved + inputAmount
      : Math.max(0, pot.totalSaved - inputAmount);

  const currentPercentage = (pot.totalSaved / safeTarget) * 100;
  const newPercentage = (newAmount / safeTarget) * 100;
  const operationPercentage = Math.abs(newPercentage - currentPercentage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputAmount || inputAmount <= 0) return;

    const data: MoneyOperationInput = { amount: inputAmount };

    if (operation === "add") {
      await addMoneyMutation.mutateAsync({
        potId: pot.id,
        amount: inputAmount,
      } as any);
    } else {
      if (inputAmount > pot.totalSaved) {
        toast.error("Amount exceeds total saved in pot");
        return;
      }
      await withdrawMoneyMutation.mutateAsync({
        potId: pot.id,
        amount: inputAmount,
      } as any);
    }

    setAmount(null);
  };

  const getTitle = () =>
    operation === "add"
      ? `Add to '${pot.name}'`
      : `Withdraw from '${pot.name}'`;

  const getDescription = () =>
    operation === "add"
      ? "Add money to your pot to keep it separate from your main balance. As soon as you add this money, it will be deducted from your current balance."
      : "Withdraw from your pot to put money back in your main balance. This will reduce the amount you have in this pot.";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>{getTitle()}</Dialog.Title>
          <Dialog.Description>{getDescription()}</Dialog.Description>
        </Dialog.Header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="txt-preset-4">New Amount</Label>
              <span className="txt-preset-1">{formatCurrency(newAmount)}</span>
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

          <div className="space-y-2">
            <Label htmlFor="amount">
              {operation === "add" ? "Amount to Add" : "Amount to Withdraw"}
            </Label>
            <CurrencyInput
              id="amount"
              value={amount ?? ""}
              onValueChange={(values) => setAmount(values.floatValue ?? null)}
              thousandSeparator
              allowNegative={false}
              placeholder="0.00"
              disabled={isPending}
            />
          </div>

          <div className="flex gap-2">
            <LoadingButton
              type="submit"
              disabled={!inputAmount}
              isLoading={isPending}
              label={
                operation === "add" ? "Confirm Addition" : "Confirm Withdrawal"
              }
              loadingLabel={
                operation === "add" ? "Adding..." : "Withdrawing..."
              }
              className="flex-1"
            />
          </div>
        </form>
      </Dialog.Content>
    </Dialog>
  );
};
