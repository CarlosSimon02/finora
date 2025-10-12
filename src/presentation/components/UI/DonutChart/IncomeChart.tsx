import { IncomeWithTotalEarnedDto } from "@/core/schemas";
import { formatCurrency } from "@/utils";
import { useMemo } from "react";
import { DonutChart, DonutDatum } from "./DonutChart";

type IncomeChartProps = {
  incomeData: IncomeWithTotalEarnedDto[];
  totalEarned: number;
};

export const IncomeChart: React.FC<IncomeChartProps> = ({
  incomeData,
  totalEarned = 0,
}) => {
  const donutData: DonutDatum[] = useMemo(
    () =>
      incomeData.map((i) => ({
        name: i.name,
        value: i.totalEarned,
        fill: i.colorTag,
      })),
    [incomeData]
  );

  const centerMainText = formatCurrency(totalEarned, { showDecimal: false });
  const centerSubText = "Total earned";

  return (
    <DonutChart
      data={donutData}
      centerMainText={centerMainText}
      centerSubText={centerSubText}
    />
  );
};
