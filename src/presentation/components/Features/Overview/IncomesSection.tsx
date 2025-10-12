"use client";

import { IncomesSummaryDto } from "@/core/schemas";
import {
  ColoredAmountItem,
  InlineEmptyState,
} from "@/presentation/components/Primitives";
import { IncomeChart } from "@/presentation/components/UI";
import { cn } from "@/utils";
import { TitledCard } from "./TitledCard";

type BudgetsSectionProps = {
  className?: string;
  incomesSummary?: IncomesSummaryDto;
};

export const IncomesSection = ({
  className,
  incomesSummary,
}: BudgetsSectionProps) => {
  return (
    <TitledCard
      title="Incomes"
      href="/incomes"
      className={cn("@container/budgets", className)}
    >
      {incomesSummary?.incomes?.length &&
      incomesSummary?.incomes?.length > 0 ? (
        <div className="grid h-full grid-cols-1 content-center items-center gap-5 @md/budgets:grid-cols-[1fr_35%]">
          <div className="flex flex-col items-center justify-center">
            <IncomeChart
              incomeData={incomesSummary.incomes}
              totalEarned={incomesSummary.totalEarned}
            />
          </div>
          <div className="@container/grid">
            <div className="grid grid-cols-1 gap-4 @3xs/grid:grid-cols-2">
              {incomesSummary.incomes.slice(0, 4).map((income) => (
                <ColoredAmountItem
                  key={income.id}
                  name={income.name}
                  color={income.colorTag}
                  amount={income.totalEarned}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <InlineEmptyState message="No incomes found" color="Gold" />
      )}
    </TitledCard>
  );
};
