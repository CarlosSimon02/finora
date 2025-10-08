"use client";

import { TransactionDto } from "@/core/schemas";
import MobileTransactionCard from "./MobileTransactionCard";
import TransactionRow from "./TransactionRow";
import TransactionsTableHeader from "./TransactionsTableHeader";

type TransactionsTableProps = {
  transactions: TransactionDto[];
};

export const TransactionsTable = ({ transactions }: TransactionsTableProps) => {
  return (
    <div className="@container/transactions">
      {/* Desktop View */}
      <div className="block @max-3xl/transactions:hidden">
        <table className="w-full">
          <TransactionsTableHeader />
          <tbody>
            {transactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className="hidden @max-3xl/transactions:block">
        {transactions.map((transaction) => (
          <MobileTransactionCard
            key={transaction.id}
            transaction={transaction}
          />
        ))}
      </div>
    </div>
  );
};
