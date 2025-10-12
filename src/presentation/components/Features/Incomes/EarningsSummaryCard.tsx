import { IncomesSummaryDto } from "@/core/schemas";
import { IncomeChart, SummaryCard } from "@/presentation/components/UI";
import { safeNumber } from "@/utils";
import React, { useMemo } from "react";

type EarningsSummaryCardProps = {
  incomesSummary: IncomesSummaryDto;
  className?: string;
};

export const EarningsSummaryCard: React.FC<EarningsSummaryCardProps> = ({
  incomesSummary,
  className,
}) => {
  const showChart = safeNumber(incomesSummary.totalEarned) > 0;

  const items = useMemo(
    () =>
      (incomesSummary.incomes ?? []).map((income) => ({
        id: income.id,
        name: income.name,
        colorTag: income.colorTag,
        mainValue: safeNumber(income.totalEarned),
        // list had no subText other than the value, so keep undefined
      })),
    [incomesSummary.incomes]
  );

  const chart = showChart ? (
    <IncomeChart
      incomeData={incomesSummary.incomes}
      totalEarned={Math.abs(safeNumber(incomesSummary.totalEarned))}
    />
  ) : undefined;

  return (
    <SummaryCard
      title="Earnings Summary"
      items={items}
      chart={chart}
      className={className}
    />
  );
};
