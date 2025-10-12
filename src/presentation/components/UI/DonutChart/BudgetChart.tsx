import { BudgetWithTotalSpendingDto } from "@/core/schemas";
import { formatCurrency } from "@/utils";
import { useMemo } from "react";
import { DonutChart, DonutDatum } from "./DonutChart";

type BudgetChartProps = {
  budgetData: BudgetWithTotalSpendingDto[];
  totalSpent: number;
  totalLimit: number;
};

export const BudgetChart: React.FC<BudgetChartProps> = ({
  budgetData,
  totalSpent,
  totalLimit,
}) => {
  const donutData: DonutDatum[] = useMemo(
    () =>
      budgetData.map((b) => ({
        name: b.name,
        value: b.totalSpending,
        fill: b.colorTag,
      })),
    [budgetData]
  );

  const centerMainText = formatCurrency(totalSpent, { showDecimal: false });
  const centerSubText = `of ${formatCurrency(totalLimit, { showDecimal: false })} limit`;

  return (
    <DonutChart
      data={donutData}
      centerMainText={centerMainText}
      centerSubText={centerSubText}
    />
  );
};
