import type { Meta, StoryObj } from "@storybook/nextjs";
import { ReactSelect } from "./ReactSelect";

type Option = { label: string; value: string };

const options: Option[] = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
  { label: "Dragonfruit", value: "dragonfruit" },
  { label: "Elderberry", value: "elderberry" },
  { label: "Fruit", value: "fruit" },
  { label: "Berry", value: "berry" },
  { label: "Vegetable", value: "vegetable" },
  { label: "Carrot", value: "carrot" },
  { label: "Potato", value: "potato" },
  { label: "Tomato", value: "tomato" },
  { label: "Onion", value: "onion" },
  { label: "Garlic", value: "garlic" },
  { label: "Mushroom", value: "mushroom" },
  { label: "Pepper", value: "pepper" },
  { label: "Lettuce", value: "lettuce" },
];

const meta = {
  title: "Primitives/ReactSelect",
  component: ReactSelect,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    isDisabled: { control: "boolean" },
    isClearable: { control: "boolean" },
    isSearchable: { control: "boolean" },
    placeholder: { control: "text" },
  },
  args: {
    options,
    placeholder: "Select an option",
    isSearchable: true,
    isClearable: false,
  },
  render: (args) => (
    <div className="w-96">
      <ReactSelect {...args} />
    </div>
  ),
} satisfies Meta<typeof ReactSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: { isSearchable: false },
};

export const Clearable: Story = {
  args: { isClearable: true },
};

export const Disabled: Story = {
  args: { isDisabled: true },
};

export const MultiSelect: Story = {
  render: () => (
    <ReactSelect isMulti options={options} placeholder="Select fruits" />
  ),
};
