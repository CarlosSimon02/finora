"use client";

import { BudgetWithTransactionsDto } from "@/core/schemas";
import { ColoredAmountItem } from "@/presentation/components/Primitives";
import { ItemCard } from "../../UI";
import { BudgetCardActions } from "./BudgetCardActions";

interface BudgetCardProps {
  budget: BudgetWithTransactionsDto;
}

export function BudgetCard({ budget }: BudgetCardProps) {
  const remaining =
    Math.abs(budget.maximumSpending) - Math.abs(budget.totalSpending);
  const percentSpent =
    (Math.abs(budget.totalSpending) / Math.abs(budget.maximumSpending)) * 100;
  const transactions = budget.transactions;

  return (
    <ItemCard>
      <ItemCard.Header
        name={budget.name}
        colorTag={budget.colorTag}
        actions={<BudgetCardActions budget={budget} />}
      />
      <div className="space-y-4">
        <p className="txt-preset-4 text-grey-500">
          Maximum of ₱{budget.maximumSpending.toLocaleString()}
        </p>
        <ItemCard.ProgressBar
          className="border-beige-100 h-8 rounded-lg border-4"
          percent={percentSpent}
          color={budget.colorTag}
        />
        <div className="grid grid-cols-2 gap-4">
          <ColoredAmountItem
            name="Spent"
            amount={budget.totalSpending}
            color={budget.colorTag}
          />
          <ColoredAmountItem
            name="Remaining"
            amount={remaining}
            color="var(--color-beige-100)"
          />
        </div>
      </div>
      <ItemCard.TransactionsList
        transactions={transactions}
        seeAllHref={`/budgets/${budget.id}`}
        title="Latest Spending"
      />
    </ItemCard>
  );
}
