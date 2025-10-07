import type { Meta, StoryObj } from "@storybook/nextjs";
import { EmojiPicker } from "./EmojiPicker";

const meta = {
  title: "UI/EmojiPicker",
  component: EmojiPicker,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof EmojiPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "👋",
    onChange: () => {},
  },
};
