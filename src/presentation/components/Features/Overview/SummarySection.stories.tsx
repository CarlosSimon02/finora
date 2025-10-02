import type { Meta, StoryObj } from "@storybook/nextjs";
import { SummarySection } from "./SummarySection";

const meta = {
  title: "Features/Overview/SummarySection",
  component: SummarySection,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SummarySection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <div className="bg-beige-100 @container flex w-full justify-center p-5">
        <SummarySection className="w-full max-w-4xl" />
      </div>
    );
  },
};
