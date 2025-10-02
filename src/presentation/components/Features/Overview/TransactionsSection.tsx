"use client";

import { TransactionEmoji } from "@/presentation/components/Features/Transactions";
import { cn } from "@/utils";
import { getTransactionsData } from "./_temp-data";
import { TitledCard } from "./TitledCard";

type TransactionsSectionProps = {
  className?: string;
};

export const TransactionsSection = ({
  className,
}: TransactionsSectionProps) => {
  const { recentTransactions } = getTransactionsData();

  return (
    <TitledCard title="Transactions" href="/transactions" className={className}>
      <div className="flex-1">
        <div>
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="border-grey-100 flex items-center gap-x-5 border-b py-5 first:pt-0 last:border-b-0 last:pb-0"
            >
              <TransactionEmoji emoji={transaction.emoji} />
              <p className="txt-preset-4-bold flex-1">{transaction.name}</p>
              <div className="flex flex-col items-end gap-2">
                <p
                  className={cn(
                    "txt-preset-4-bold",
                    transaction.amount > 0 && "text-secondary-green"
                  )}
                >
                  {transaction.amount > 0 ? "+" : ""}
                  {transaction.amount.toLocaleString()}
                </p>
                <p className="txt-preset-5 text-grey-500">{transaction.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </TitledCard>
  );
};
