import type { Meta, StoryObj } from "@storybook/nextjs";
import { RecurringBillsSection } from "./RecurringBillsSection";

const meta = {
  title: "Features/Overview/RecurringBillsSection",
  component: RecurringBillsSection,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof RecurringBillsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <div className="bg-beige-100 flex w-full justify-center p-5">
        <RecurringBillsSection />
      </div>
    );
  },
};
