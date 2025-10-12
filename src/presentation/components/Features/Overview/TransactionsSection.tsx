"use client";

import { TransactionDto } from "@/core/schemas";
import {
  InlineEmptyState,
  TransactionItem,
} from "@/presentation/components/Primitives";
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
      <div className="@container/transactions grid flex-1 content-center">
        {transactions.length > 0 ? (
          <div>
            {transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        ) : (
          <InlineEmptyState
            message="No transactions found"
            color="Army Green"
          />
        )}
      </div>
    </TitledCard>
  );
};
