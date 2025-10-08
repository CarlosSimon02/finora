"use client";

import { Input } from "@/presentation/components/Primitives";
import { Tooltip } from "@/presentation/components/UI";
import { cn } from "@/utils";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useState } from "react";

type SearchInputProps = Omit<
  React.ComponentProps<typeof Input>,
  "type" | "onChange"
> & {
  onSearch?: (value: string) => void;
  defaultValue?: string;
};

export const SearchInput = ({
  className,
  onSearch,
  defaultValue = "",
  ...props
}: SearchInputProps) => {
  const [searchValue, setSearchValue] = useState(defaultValue);

  const handleSearch = () => {
    onSearch?.(searchValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Input
        type="search"
        placeholder="Search"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="pr-[3.125rem]"
        {...props}
      />
      <Tooltip.Provider>
        <Tooltip>
          <Tooltip.Trigger asChild>
            <button
              className="text-grey-900 hover:text-grey-500 absolute top-0 right-0 h-full px-4 transition-colors"
              type="button"
              onClick={handleSearch}
              aria-label="Search"
            >
              <MagnifyingGlass size={20} weight="bold" />
              <span className="sr-only">Search</span>
            </button>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <p>Search</p>
          </Tooltip.Content>
        </Tooltip>
      </Tooltip.Provider>
    </div>
  );
};
