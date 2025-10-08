"use client";

import { Input } from "@/presentation/components/Primitives";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

type SearchInputProps = Omit<React.ComponentProps<typeof Input>, "onChange"> & {
  onChange?: (value: string) => void;
  value?: string;
  debounceMs?: number;
  onImmediateChange?: (value: string) => void;
};

export const SearchInput = ({
  onChange,
  value: controlledValue,
  debounceMs = 300,
  onImmediateChange,
  ...props
}: SearchInputProps) => {
  const [internalValue, setInternalValue] = useState(controlledValue ?? "");

  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [controlledValue]);

  const debouncedOnChange = useDebouncedCallback((value: string) => {
    onChange?.(value);
  }, debounceMs);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onImmediateChange?.(newValue);
    debouncedOnChange(newValue);
  };

  return (
    <Input
      type="search"
      placeholder="Search"
      value={internalValue}
      onChange={handleChange}
      {...props}
    />
  );
};
