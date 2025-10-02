import type { Meta, StoryObj } from "@storybook/nextjs";
import { BudgetsSection } from "./BudgetsSection";

const meta = {
  title: "Features/Overview/BudgetsSection",
  component: BudgetsSection,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BudgetsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <div className="bg-beige-100 flex w-full justify-center p-5">
        <BudgetsSection className="w-full max-w-4xl" />
      </div>
    );
  },
};
