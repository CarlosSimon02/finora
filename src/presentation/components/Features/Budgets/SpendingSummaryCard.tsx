"use client";

import { BudgetsSummaryDto } from "@/core/schemas/budgetSchema";
import { Card } from "@/presentation/components/Primitives";
import { cn, formatCurrency } from "@/utils";
import { BudgetChart } from "./BudgetChart";

type SpendingSummaryCardProps = {
  budgetsSummary: BudgetsSummaryDto;
  className?: string;
};

export const SpendingSummaryCard = ({
  budgetsSummary,
  className,
}: SpendingSummaryCardProps) => {
  return (
    <Card className={cn("grid gap-8", className)}>
      <div className="flex justify-center py-5">
        <BudgetChart
          budgetData={budgetsSummary.budgets}
          totalLimit={Math.abs(budgetsSummary.totalMaxSpending)}
          totalSpent={Math.abs(budgetsSummary.totalSpending)}
        />
      </div>
      <div className="space-y-6">
        <div>
          <h2 className="txt-preset-2">Spending Summary</h2>
        </div>
        <div>
          {budgetsSummary.budgets.map((budget, index) => (
            <div
              key={budget.id}
              className="text-grey-500 border-b-grey-100 flex items-center justify-between border-b py-4 first:pt-0 last:border-b-0 last:pb-0"
            >
              <div className="flex shrink-0 items-center gap-4">
                <div
                  className="h-6 w-1 rounded-full"
                  style={{ backgroundColor: budget.colorTag }}
                />
                <span className="txt-preset-4">{budget.name}</span>
              </div>
              <div className="txt-preset-5 text-right">
                <span className="txt-preset-3 text-grey-900 mr-1">
                  {formatCurrency(budget.totalSpending, { showDecimal: false })}
                </span>
                <span className="text-muted-foreground">
                  {" "}
                  of{" "}
                  {formatCurrency(budget.maximumSpending, {
                    showDecimal: false,
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
