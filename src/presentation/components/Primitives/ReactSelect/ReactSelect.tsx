"use client";

import { cn } from "@/utils";
import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react";
import {
  NoticeProps,
  components as RSComponents,
  type ControlProps,
  type DropdownIndicatorProps,
  type GroupBase,
  type GroupHeadingProps,
  type MenuListProps,
  type MenuProps,
  type OptionProps,
  type PlaceholderProps,
  type SingleValueProps,
  type StylesConfig,
  type ValueContainerProps,
} from "react-select";
import AsyncSelectPrimitive, {
  type AsyncProps as SelectProps,
} from "react-select/async";

type ReactSelectProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> = SelectProps<Option, IsMulti, Group>;

/**
 * Tailwind classes mapped from your Radix `SelectTrigger`
 * Keep this in sync when you tweak tokens (or replace with your `cn` util).
 */
export const rsTriggerBase = (isDisabled?: boolean) =>
  cn(
    "txt-preset-4 text-grey-900 border-beige-500 placeholder:text-beige-500 cursor-pointer h-[3.125rem]",
    "data-[is-focused=true]:border-grey-900 aria-invalid:border-secondary-red",
    "flex !min-w-0 items-center justify-between gap-2 rounded-lg border bg-transparent",
    "whitespace-nowrap transition-[color] outline-none",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    // keep svg rules (svg children shouldn't capture pointer events)
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    // rotate svg when open/state -> we'll toggle `data-state` on the indicator
    "data-[placeholder]:text-beige-500",
    isDisabled && "pointer-events-none cursor-not-allowed opacity-50"
  );

/**
 * Option classes come from your SelectItem
 */
export const rsOptionBase = (isDisabled?: boolean, isSelected?: boolean) =>
  cn(
    "txt-preset-4 [&_svg:not([class*='text-'])]:text-grey-900 transition-colors",
    "relative flex w-full cursor-pointer items-center gap-2",
    "border-b py-3 outline-hidden select-none last:border-b-0 border-b-grey-100 flex-wrap",
    " [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    isDisabled ? "pointer-events-none opacity-50" : "hover:text-grey-500"
  );

/**
 * Menu wrapper classes copied from SelectContent
 */
export const rsMenuBase = cn(
  "text-grey-900 z-[50] max-h-[var(--radix-select-content-available-height)] max-h-[18.75rem]",
  "origin-[var(--radix-select-content-transform-origin)] overflow-x-hidden overflow-y-auto",
  "rounded-lg bg-white shadow-lg",
  "data-[state=open]:animate-in data-[state=closed]:animate-out",
  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
  "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
  "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
);

/**
 * Shared component configurations for both ReactSelect and ReactCreatable
 * This follows DRY principle by centralizing component definitions
 */
export const createRSSharedComponents = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
>(
  ariaInvalid?: boolean
) => ({
  Control: (controlProps: ControlProps<Option, IsMulti, Group>) => {
    const {
      children,
      innerRef,
      innerProps,
      selectProps,
      isFocused,
      isDisabled,
    } = controlProps;

    return (
      <div
        ref={innerRef}
        aria-invalid={ariaInvalid ?? false}
        className={rsTriggerBase(isDisabled)}
        data-state={selectProps.menuIsOpen ? "open" : "closed"}
        data-is-focused={isFocused ? "true" : "false"}
        {...innerProps}
      >
        {children}
      </div>
    );
  },
  DropdownIndicator: ({
    selectProps,
  }: DropdownIndicatorProps<Option, IsMulti, Group>) => {
    return (
      <button className="h-full px-4" type="button" tabIndex={-1}>
        <CaretDownIcon
          data-state={selectProps.menuIsOpen ? "open" : "closed"}
          className="size-4 rotate-0 transition-[rotate] data-[state=open]:rotate-180"
          weight="fill"
        />
      </button>
    );
  },
  IndicatorSeparator: () => null,
  SingleValue: (svProps: SingleValueProps<Option, IsMulti, Group>) => {
    return (
      <RSComponents.SingleValue {...svProps}>
        <div className="line-clamp-1 flex items-center gap-2">
          {svProps.children}
        </div>
      </RSComponents.SingleValue>
    );
  },
  ValueContainer: (vcProps: ValueContainerProps<Option, IsMulti, Group>) => {
    return (
      <RSComponents.ValueContainer
        {...vcProps}
        className="txt-preset-4 text-grey-900 !py-3 !pl-5"
      >
        {vcProps.children}
      </RSComponents.ValueContainer>
    );
  },
  Placeholder: (pProps: PlaceholderProps<Option, IsMulti, Group>) => {
    return (
      <RSComponents.Placeholder {...pProps} className="!text-beige-500">
        {pProps.children}
      </RSComponents.Placeholder>
    );
  },
  Menu: (menuProps: MenuProps<Option, IsMulti, Group>) => {
    return (
      <RSComponents.Menu {...menuProps} className={rsMenuBase}>
        {menuProps.children}
      </RSComponents.Menu>
    );
  },
  MenuList: (mlProps: MenuListProps<Option, IsMulti, Group>) => {
    return (
      <RSComponents.MenuList {...mlProps} className="p-5">
        {mlProps.children}
      </RSComponents.MenuList>
    );
  },
  Option: (optionProps: OptionProps<Option, IsMulti, Group>) => {
    const { isDisabled, isSelected, innerRef, innerProps, children } =
      optionProps;

    return (
      <div
        ref={innerRef}
        {...innerProps}
        role="option"
        aria-disabled={isDisabled}
        aria-selected={isSelected}
        className={rsOptionBase(isDisabled, isSelected)}
      >
        <div className="flex-1">{children}</div>

        <span className="absolute right-2 flex size-4 items-center justify-center">
          {isSelected ? (
            <span className="bg-secondary-green flex size-4 items-center justify-center rounded-full">
              <CheckIcon className="size-2 text-white" weight="bold" />
            </span>
          ) : null}
        </span>
      </div>
    );
  },
  GroupHeading: (gProps: GroupHeadingProps<Option, IsMulti, Group>) => {
    return (
      <RSComponents.GroupHeading
        {...gProps}
        className="txt-preset-4 text-grey-500 px-2 py-1.5"
      >
        {gProps.children}
      </RSComponents.GroupHeading>
    );
  },
  LoadingMessage: ({
    children,
    className,
    innerProps,
  }: NoticeProps<Option, IsMulti, Group>) => {
    return (
      <div
        className={cn("txt-preset-4 text-grey-500 py-3 text-center", className)}
        {...innerProps}
      >
        {children}
      </div>
    );
  },
});

/**
 * Shared classNames configuration
 */
export const sharedClassNames = {
  control: () => "",
  valueContainer: () => "!pl-5 !py-3 !min-w-0",
  singleValue: () => "line-clamp-1 !min-w-0",
  menu: () => rsMenuBase,
  menuList: () => "!px-5",
  option: (state: { isDisabled?: boolean; isSelected?: boolean }) =>
    cn(rsOptionBase(state.isDisabled, state.isSelected)),
  groupHeading: () => "txt-preset-4 text-grey-500 px-2 py-1.5",
  dropdownIndicator: () => "h-full px-4",
  indicatorSeparator: () => "hidden",
};

/**
 * Shared styles configuration
 */
export const createRSSharedStyles = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
>(): StylesConfig<Option, IsMulti, Group> => ({
  control: (base) => ({
    ...base,
    boxShadow: "none",
    border: "none",
  }),
  menu: (base) => ({ ...base, margin: 0 }),
  menuList: (base) => ({ ...base, padding: 0 }),
  option: (base) => base,
});

/**
 * Get menu portal target for SSR safety
 */
export const getMenuPortalTarget = () =>
  typeof document !== "undefined" ? document.getElementById("root") : undefined;

/* -------------------------
   ReactSelect Component
   ------------------------- */

export const ReactSelect = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({
  isSearchable = false,
  components,
  "aria-invalid": ariaInvalid,
  className,
  ...props
}: ReactSelectProps<Option, IsMulti, Group>) => {
  const portalTarget = getMenuPortalTarget();
  const normalizedAriaInvalid = ariaInvalid === true || ariaInvalid === "true";
  const baseComponents = createRSSharedComponents<Option, IsMulti, Group>(
    normalizedAriaInvalid
  );
  const styles = createRSSharedStyles<Option, IsMulti, Group>();

  return (
    <AsyncSelectPrimitive<Option, IsMulti, Group>
      aria-invalid={normalizedAriaInvalid}
      unstyled
      menuPlacement="auto"
      menuPosition="fixed"
      isSearchable={isSearchable}
      components={{
        ...baseComponents,
        ...components,
      }}
      className={cn("!min-w-0", className)}
      classNames={sharedClassNames}
      styles={styles}
      {...props}
    />
  );
};
