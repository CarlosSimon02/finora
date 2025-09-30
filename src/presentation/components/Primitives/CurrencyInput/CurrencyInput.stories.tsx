import type { Meta, StoryObj } from "@storybook/nextjs";
import { useState } from "react";

import { CurrencyInput } from "./CurrencyInput";

const meta = {
  title: "Primitives/CurrencyInput",
  component: CurrencyInput,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof CurrencyInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => <CurrencyInput placeholder="0.00" />,
};

export const WithPrefix: Story = {
  render: () => (
    <CurrencyInput placeholder="0.00" decimalScale={2} fixedDecimalScale />
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState<string | number | undefined>("1234.56");
    return (
      <CurrencyInput
        value={value}
        onValueChange={(val) => setValue(val.value)}
        thousandSeparator
        decimalScale={2}
        fixedDecimalScale
      />
    );
  },
};
