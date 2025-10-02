import type { Meta, StoryObj } from "@storybook/nextjs";
import { Pie, PieChart } from "recharts";
import { Chart } from "./Chart";

const meta = {
  title: "UI/Chart",
  component: Chart,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Chart>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = [
  { name: "Food", value: 400, fill: "#22C55E" },
  { name: "Transport", value: 300, fill: "#3B82F6" },
  { name: "Shopping", value: 300, fill: "#F59E0B" },
  { name: "Bills", value: 200, fill: "#EF4444" },
];

const chartConfig = {
  food: { label: "Food", color: "#22C55E" },
  transport: { label: "Transport", color: "#3B82F6" },
  shopping: { label: "Shopping", color: "#F59E0B" },
  bills: { label: "Bills", color: "#EF4444" },
};

export const Default: Story = {
  render: () => (
    <div style={{ width: 320, height: 240 }}>
      <Chart config={chartConfig}>
        <PieChart>
          <Chart.Tooltip content={<Chart.TooltipContent hideLabel />} />
          <Pie
            data={sampleData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          />
        </PieChart>
      </Chart>
    </div>
  ),
};
