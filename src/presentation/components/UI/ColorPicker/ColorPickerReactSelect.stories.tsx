import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import { ColorPickerReactSelect } from "./ColorPickerReactSelect";

const meta = {
  title: "UI/ColorPickerReactSelect",
  component: ColorPickerReactSelect,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ColorPickerReactSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => <ColorPickerReactSelect placeholder="Select color" />,
};

export const WithDefaultValue: Story = {
  render: () => <ColorPickerReactSelect defaultValue="#277C78" />,
};

export const Disabled: Story = {
  render: () => <ColorPickerReactSelect disabled placeholder="Disabled" />,
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string | undefined>("#F2CDAC");
    return (
      <div className="flex flex-col items-center gap-3">
        <ColorPickerReactSelect value={value} onValueChange={setValue} />
        <div className="text-muted-foreground text-sm">Selected: {value}</div>
      </div>
    );
  },
};
