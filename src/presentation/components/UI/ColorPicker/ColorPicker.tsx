"use client";

import { COLOR_OPTIONS } from "@/constants/colors";
import { Select } from "@/presentation/components/UI";
import { cn } from "@/utils";

type ColorPickerProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-invalid"?: boolean;
};

export const ColorPicker = ({
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select a color",
  disabled,
  className,
  id,
  "aria-invalid": ariaInvalid,
}: ColorPickerProps) => {
  return (
    <Select
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <Select.Trigger
        className={cn(className)}
        id={id}
        aria-invalid={ariaInvalid ?? false}
      >
        <Select.Value placeholder={placeholder} />
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          {COLOR_OPTIONS.map((option) => (
            <Select.Item key={option.value} value={option.value}>
              <div className="flex items-center gap-3">
                <span
                  className="inline-block size-4 rounded-full border border-black/10"
                  style={{ backgroundColor: option.value }}
                />
                <span>{option.label}</span>
              </div>
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select>
  );
};

export { COLOR_OPTIONS };
