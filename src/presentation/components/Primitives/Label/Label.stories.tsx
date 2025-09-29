import type { Meta, StoryObj } from "@storybook/nextjs";
import { Label } from "./Label";

const meta = {
  title: "Primitives/Label",
  component: Label,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    children: { control: "text" },
    htmlFor: { control: "text" },
  },
  args: {
    children: "Label",
    htmlFor: "input-id",
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
