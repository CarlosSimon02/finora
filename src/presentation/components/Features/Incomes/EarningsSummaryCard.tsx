"use client";

import { IncomesSummaryDto } from "@/core/schemas";
import { Card } from "@/presentation/components/Primitives";
import { IncomeChart } from "@/presentation/components/UI";
import { cn, formatCurrency } from "@/utils";

type EarningsSummaryCardProps = {
  incomesSummary: IncomesSummaryDto;
  className?: string;
};

export const EarningsSummaryCard = ({
  incomesSummary,
  className,
}: EarningsSummaryCardProps) => {
  return (
    <Card className={cn("grid gap-8", className)}>
      {incomesSummary.totalEarned > 0 && (
        <div className="flex justify-center py-5">
          <IncomeChart
            incomeData={incomesSummary.incomes}
            totalEarned={Math.abs(incomesSummary.totalEarned)}
          />
        </div>
      )}
      <div className="space-y-6">
        <div>
          <h2 className="txt-preset-2">Earnings Summary</h2>
        </div>
        <div>
          {incomesSummary.incomes.map((income) => (
            <div
              key={income.id}
              className="text-grey-500 border-b-grey-100 flex items-center justify-between border-b py-4 first:pt-0 last:border-b-0 last:pb-0"
            >
              <div className="flex shrink-0 items-center gap-4">
                <div
                  className="h-6 w-1 rounded-full"
                  style={{ backgroundColor: income.colorTag }}
                />
                <span className="txt-preset-4">{income.name}</span>
              </div>
              <div className="txt-preset-5 text-right">
                <span className="txt-preset-3 text-grey-900 mr-1">
                  {formatCurrency(income.totalEarned, { showDecimal: false })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
