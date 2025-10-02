"use client";

import { Card } from "@/presentation/components/Primitives";
import { cn, formatCurrency } from "@/utils";

type SummarySectionProps = {
  className?: string;
  balance?: number;
  income?: number;
  expenses?: number;
};

export const SummarySection = ({
  className,
  balance = 0,
  income = 0,
  expenses = 0,
}: SummarySectionProps) => {
  return (
    <div className={cn("grid grid-cols-1 gap-5 @3xl:grid-cols-3", className)}>
      <Card variant="secondary">
        <div className="space-y-3">
          <p className="txt-preset-4">Current Balance</p>
          <p className="txt-preset-1 break-all">{formatCurrency(balance)}</p>
        </div>
      </Card>

      <Card>
        <div className="space-y-3">
          <p className="txt-preset-4">Income</p>
          <p className="txt-preset-1 break-all">{formatCurrency(income)}</p>
        </div>
      </Card>

      <Card>
        <div className="space-y-3">
          <p className="txt-preset-4">Expenses</p>
          <p className="txt-preset-1 break-all">{formatCurrency(expenses)}</p>
        </div>
      </Card>
    </div>
  );
};
