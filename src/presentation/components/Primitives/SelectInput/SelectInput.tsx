"use client";

import * as React from "react";

import { cn } from "@/utils";
import { GroupBase, OptionsOrGroups } from "react-select";
import { ReactSelect } from "../ReactSelect";

export type SelectInputOption = {
  value: string;
  label: React.ReactNode;
  isDisabled?: boolean;
};

export type SelectInputOptionGroup = {
  label: React.ReactNode;
  options: SelectInputOption[];
};

export type SelectInputProps = {
  options: OptionsOrGroups<SelectInputOption, GroupBase<SelectInputOption>>;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: "sm" | "default";
  className?: string;
  id?: string;
  isSearchable?: boolean;
  "aria-invalid"?: boolean;
};

function flattenOptions(
  options: OptionsOrGroups<SelectInputOption, GroupBase<SelectInputOption>>
): SelectInputOption[] {
  const flat: SelectInputOption[] = [];
  for (const item of options as Array<
    SelectInputOption | SelectInputOptionGroup
  >) {
    if ((item as SelectInputOptionGroup).options) {
      flat.push(...(item as SelectInputOptionGroup).options);
    } else {
      flat.push(item as SelectInputOption);
    }
  }
  return flat;
}

export const SelectInput = ({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  disabled,
  size = "default",
  className,
  id,
  isSearchable = false,
  "aria-invalid": ariaInvalid,
}: SelectInputProps) => {
  const flatOptions = React.useMemo(() => flattenOptions(options), [options]);

  const selectedOption =
    value !== undefined
      ? flatOptions.find((o) => o.value === value)
      : undefined;

  const defaultOption =
    defaultValue !== undefined
      ? flatOptions.find((o) => o.value === defaultValue)
      : undefined;

  return (
    <ReactSelect
      inputId={id}
      aria-invalid={ariaInvalid}
      isDisabled={disabled}
      value={selectedOption}
      defaultValue={defaultOption}
      onChange={(opt) =>
        onValueChange?.((opt as SelectInputOption | null)?.value ?? "")
      }
      options={options}
      placeholder={placeholder}
      isSearchable={isSearchable}
      className={cn("min-w-0", className)}
      classNames={{
        control: () =>
          cn(
            "text-preset-4 text-grey-900 border-beige-500 focus-visible:border-grey-900 aria-invalid:border-secondary-red flex w-full min-w-0 items-center gap-2 rounded-lg border bg-transparent whitespace-nowrap transition-[color] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            size === "sm" ? "px-3 py-2" : "px-5 py-3",
            ariaInvalid && "border-secondary-red"
          ),
        placeholder: () => "placeholder:text-beige-500",
        valueContainer: () => "",
        menu: () =>
          "text-grey-900 z-50 min-w-[8rem] overflow-x-hidden overflow-y-auto rounded-lg bg-white shadow-md",
        option: ({ isDisabled, isFocused }) =>
          cn(
            "txt-preset-4 relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-2 select-none",
            isFocused && "bg-accent",
            isDisabled && "pointer-events-none opacity-50"
          ),
        indicatorsContainer: () => "",
        dropdownIndicator: () => "opacity-50",
        indicatorSeparator: () => "hidden",
      }}
      styles={{
        control: (base) => ({
          ...base,
          backgroundColor: "transparent",
          boxShadow: "none",
        }),
        indicatorSeparator: (base) => ({ ...base, display: "none" }),
      }}
    />
  );
};

export default SelectInput;
