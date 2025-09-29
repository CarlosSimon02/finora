import type { Meta, StoryObj } from "@storybook/nextjs";
import { Avatar } from "./Avatar";

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    className: { control: "text" },
    src: { control: "text" },
    alt: { control: "text" },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Avatar>
      <Avatar.Image src="https://i.pravatar.cc/200" alt="User" />
      <Avatar.Fallback>U</Avatar.Fallback>
    </Avatar>
  ),
};

export const FallbackOnly: Story = {
  render: () => (
    <Avatar>
      <Avatar.Fallback>AB</Avatar.Fallback>
    </Avatar>
  ),
};
