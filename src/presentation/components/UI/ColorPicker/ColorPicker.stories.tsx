import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import { ColorPicker } from "./ColorPicker";

const meta = {
  title: "UI/ColorPicker",
  component: ColorPicker,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => <ColorPicker placeholder="Select color" />,
};

export const WithDefaultValue: Story = {
  render: () => <ColorPicker defaultValue="#277C78" />,
};

export const Disabled: Story = {
  render: () => <ColorPicker disabled placeholder="Disabled" />,
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>("#F2CDAC");
    return (
      <div className="flex flex-col items-center gap-3">
        <ColorPicker value={value} onValueChange={setValue} />
        <div className="text-muted-foreground text-sm">Selected: {value}</div>
      </div>
    );
  },
};
