import type { Meta, StoryObj } from "@storybook/nextjs";
import { PasswordInput } from "./PasswordInput";

const meta = {
  title: "Primitives/PasswordInput",
  component: PasswordInput,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    placeholder: { control: "text" },
    value: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    placeholder: "Enter password",
  },
} satisfies Meta<typeof PasswordInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    disabled: false,
  },
};
