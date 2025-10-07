"use client";

import { COLOR_OPTIONS, ColorOption, ColorValue } from "@/constants/colors";
import {
  ReactSelect,
  rsOptionBase,
} from "@/presentation/components/Primitives";
import { CheckIcon } from "@phosphor-icons/react";
import { GroupBase, components as RSComponents } from "react-select";
import { AsyncProps } from "react-select/async";

type ColorPickerReactSelectProps = Omit<
  AsyncProps<ColorOption, false, GroupBase<ColorOption>>,
  "onChange" | "value" | "defaultValue" | "isDisabled" | "loadOptions"
> & {
  value?: ColorValue;
  defaultValue?: ColorValue;
  onValueChange?: (value?: ColorValue) => void;
  disabled?: boolean;
};

export const ColorPickerReactSelect = ({
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select a color",
  disabled,
  ...props
}: ColorPickerReactSelectProps) => {
  return (
    <ReactSelect<ColorOption>
      defaultOptions={COLOR_OPTIONS}
      value={COLOR_OPTIONS.find((o) => o.value === value)}
      defaultValue={COLOR_OPTIONS.find((o) => o.value === defaultValue)}
      onChange={(opt) => {
        onValueChange?.(opt?.value);
      }}
      isDisabled={disabled}
      placeholder={placeholder}
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
            className={rsOptionBase(isDisabled, isSelected)}
          >
            <div className="flex flex-1 items-center gap-3">
              <span
                className="inline-block size-4 shrink-0 rounded-full"
                style={{ backgroundColor: (data as ColorOption).value }}
              />
              <span>{children}</span>
            </div>
            <span className="flex items-center justify-center">
              {isSelected ? (
                <span className="bg-secondary-green flex size-4 items-center justify-center rounded-full">
                  <CheckIcon className="size-2 text-white" weight="bold" />
                </span>
              ) : isDisabled ? (
                <span className="txt-preset-5 text-grey-500 text-end">
                  Already used
                </span>
              ) : null}
            </span>
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
      {...props}
    />
  );
};
