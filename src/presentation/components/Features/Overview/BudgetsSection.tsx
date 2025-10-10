"use client";

import { BudgetsSummaryDto } from "@/core/schemas";
import { BudgetChart } from "@/presentation/components/Features/Budgets";
import {
  ColoredAmountItem,
  InlineEmptyState,
} from "@/presentation/components/Primitives";
import { cn } from "@/utils";
import { TitledCard } from "./TitledCard";

type BudgetsSectionProps = {
  className?: string;
  budgetsSummary?: BudgetsSummaryDto;
};

export const BudgetsSection = ({
  className,
  budgetsSummary,
}: BudgetsSectionProps) => {
  return (
    <TitledCard
      title="Budgets"
      href="/budgets"
      className={cn("@container/budgets", className)}
    >
      {budgetsSummary?.budgets?.length &&
      budgetsSummary?.budgets?.length > 0 ? (
        <div className="grid h-full grid-cols-1 content-center items-center gap-5 @md/budgets:grid-cols-[1fr_35%]">
          <div className="flex flex-col items-center justify-center">
            <BudgetChart
              budgetData={budgetsSummary.budgets}
              totalSpent={budgetsSummary.totalSpending}
              totalLimit={budgetsSummary.totalMaxSpending}
            />
          </div>
          <div className="@container/grid">
            <div className="grid grid-cols-1 gap-4 @3xs/grid:grid-cols-2">
              {budgetsSummary.budgets.slice(0, 4).map((budget) => (
                <ColoredAmountItem
                  key={budget.id}
                  name={budget.name}
                  color={budget.colorTag}
                  amount={budget.maximumSpending}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <InlineEmptyState message="No budgets found" color="Gold" />
      )}
    </TitledCard>
  );
};
