"use client";

import { CaretDownIcon, CheckIcon } from "@phosphor-icons/react";
import ReactSelectPrimitive, {
  components as RSComponents,
  type GroupBase,
  type Props as SelectProps,
} from "react-select";

/**
 * Small helper to join class strings (you probably already have `cn` in your project;
 * swap this out for that if you prefer).
 */
const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(" ");

type ReactSelectProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
> = SelectProps<Option, IsMulti, Group>;

/**
 * Tailwind classes mapped from your Radix `SelectTrigger`
 * Keep this in sync when you tweak tokens (or replace with your `cn` util).
 */
const triggerBase = () =>
  cx(
    "text-preset-4 text-grey-900 border-beige-500 placeholder:text-beige-500",
    "data-[is-focused=true]:border-grey-900 aria-invalid:border-secondary-red",
    "flex min-w-0 items-center justify-between gap-2 rounded-lg border bg-transparent",
    "whitespace-nowrap transition-[color] outline-none",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    // keep svg rules (svg children shouldn't capture pointer events)
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    // rotate svg when open/state -> we'll toggle `data-state` on the indicator
    "data-[placeholder]:text-beige-500"
  );

/**
 * Option classes come from your SelectItem
 */
const optionBase = (isDisabled?: boolean, isSelected?: boolean) =>
  cx(
    "txt-preset-4 [&_svg:not([class*='text-'])]:text-grey-900",
    "relative flex w-full cursor-pointer items-center gap-2",
    "border-b py-3 pr-8 pl-0 outline-hidden select-none last:border-b-0 border-b-grey-100",
    " [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    isDisabled
      ? "pointer-events-none opacity-50"
      : "hover:bg-accent hover:text-grey-500"
  );

/**
 * Menu wrapper classes copied from SelectContent
 */
const menuBase = cx(
  "text-grey-900 relative z-99 max-h-[var(--radix-select-content-available-height)] max-h-[18.75rem]",
  "origin-[var(--radix-select-content-transform-origin)] overflow-x-hidden overflow-y-auto",
  "rounded-lg bg-white shadow-lg",
  "data-[state=open]:animate-in data-[state=closed]:animate-out",
  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
  "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
  "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
  "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
);

/* -------------------------
   Final exported component
   ------------------------- */

export const ReactSelect = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>({
  isSearchable = false,
  components,
  "aria-invalid": ariaInvalid,
  ...props
}: ReactSelectProps<Option, IsMulti, Group>) => {
  // safe menuPortalTarget for SSR (if needed); in client-only components you can directly use document.body
  const portalTarget =
    typeof document !== "undefined"
      ? document.getElementById("root")
      : undefined;

  return (
    <ReactSelectPrimitive<Option, IsMulti, Group>
      aria-invalid={ariaInvalid ?? false}
      // unstyled gives us full control with classNames/components
      unstyled
      // keep behavior similar to Radix popper placement
      menuPlacement="auto"
      menuPosition="fixed"
      menuPortalTarget={portalTarget}
      isSearchable={isSearchable}
      // react-select merges selectProps with the rest, so we put it on `selectProps`
      // NOTE: users of this component can also pass selectProps in props to override this.
      // component overrides: small focused set so it's easy to maintain
      components={{
        Control: (controlProps) => {
          const { children, innerRef, innerProps, selectProps, isFocused } =
            controlProps;

          return (
            <div
              ref={innerRef}
              {...innerProps}
              aria-invalid={ariaInvalid ?? false}
              // react-select gives a calculated className we ignore to apply our Tailwind exactly
              className={triggerBase()}
              // copy data attributes you'd like to rely on — react-select exposes menuIsOpen via selectProps
              data-state={selectProps.menuIsOpen ? "open" : "closed"}
              data-is-focused={isFocused ? "true" : "false"}
            >
              {children}
            </div>
          );
        },
        DropdownIndicator: ({ selectProps }) => {
          return (
            // button type to avoid submitting forms; tabIndex -1 to avoid being focusable separately
            <button className="h-full px-4" type="button" tabIndex={-1}>
              <CaretDownIcon
                data-state={selectProps.menuIsOpen ? "open" : "closed"}
                // keep the exact transition and rotate token you used
                className="size-4 rotate-0 transition-[rotate] data-[state=open]:rotate-180"
                weight="fill"
              />
            </button>
          );
        },
        IndicatorSeparator: () => null,
        SingleValue: (svProps) => {
          return (
            <RSComponents.SingleValue {...svProps}>
              <div className="line-clamp-1 flex items-center gap-2">
                {svProps.children}
              </div>
            </RSComponents.SingleValue>
          );
        },
        ValueContainer: (vcProps) => {
          // we maintain padding left (pl-5) and vertical padding consistent with trigger
          return (
            <RSComponents.ValueContainer
              {...vcProps}
              className="txt-preset-4 text-grey-900 !py-3 !pl-5"
            >
              {vcProps.children}
            </RSComponents.ValueContainer>
          );
        },
        Placeholder: (pProps) => {
          return (
            <RSComponents.Placeholder {...pProps} className="!text-beige-500">
              {pProps.children}
            </RSComponents.Placeholder>
          );
        },
        Menu: (menuProps) => {
          // menuProps.children is typically a MenuList; we keep a wrapper to apply the base menu classes.
          return (
            <RSComponents.Menu {...menuProps} className={menuBase}>
              {menuProps.children}
            </RSComponents.Menu>
          );
        },
        MenuList: (mlProps) => {
          // we apply padding and the popper-specific width/height rules via classes.
          // Note: react-select handles width/placement; keep these classes for visual parity.
          return (
            <RSComponents.MenuList {...mlProps} className="p-5">
              {mlProps.children}
            </RSComponents.MenuList>
          );
        },
        Option: (optionProps) => {
          const { isDisabled, isSelected, innerRef, innerProps, children } =
            optionProps;

          return (
            <div
              ref={innerRef}
              {...innerProps}
              role="option"
              aria-disabled={isDisabled}
              aria-selected={isSelected}
              className={optionBase(isDisabled, isSelected)}
            >
              <div className="flex-1">{children}</div>

              {/* trailing check icon position matches your Radix markup */}
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
        GroupHeading: (gProps) => {
          return (
            <RSComponents.GroupHeading
              {...gProps}
              className="txt-preset-4 text-grey-500 px-2 py-1.5"
            >
              {gProps.children}
            </RSComponents.GroupHeading>
          );
        },
        // keep original RS components available for composability
        ...components,
      }}
      // use classNames only for parts we want to map class-based overrides on top of our custom components
      // (we keep this minimal since custom components already set classes; included here for extensibility)
      classNames={{
        // react-select calls the function with state; return empty since Control/ValueContainer set classes
        control: () => "",
        valueContainer: () => "!pl-5 !py-3",
        singleValue: () => "line-clamp-1",
        menu: () => menuBase,
        menuList: () => "!px-5",
        option: (state) =>
          cx(
            // base + disabled / selected modifiers
            optionBase(state.isDisabled, state.isSelected)
          ),
        groupHeading: () => "txt-preset-4 text-grey-500 px-2 py-1.5",
        dropdownIndicator: () => "h-full px-4",
        indicatorSeparator: () => "hidden",
      }}
      // minimal inline styles so react-select internals don't interfere with our layout
      styles={{
        control: (base) => ({ ...base, boxShadow: "none", border: "none" }),
        menu: (base) => ({ ...base, margin: 0 }), // we use p-5 etc via classes
        menuList: (base) => ({ ...base, padding: 0 }), // handled by our MenuList
        option: (base) => ({ ...base }), // keep react-select inline styles minimal
      }}
      {...props}
    />
  );
};
