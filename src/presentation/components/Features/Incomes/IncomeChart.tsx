"use client";
import { IncomeWithTotalEarnedDto } from "@/core/schemas";
import { Chart } from "@/presentation/components/UI";
import { formatCurrency } from "@/utils";
import { Label, Pie, PieChart } from "recharts";

type IncomeChartProps = {
  incomeData: IncomeWithTotalEarnedDto[];
  totalEarned: number;
};

export const IncomeChart = ({
  incomeData,
  totalEarned = 0,
}: IncomeChartProps) => {
  const chartData = incomeData.map((income) => ({
    name: income.name,
    value: income.totalEarned,
    fill: income.colorTag,
  }));

  const chartConfig = incomeData.reduce<
    Record<string, { label: string; color: string }>
  >((acc, income) => {
    acc[income.name.toLowerCase()] = {
      label: income.name,
      color: income.colorTag,
    };
    return acc;
  }, {});

  return (
    <div className="relative flex aspect-square h-[15.1rem] items-center justify-center">
      <Chart config={chartConfig} className="h-full w-full">
        <PieChart>
          <Chart.Tooltip
            cursor={false}
            content={<Chart.TooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={2}
            dataKey="value"
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) - 3}
                        className="!txt-preset-1 fill-grey-900 !max-w-[8ch]"
                        width="8ch"
                      >
                        {formatCurrency(totalEarned, { showDecimal: false })}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 25}
                        className="txt-preset-5 fill-grey-500"
                      >
                        Total earned
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </Chart>
    </div>
  );
};
