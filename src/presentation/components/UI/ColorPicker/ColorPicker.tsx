"use client";

import { Select } from "../Select";

type ColorOption = { label: string; value: string };

const COLOR_OPTIONS: ColorOption[] = [
  { label: "Green", value: "#277C78" },
  { label: "Yellow", value: "#F2CDAC" },
  { label: "Cyan", value: "#82C9D7" },
  { label: "Navy", value: "#626070" },
  { label: "Red", value: "#C94736" },
  { label: "Purple", value: "#826CB0" },
  { label: "Violet", value: "#AF81BA" },
  { label: "Turquoise", value: "#597C7C" },
  { label: "Brown", value: "#93674F" },
  { label: "Magenta", value: "#934F6F" },
  { label: "Blue", value: "#3F82B2" },
  { label: "Navy Grey", value: "#97A0AC" },
  { label: "Army Green", value: "#7F9161" },
  { label: "Gold", value: "#CAB361" },
  { label: "Orange", value: "#BE6C49" },
];

type ColorPickerProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
};

export const ColorPicker = ({
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select a color",
  disabled,
  className,
  id,
}: ColorPickerProps) => {
  return (
    <Select
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <Select.Trigger className={className} id={id}>
        <Select.Value placeholder={placeholder} />
      </Select.Trigger>
      <Select.Content>
        <Select.Group>
          {COLOR_OPTIONS.map((option) => (
            <Select.Item key={option.value} value={option.value}>
              <span
                className="mr-2 inline-block size-4 rounded-full border border-black/10"
                style={{ backgroundColor: option.value }}
              />
              <span>{option.label}</span>
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select>
  );
};

export { COLOR_OPTIONS };
