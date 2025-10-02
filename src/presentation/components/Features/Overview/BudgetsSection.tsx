"use client";

import { BudgetChart } from "@/presentation/components/Features/Budgets";
import { cn } from "@/utils";
import { ColoredAmountItem } from "../../Primitives";
import { getBudgetsData } from "./_temp-data";
import { TitledCard } from "./TitledCard";

type BudgetsSectionProps = {
  className?: string;
};

export const BudgetsSection = ({ className }: BudgetsSectionProps) => {
  const { totalSpent, totalLimit, topBudgets } = getBudgetsData();

  return (
    <TitledCard
      title="Budgets"
      href="/budgets"
      className={cn("@container/budgets", className)}
    >
      <div className="grid h-full grid-cols-1 content-center items-center gap-5 @md/budgets:grid-cols-[1fr_35%]">
        <div className="flex flex-col items-center justify-center">
          <BudgetChart
            budgetData={topBudgets}
            totalSpent={totalSpent}
            totalLimit={totalLimit}
          />
        </div>
        <div className="@container/grid">
          <div className="grid grid-cols-1 gap-4 @3xs/grid:grid-cols-2">
            {topBudgets.map((budget) => (
              <ColoredAmountItem
                key={budget.id}
                name={budget.name}
                color={budget.color}
                amount={budget.spent}
              />
            ))}
          </div>
        </div>
      </div>
    </TitledCard>
  );
};
