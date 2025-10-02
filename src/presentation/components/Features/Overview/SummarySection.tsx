"use client";

import { Card } from "@/presentation/components/UI";
import { cn } from "@/utils";
import { getSummaryData } from "./_temp-data";

type SummarySectionProps = {
  className?: string;
};

export const SummarySection = ({ className }: SummarySectionProps) => {
  const { balance, income, expenses } = getSummaryData();

  return (
    <div className={cn("grid grid-cols-1 gap-4 @3xl:grid-cols-3", className)}>
      <Card variant="secondary">
        <div className="space-y-3">
          <p className="txt-preset-4">Current Balance</p>
          <p className="txt-preset-1">₱{balance.toLocaleString()}</p>
        </div>
      </Card>

      <Card>
        <div className="space-y-3">
          <p className="txt-preset-4">Income</p>
          <p className="txt-preset-1">₱{income.toLocaleString()}</p>
        </div>
      </Card>

      <Card>
        <div className="space-y-3">
          <p className="txt-preset-4">Expenses</p>
          <p className="txt-preset-1">₱{expenses.toLocaleString()}</p>
        </div>
      </Card>
    </div>
  );
};
