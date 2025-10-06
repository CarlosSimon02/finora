"use client";

import { COLOR_OPTIONS } from "@/constants/colors";
import { BudgetWithTransactionsDto } from "@/core/schemas/budgetSchema";
import {
  Button,
  Card,
  ColoredAmountItem,
  InlineEmptyState,
} from "@/presentation/components/Primitives";
import { formatCurrency, formatDate } from "@/utils";
import { CaretRightIcon } from "@phosphor-icons/react";
import { TransactionEmoji } from "../Transactions";
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
    <Card className="grid gap-5">
      <div className="flex flex-row items-center justify-between gap-10 pb-2">
        <div className="flex items-center gap-4">
          <div
            className="size-4 shrink-0 rounded-full"
            style={{ backgroundColor: budget.colorTag }}
          />
          <h3 className="txt-preset-2">{budget.name}</h3>
        </div>
        <BudgetCardActions budget={budget} className="shrink-0" />
      </div>
      <div className="space-y-4">
        <p className="txt-preset-4 text-grey-500">
          Maximum of ₱{budget.maximumSpending.toLocaleString()}
        </p>
        <div className="bg-beige-100 border-beige-100 h-8 w-full rounded-lg border-4">
          <div
            className="h-full rounded-lg"
            style={{
              width: `${Math.min(100, percentSpent)}%`,
              backgroundColor: budget.colorTag,
            }}
          />
        </div>
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
      <div className="bg-beige-100 space-y-5 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <h4 className="txt-preset-3">Latest Spending</h4>
          <Button
            variant="tertiary"
            label="See all"
            icon={{
              component: CaretRightIcon,
              weight: "fill",
              size: "sm",
              loc: "right",
            }}
          />
        </div>

        <div>
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="border-b-grey-500/20 border-b py-3 first:pt-0 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <TransactionEmoji
                      emoji={transaction.emoji}
                      className="bg-white"
                    />
                    <span className="txt-preset-5-bold">
                      {transaction.name}
                    </span>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="txt-preset-5-bold">
                      -{formatCurrency(transaction.amount)}
                    </p>
                    <p className="txt-preset-5 text-grey-500">
                      {formatDate(transaction.transactionDate, {
                        showTime: true,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <InlineEmptyState
              message="No transactions yet"
              color={
                COLOR_OPTIONS.find((color) => color.value === budget.colorTag)
                  ?.label
              }
            />
          )}
        </div>
      </div>
    </Card>
  );
}
