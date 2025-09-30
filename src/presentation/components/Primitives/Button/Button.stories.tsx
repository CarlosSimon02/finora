import { ArrowRightIcon, XIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import { GoogleIcon } from "../../SVGs/GoogleIcon";
import { Button } from "./Button";

const iconMapping = {
  none: undefined,
  google: GoogleIcon,
  arrow: ArrowRightIcon,
  close: XIcon,
} as const;

const meta = {
  title: "Primitives/Button",
  component: Button,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      type: "string",
      description: "The variant of the button.",
      options: [
        "primary",
        "secondary",
        "tertiary",
        "destructive",
        "link",
        "link-small",
      ],
    },
    label: {
      control: "text",
      description:
        "Required label (string). Used for accessibility and visible text.",
      table: { type: { summary: "string (required)" } },
    },
    icon: {
      control: { type: "select" },
      options: Object.keys(iconMapping),
      mapping: iconMapping,
      description:
        "Select an example icon component (story maps to the component).",
      table: { type: { summary: "ComponentType<SVGProps<SVGSVGElement>>" } },
    },
    // icon config is provided per-story via the `icon` prop
    iconOnly: {
      control: "boolean",
      description:
        "When true visually hides the label (sr-only) and shows only the icon.",
    },
    disabled: {
      control: "boolean",
    },
    href: {
      control: "text",
      description: "When provided, Button renders as a Next.js Link (anchor).",
    },
    target: {
      control: { type: "select" },
      options: [undefined, "_self", "_blank", "_parent", "_top"],
    },
    rel: {
      control: "text",
    },
  },
  args: {
    variant: "primary",
    label: "Button",
    icon: iconMapping.none,
    iconOnly: false,
    disabled: false,
    href: undefined,
    target: undefined,
    rel: undefined,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------- Stories ------------------- */

export const Primary: Story = {
  args: { variant: "primary", label: "Button" },
};

export const Secondary: Story = {
  args: { variant: "secondary", label: "Secondary" },
};

export const Tertiary: Story = {
  args: { variant: "tertiary", label: "Tertiary" },
};

export const Destructive: Story = {
  args: { variant: "destructive", label: "Delete" },
};

export const Link: Story = {
  args: { variant: "link", label: "Link" },
};

export const LinkSmall: Story = {
  args: { variant: "link-small", label: "Link Small" },
};

export const IconLeft: Story = {
  args: {
    label: "Sign in with Google",
    icon: { component: iconMapping.google },
  },
};

export const IconRight: Story = {
  args: {
    label: "Continue",
    icon: { component: iconMapping.arrow, loc: "right" },
  },
};

export const IconSmallSize: Story = {
  args: {
    label: "Small icon",
    icon: { component: iconMapping.google, size: "sm", loc: "left" },
  },
};

export const IconClassOverride: Story = {
  args: {
    label: "Custom icon class",
    icon: { component: iconMapping.arrow, className: "text-red-500" },
  },
};

export const IconOnly: Story = {
  args: {
    label: "Close",
    icon: { component: iconMapping.google },
    iconOnly: true,
  },
};

export const IconOnlyMissingIcon: Story = {
  args: {
    label: "Missing icon (should warn)",
    icon: iconMapping.none,
    iconOnly: true,
  },
  render: (args) => {
    if (args.icon == null) {
      // eslint-disable-next-line no-console
      console.warn(
        "IconOnlyMissingIcon story: iconOnly is true but `icon` is not provided. Provide an icon or don't use iconOnly."
      );
    }
    return React.createElement(
      Button,
      args as unknown as React.ComponentProps<typeof Button>
    );
  },
};

export const AsAnchor_WithHref: Story = {
  args: {
    label: "Visit example.com",
    icon: { component: iconMapping.arrow, loc: "right" },
  },
  render: (args) =>
    React.createElement(Button, {
      ...(args as unknown as React.ComponentProps<typeof Button>),
      href: "https://example.com",
      target: "_blank",
    } as unknown as React.ComponentProps<typeof Button>),
};

export const Disabled: Story = {
  args: {
    label: "Can't click me",
    disabled: true,
  },
};
