import type { Meta, StoryObj } from "@storybook/nextjs";
import { Card } from "./Card";

const meta = {
  title: "UI/Card",
  component: Card,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <div className="txt-preset-4 text-grey-900">Card content</div>
    </Card>
  ),
};
