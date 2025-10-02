"use client";

import { TransactionDto } from "@/core/schemas";
import { TransactionEmoji } from "@/presentation/components/Features/Transactions";
import { EmptyState } from "@/presentation/components/Primitives";
import { cn, formatCurrency } from "@/utils";
import { TitledCard } from "./TitledCard";

type TransactionsSectionProps = {
  className?: string;
  transactions?: TransactionDto[];
};

export const TransactionsSection = ({
  className,
  transactions = [],
}: TransactionsSectionProps) => {
  return (
    <TitledCard title="Transactions" href="/transactions" className={className}>
      <div className="@container/transactions flex-1">
        {transactions.length > 0 ? (
          <div>
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="border-grey-100 flex items-center gap-x-5 gap-y-2 border-b py-5 first:pt-0 last:border-b-0 last:pb-0 @max-3xs/transactions:flex-col"
              >
                <div className="flex flex-1 items-center gap-x-5">
                  <TransactionEmoji
                    emoji={transaction.emoji}
                    className="shrink-0"
                  />
                  <p className="txt-preset-4-bold max-w-[50ch] break-words">
                    {transaction.name}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 break-all @max-3xs/transactions:self-end">
                  <p
                    className={cn(
                      "txt-preset-4-bold",
                      transaction.amount > 0 && "text-secondary-green"
                    )}
                  >
                    {formatCurrency(transaction.amount, true)}
                  </p>
                  <p className="txt-preset-5 text-grey-500">
                    {formatDate(transaction.transactionDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState message="No transactions found" color="Army Green" />
        )}
      </div>
    </TitledCard>
  );
};
