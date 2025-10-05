"use client";

import { BudgetsSummaryDto } from "@/core/schemas/budgetSchema";
import { Card } from "@/presentation/components/Primitives";
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
    <Card className={className}>
      <div>
        <h2>Spending Summary</h2>
      </div>
      <div className="space-y-6">
        <div className="flex justify-center">
          <BudgetChart
            budgetData={budgetsSummary.budgets}
            totalLimit={Math.abs(budgetsSummary.totalMaxSpending)}
            totalSpent={Math.abs(budgetsSummary.totalSpending)}
          />
        </div>

        <div className="space-y-4">
          {budgetsSummary.budgets.map((budget, index) => (
            <div key={budget.id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-12 w-1 rounded-full"
                    style={{ backgroundColor: budget.colorTag }}
                  />
                  <span className="font-medium">{budget.name}</span>
                </div>
                <div className="text-right text-sm">
                  <span>
                    ₱{Math.abs(budget.totalSpending).toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">
                    {" "}
                    of ₱{budget.maximumSpending.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
