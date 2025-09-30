"use client";

import { cn } from "@/utils";

import { components as RSComponents } from "react-select";
import { ReactSelect } from "../../Primitives";
import { COLOR_OPTIONS } from "./ColorPicker";

type ColorOption = { label: string; value: string };

type ColorPickerReactSelectProps = {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  "aria-invalid"?: boolean;
};

export const ColorPickerReactSelect = ({
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select a color",
  disabled,
  className,
  id,
  "aria-invalid": ariaInvalid,
}: ColorPickerReactSelectProps) => {
  const options: ColorOption[] = COLOR_OPTIONS;

  const selected =
    value != null ? options.find((o) => o.value === value) : undefined;
  const defaultSelected =
    defaultValue != null
      ? options.find((o) => o.value === defaultValue)
      : undefined;

  return (
    <div className={cn(className)} id={id} aria-invalid={ariaInvalid ?? false}>
      <ReactSelect<ColorOption>
        options={options}
        value={selected}
        defaultValue={defaultSelected}
        onChange={(opt) => {
          if (opt && !Array.isArray(opt)) onValueChange?.(opt.value);
        }}
        isDisabled={disabled}
        placeholder={placeholder}
        // custom rendering of options & single value to show swatch
        components={{
          Option: ({
            innerProps,
            innerRef,
            data,
            isDisabled,
            isSelected,
            children,
          }) => (
            <div
              ref={innerRef}
              {...innerProps}
              role="option"
              aria-disabled={isDisabled}
              aria-selected={isSelected}
              className={
                "txt-preset-4 border-b-grey-100 relative flex w-full cursor-pointer items-center gap-3 border-b py-3 pr-8 pl-0 last:border-b-0"
              }
            >
              <span
                className="inline-block size-4 rounded-full border border-black/10"
                style={{ backgroundColor: (data as ColorOption).value }}
              />
              <span>{children}</span>
            </div>
          ),
          SingleValue: ({ children, ...rest }) => (
            <RSComponents.SingleValue {...rest}>
              <div className="flex items-center gap-3">
                {(() => {
                  const opt = rest.getValue?.()?.[0] as ColorOption | undefined;
                  return opt ? (
                    <span
                      className="inline-block size-4 rounded-full"
                      style={{ backgroundColor: opt.value }}
                    />
                  ) : null;
                })()}
                <span>{children}</span>
              </div>
            </RSComponents.SingleValue>
          ),
        }}
      />
    </div>
  );
};
