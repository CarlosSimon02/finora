import type { Meta, StoryObj } from "@storybook/nextjs";
import { Skeleton } from "./Skeleton";

const meta = {
  title: "Primitives/Skeleton",
  component: Skeleton,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-sm max-w-sm">
      <div className="space-y-3 p-4">
        {/* title */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <Skeleton className="h-3 w-1/2 rounded-md" />
        </div>

        {/* description lines */}
        <div className="mt-2 space-y-2">
          <Skeleton className="h-3 w-full rounded-md" />
          <Skeleton className="h-3 w-11/12 rounded-md" />
          <Skeleton className="h-3 w-9/12 rounded-md" />
        </div>
      </div>
    </div>
  ),
};
