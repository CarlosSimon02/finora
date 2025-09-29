import type { Meta, StoryObj } from "@storybook/nextjs";
import { Logo } from "./Logo";

const meta = {
  title: "Primitives/Logo",
  component: Logo,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Logo className="fill-grey-900 h-6 w-auto" />,
};
