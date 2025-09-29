import type { Meta } from "@storybook/nextjs";

import { GoogleIcon } from "./GoogleIcon";

const meta = {
  title: "SVGs/GoogleIcon",
  component: GoogleIcon,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GoogleIcon>;

export default meta;

export const Default = () => <GoogleIcon />;
