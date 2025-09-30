import type { Meta, StoryObj } from "@storybook/nextjs";

import { Button } from "../../Primitives/Button/Button";
import { Select } from "./Select";

const meta = {
  title: "UI/Select",
  component: Select,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Select defaultValue="a">
      <Select.Trigger>
        <Select.Value placeholder="Pick one…" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="a">Option A</Select.Item>
        <Select.Item value="b">Option B</Select.Item>
        <Select.Item value="c">Option C</Select.Item>
      </Select.Content>
    </Select>
  ),
};

export const WithGroupsAndSeparator: Story = {
  render: () => (
    <Select defaultValue="1a">
      <Select.Trigger>
        <Select.Value placeholder="Select item" />
      </Select.Trigger>
      <Select.Content>
        <Select.Label>Group 1</Select.Label>
        <Select.Group>
          <Select.Item value="1a">One A</Select.Item>
          <Select.Item value="1b">One B</Select.Item>
        </Select.Group>
        <Select.Separator />
        <Select.Label>Group 2</Select.Label>
        <Select.Group>
          <Select.Item value="2a">Two A</Select.Item>
          <Select.Item value="2b">Two B</Select.Item>
        </Select.Group>
      </Select.Content>
    </Select>
  ),
};

export const SmallTrigger: Story = {
  render: () => (
    <Select defaultValue="x">
      <Select.Trigger size="sm">
        <Select.Value placeholder="Small trigger" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="x">X</Select.Item>
        <Select.Item value="y">Y</Select.Item>
      </Select.Content>
    </Select>
  ),
};

export const DisabledItem: Story = {
  render: () => (
    <Select defaultValue="a">
      <Select.Trigger>
        <Select.Value placeholder="Choose" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="a">Enabled</Select.Item>
        <Select.Item disabled value="b">
          Disabled
        </Select.Item>
      </Select.Content>
    </Select>
  ),
};

export const InFormLikeFooter: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Select defaultValue="a">
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="a">Option A</Select.Item>
          <Select.Item value="b">Option B</Select.Item>
        </Select.Content>
      </Select>
      <div className="flex justify-end gap-2">
        <Button variant="secondary" label="Cancel" />
        <Button label="Save" />
      </div>
    </div>
  ),
};
