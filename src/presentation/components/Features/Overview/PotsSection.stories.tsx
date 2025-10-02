import type { Meta, StoryObj } from "@storybook/nextjs";
import { PotsSection } from "./PotsSection";

const meta = {
  title: "Features/Overview/PotsSection",
  component: PotsSection,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PotsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    return (
      <div className="bg-beige-100 flex w-full justify-center p-5">
        <PotsSection className="w-full max-w-4xl" />
      </div>
    );
  },
};
