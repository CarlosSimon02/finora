"use client";

import { BudgetsSummaryDto } from "@/core/schemas";
import { BudgetChart, SummaryCard } from "@/presentation/components/UI";
import { formatCurrency, safeNumber } from "@/utils";
import React, { useMemo } from "react";

type SpendingSummaryCardProps = {
  budgetsSummary: BudgetsSummaryDto;
  className?: string;
};

export const SpendingSummaryCard: React.FC<SpendingSummaryCardProps> = ({
  budgetsSummary,
  className,
}) => {
  const items = useMemo(
    () =>
      (budgetsSummary.budgets ?? []).map((budget) => ({
        id: budget.id,
        name: budget.name,
        colorTag: budget.colorTag,
        mainValue: safeNumber(budget.totalSpending),
        subText: (
          <>
            {" "}
            of{" "}
            {formatCurrency(safeNumber(budget.maximumSpending), {
              showDecimal: false,
            })}
          </>
        ),
      })),
    [budgetsSummary.budgets]
  );

  const chart = (
    <BudgetChart
      budgetData={budgetsSummary.budgets}
      totalLimit={Math.abs(safeNumber(budgetsSummary.totalMaxSpending))}
      totalSpent={Math.abs(safeNumber(budgetsSummary.totalSpending))}
    />
  );

  return (
    <SummaryCard
      title="Spending Summary"
      items={items}
      chart={chart}
      className={className}
    />
  );
};
