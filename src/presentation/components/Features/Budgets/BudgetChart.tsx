"use client";
import { BudgetDto } from "@/core/schemas";
import { Chart } from "@/presentation/components/UI";
import { Label, Pie, PieChart } from "recharts";

type BudgetChartProps = {
  budgetData: BudgetDto[];
  totalSpent: number;
  totalLimit: number;
};

export const BudgetChart = ({
  budgetData,
  totalSpent,
  totalLimit,
}: BudgetChartProps) => {
  // Format data for the chart
  const chartData = budgetData.map((budget) => ({
    name: budget.name,
    value: budget.maximumSpending,
    fill: budget.colorTag,
  }));

  const chartConfig = budgetData.reduce<
    Record<string, { label: string; color: string }>
  >((acc, budget) => {
    acc[budget.name.toLowerCase()] = {
      label: budget.name,
      color: budget.colorTag,
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
                        className="!txt-preset-1 fill-grey-900"
                      >
                        ₱{totalSpent.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 25}
                        className="txt-preset-5 fill-grey-500"
                      >
                        of ₱{totalLimit.toLocaleString()} limit
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
