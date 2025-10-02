"use client";

import { BudgetDto } from "@/core/schemas";
import { BudgetChart } from "@/presentation/components/Features/Budgets";
import { cn } from "@/utils";
import { ColoredAmountItem, EmptyState } from "../../Primitives";
import { TitledCard } from "./TitledCard";

type BudgetsSectionProps = {
  className?: string;
  budgets?: BudgetDto[];
  totalSpent?: number;
  totalLimit?: number;
};

export const BudgetsSection = ({
  className,
  budgets = [],
  totalSpent = 0,
  totalLimit = 0,
}: BudgetsSectionProps) => {
  return (
    <TitledCard
      title="Budgets"
      href="/budgets"
      className={cn("@container/budgets", className)}
    >
      {budgets.length > 0 ? (
        <div className="grid grid-cols-1 content-center items-center gap-5 @md/budgets:grid-cols-[1fr_35%]">
          <div className="flex flex-col items-center justify-center">
            <BudgetChart
              budgetData={budgets}
              totalSpent={totalSpent}
              totalLimit={totalLimit}
            />
          </div>
          <div className="@container/grid">
            <div className="grid grid-cols-1 gap-4 @3xs/grid:grid-cols-2">
              {budgets.map((budget) => (
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
        <EmptyState message="No budgets found" color="Gold" />
      )}
    </TitledCard>
  );
};
