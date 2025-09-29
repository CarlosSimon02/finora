import { ArrowRightIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import { LoadingButton } from "./LoadingButton";

const meta = {
  title: "UI/LoadingButton",
  component: LoadingButton,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "tertiary",
        "destructive",
        "link",
        "link-small",
      ],
    },
    isLoading: { control: "boolean" },
    label: { control: "text" },
    loadingLabel: { control: "text" },
  },
  args: {
    variant: "primary",
    label: "Continue",
    isLoading: false,
  },
} satisfies Meta<typeof LoadingButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithIcon: Story = {
  args: {
    label: "Continue",
    icon: { component: ArrowRightIcon, loc: "right" },
  },
};

export const LoadingDefault: Story = {
  args: {
    isLoading: true,
    loadingLabel: "Loading...",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const IconOnlyWithLoading: Story = {
  args: {
    iconOnly: true,
    label: "Navigate",
    icon: { component: ArrowRightIcon },
    isLoading: true,
  },
};
