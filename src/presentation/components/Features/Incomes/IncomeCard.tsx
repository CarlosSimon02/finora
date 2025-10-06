"use client";

import { COLOR_OPTIONS } from "@/constants/colors";
import { IncomeWithTransactionsDto } from "@/core/schemas/incomeSchema";
import {
  Button,
  Card,
  InlineEmptyState,
} from "@/presentation/components/Primitives";
import { formatCurrency, formatDate } from "@/utils";
import { CaretRightIcon } from "@phosphor-icons/react";
import { TransactionEmoji } from "../Transactions";
import { IncomeCardActions } from "./IncomeCardActions";

interface IncomeCardProps {
  income: IncomeWithTransactionsDto;
}

export function IncomeCard({ income }: IncomeCardProps) {
  const transactions = income.transactions;

  return (
    <Card className="grid gap-5">
      <div className="flex flex-row items-center justify-between gap-10 pb-2">
        <div className="flex items-center gap-4">
          <div
            className="size-4 shrink-0 rounded-full"
            style={{ backgroundColor: income.colorTag }}
          />
          <h3 className="txt-preset-2">{income.name}</h3>
        </div>
        <IncomeCardActions income={income} className="shrink-0" />
      </div>

      <p className="txt-preset-4 text-grey-500">
        Total Earned:{" "}
        <span className="txt-preset-3">
          {formatCurrency(income.totalEarned)}
        </span>
      </p>

      <div className="bg-beige-100 space-y-5 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <h4 className="txt-preset-3">Latest Earnings</h4>
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
                      {formatCurrency(transaction.amount)}
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
                COLOR_OPTIONS.find((color) => color.value === income.colorTag)
                  ?.label
              }
            />
          )}
        </div>
      </div>
    </Card>
  );
}
