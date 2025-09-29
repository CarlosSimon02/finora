import type { Meta, StoryObj } from "@storybook/nextjs";
import { Button } from "../../Primitives/Button/Button";
import { Tooltip } from "./ToolTip";

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <Tooltip.Trigger asChild>
        <Button label="Hover" />
      </Tooltip.Trigger>
      <Tooltip.Content>Tooltip content</Tooltip.Content>
    </Tooltip>
  ),
};
