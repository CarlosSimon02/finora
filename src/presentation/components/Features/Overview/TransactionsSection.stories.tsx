import type { Meta, StoryObj } from "@storybook/nextjs";
import { TransactionsSection } from "./TransactionsSection";

const meta = {
  title: "Features/Overview/TransactionsSection",
  component: TransactionsSection,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TransactionsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <div className="bg-beige-100 flex w-full justify-center p-5">
        <TransactionsSection className="w-full max-w-2xl" />
      </div>
    );
  },
};
