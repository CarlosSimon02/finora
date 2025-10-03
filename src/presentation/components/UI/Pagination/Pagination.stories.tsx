import type { Meta, StoryObj } from "@storybook/nextjs";
import { useEffect, useState } from "react";
import { fn } from "storybook/test";

import { Pagination, type PaginationProps } from "./Pagination";

const meta = {
  title: "UI/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    currentPage: 1,
    totalPages: 20,
    onPageChange: fn(),
    getPageHref: (p: number) => `?page=${p}`,
  },
  argTypes: {
    className: { control: false },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

const StatefulRender = (args: PaginationProps) => {
  const [page, setPage] = useState<number>(args.currentPage ?? 1);

  useEffect(() => {
    setPage(args.currentPage ?? 1);
  }, [args.currentPage]);

  return (
    <Pagination
      {...args}
      currentPage={page}
      onPageChange={(next) => {
        args.onPageChange?.(next);
        setPage(next);
      }}
    />
  );
};

export const Playground: Story = {
  render: (args) => (
    <div className="w-full max-w-xl">
      <StatefulRender className="w-full" {...args} />
    </div>
  ),
};

export const OnePage: Story = {
  args: {
    totalPages: 1,
    currentPage: 1,
  },
  render: (args) => <StatefulRender {...args} />,
};

export const ZeroPages: Story = {
  args: {
    totalPages: 0,
    currentPage: 0,
  },
  render: (args) => <StatefulRender {...args} />,
};

export const FirstPage: Story = {
  args: {
    totalPages: 15,
    currentPage: 1,
  },
  render: (args) => <StatefulRender {...args} />,
};

export const MiddleRangeDesktop: Story = {
  args: {
    totalPages: 20,
    currentPage: 10,
  },
  render: (args) => <StatefulRender {...args} />,
};

export const EndPage: Story = {
  args: {
    totalPages: 15,
    currentPage: 15,
  },
  render: (args) => <StatefulRender {...args} />,
};

export const WithHrefAndClick: Story = {
  args: {
    totalPages: 12,
    currentPage: 6,
    getPageHref: (p: number) => `#/page/${p}`,
  },
  render: (args) => <StatefulRender {...args} />,
};

export const LargePageSet: Story = {
  args: {
    totalPages: 100,
    currentPage: 50,
  },
  render: (args) => <StatefulRender {...args} />,
};

export const OutOfBoundsBelow: Story = {
  args: {
    totalPages: 10,
    currentPage: 0,
  },
  render: (args) => <StatefulRender {...args} />,
};

export const OutOfBoundsAbove: Story = {
  args: {
    totalPages: 10,
    currentPage: 999,
  },
  render: (args) => <StatefulRender {...args} />,
};

export const MobilePlayground: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  args: {
    totalPages: 12,
    currentPage: 6,
  },
  render: (args) => <StatefulRender {...args} />,
};

export const MobileFewPages: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  args: {
    totalPages: 5,
    currentPage: 3,
  },
  render: (args) => <StatefulRender {...args} />,
};

export const NoHandlers: Story = {
  args: {
    totalPages: 10,
    currentPage: 5,
    onPageChange: undefined,
    getPageHref: undefined,
  },
};
