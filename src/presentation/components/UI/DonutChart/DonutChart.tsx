"use client";

import { ColorValue } from "@/constants/colors";
import { Chart } from "@/presentation/components/UI";
import React, { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";

export type DonutDatum = {
  name: string;
  value: number;
  fill: ColorValue;
};

type DonutChartProps = {
  data: DonutDatum[];
  centerMainText: string;
  centerSubText?: string | React.ReactNode;
  className?: string;
  innerRadius?: number;
  outerRadius?: number;
  paddingAngle?: number;
};

export const DonutChart: React.FC<DonutChartProps> = ({
  data,
  centerMainText,
  centerSubText,
  className,
  innerRadius = 80,
  outerRadius = 120,
  paddingAngle = 2,
}) => {
  const chartData = useMemo(() => data.map((d) => ({ ...d })), [data]);

  const chartConfig = useMemo(() => {
    return chartData.reduce<
      Record<string, { label: string; color: ColorValue }>
    >((acc, d) => {
      acc[d.name.toLowerCase()] = { label: d.name, color: d.fill };
      return acc;
    }, {});
  }, [data]);

  return (
    <div
      className={`relative flex size-[15.1rem] items-center justify-center ${className ?? ""}`}
    >
      <Chart className="h-full w-full" config={chartConfig}>
        <PieChart>
          <Chart.Tooltip
            cursor={false}
            content={<Chart.TooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={paddingAngle}
            dataKey="value"
          >
            <Label
              content={(props) => {
                // LabelProps from recharts may be broader; check and narrow safely
                // We only need viewBox with cx/cy coordinates.
                const vb = (props as { viewBox?: { cx?: number; cy?: number } })
                  .viewBox;
                if (
                  !vb ||
                  typeof vb.cx !== "number" ||
                  typeof vb.cy !== "number"
                ) {
                  return null;
                }

                const cx = vb.cx;
                const cy = vb.cy;

                return (
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={cx}
                      y={cy - 3}
                      className="!txt-preset-1 fill-grey-900 !max-w-[8ch]"
                      width="8ch"
                    >
                      {centerMainText}
                    </tspan>
                    {centerSubText ? (
                      <tspan
                        x={cx}
                        y={cy + 25}
                        className="txt-preset-5 fill-grey-500"
                      >
                        {centerSubText}
                      </tspan>
                    ) : null}
                  </text>
                );
              }}
            />
          </Pie>
        </PieChart>
      </Chart>
    </div>
  );
};
