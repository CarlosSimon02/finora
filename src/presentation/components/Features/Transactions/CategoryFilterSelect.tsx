"use client";

import { PaginationParams } from "@/core/schemas";
import { trpc } from "@/lib/trpc/client";
import { Select } from "@/presentation/components/UI/Select/Select";
import { CircleNotchIcon, FunnelIcon } from "@phosphor-icons/react";
import React from "react";

type CategoryFilterOptionType = {
  value: string;
  label: string;
};

type CategoryFilterSelectProps = {
  value?: CategoryFilterOptionType;
  onChange?: (category?: CategoryFilterOptionType) => void;
  disabled?: boolean;
};

export const CategoryFilterSelect = ({
  value,
  onChange,
  disabled,
}: CategoryFilterSelectProps) => {
  const utils = trpc.useUtils();
  const [loading, setLoading] = React.useState<boolean>(true);
  const [categories, setCategories] = React.useState<string[]>([]);

  React.useEffect(() => {
    let mounted = true;
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const params: PaginationParams = {
          sort: { field: "name", order: "asc" },
          pagination: { page: 1, perPage: 30 },
          filters: [],
          search: "",
        };
        const res = await utils.getPaginatedCategories.fetch(params);
        if (!mounted) return;
        setCategories(res.data.map((c) => c.name));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchCategories();
    return () => {
      mounted = false;
    };
  }, [utils]);

  return (
    <div className="flex items-center gap-2">
      <span className="txt-preset-4 text-grey-500 hidden shrink-0 @4xl:inline">
        Category
      </span>
      <Select
        value={value?.value}
        onValueChange={(val) =>
          onChange?.(val ? { value: val, label: val } : undefined)
        }
        disabled={disabled || loading}
      >
        <Select.Trigger
          className="w-[3.125rem] @max-4xl:size-[3.125rem] @max-4xl:items-center @max-4xl:justify-center @max-4xl:!p-0 @4xl:w-[15rem] [&>svg:last-child]:hidden @4xl:[&>svg:last-child]:inline"
          aria-busy={loading}
        >
          {/* Icon-only on mobile; spinner when loading */}
          <span className="@4xl:hidden">
            {loading ? (
              <CircleNotchIcon size={20} className="size-4 animate-spin" />
            ) : (
              <FunnelIcon size={20} className="size-4" weight="fill" />
            )}
          </span>
          {/* Value only on desktop */}
          <div className="hidden @4xl:inline">
            <Select.Value
              placeholder={loading ? "Loading..." : "All Transactions"}
            />
          </div>
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="all transactions">All Transactions</Select.Item>
          {categories.map((name) => (
            <Select.Item key={name} value={name}>
              {name}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>
    </div>
  );
};
