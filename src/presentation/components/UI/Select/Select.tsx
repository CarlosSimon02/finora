"use client";

import { CaretDownIcon, CaretUpIcon, CheckIcon } from "@phosphor-icons/react";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as React from "react";

import { cn } from "@/utils";

type RootProps = React.ComponentProps<typeof SelectPrimitive.Root>;
type GroupProps = React.ComponentProps<typeof SelectPrimitive.Group>;
type ValueProps = React.ComponentProps<typeof SelectPrimitive.Value>;
type TriggerProps = React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: "sm" | "default";
};
type ContentProps = React.ComponentProps<typeof SelectPrimitive.Content>;
type LabelProps = React.ComponentProps<typeof SelectPrimitive.Label>;
type ItemProps = React.ComponentProps<typeof SelectPrimitive.Item>;
type SeparatorProps = React.ComponentProps<typeof SelectPrimitive.Separator>;
type ScrollUpButtonProps = React.ComponentProps<
  typeof SelectPrimitive.ScrollUpButton
>;
type ScrollDownButtonProps = React.ComponentProps<
  typeof SelectPrimitive.ScrollDownButton
>;

const SelectRoot = (props: RootProps) => (
  <SelectPrimitive.Root data-slot="select" {...props} />
);

const SelectGroup = (props: GroupProps) => (
  <SelectPrimitive.Group data-slot="select-group" {...props} />
);

const SelectValue = (props: ValueProps) => (
  <SelectPrimitive.Value data-slot="select-value" {...props} />
);

const SelectTrigger = ({
  className,
  size = "default",
  children,
  ...props
}: TriggerProps) => (
  <SelectPrimitive.Trigger
    data-slot="select-trigger"
    className={cn(
      "text-preset-4 text-grey-900 border-beige-500 placeholder:text-beige-500 focus-visible:border-grey-900 aria-invalid:border-secondary-red flex w-full min-w-0 items-center justify-between gap-2 rounded-lg border bg-transparent px-5 py-3 whitespace-nowrap transition-[color] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
      "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      "*:[data-slot=select-value]:line-clamp-1 *:[data-slot=select-value]:flex *:[data-slot=select-value]:items-center *:[data-slot=select-value]:gap-2",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <CaretDownIcon className="size-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
);

const SelectContent = ({ className, children, ...props }: ContentProps) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      data-slot="select-content"
      className={cn(
        "text-grey-900 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-white shadow-md",
        className
      )}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport className={cn("p-1")}>
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
);

const SelectLabel = ({ className, ...props }: LabelProps) => (
  <SelectPrimitive.Label
    data-slot="select-label"
    className={cn("txt-preset-4 text-grey-500 px-2 py-1.5", className)}
    {...props}
  />
);

const SelectItem = ({ className, children, ...props }: ItemProps) => (
  <SelectPrimitive.Item
    data-slot="select-item"
    className={cn(
      "focus:bg-accent txt-preset-4 focus:text-grey-500 [&_svg:not([class*='text-'])]:text-grey-900 relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
      className
    )}
    {...props}
  >
    <span className="absolute right-2 flex size-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
);

const SelectSeparator = ({ className, ...props }: SeparatorProps) => (
  <SelectPrimitive.Separator
    data-slot="select-separator"
    className={cn("bg-grey-100 pointer-events-none -mx-1 my-1 h-px", className)}
    {...props}
  />
);

const SelectScrollUpButton = ({ className, ...props }: ScrollUpButtonProps) => (
  <SelectPrimitive.ScrollUpButton
    data-slot="select-scroll-up-button"
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <CaretUpIcon className="size-4" />
  </SelectPrimitive.ScrollUpButton>
);

const SelectScrollDownButton = ({
  className,
  ...props
}: ScrollDownButtonProps) => (
  <SelectPrimitive.ScrollDownButton
    data-slot="select-scroll-down-button"
    className={cn(
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    <CaretDownIcon className="size-4" />
  </SelectPrimitive.ScrollDownButton>
);

type SelectType = typeof SelectRoot & {
  Group: typeof SelectGroup;
  Value: typeof SelectValue;
  Trigger: typeof SelectTrigger;
  Content: typeof SelectContent;
  Label: typeof SelectLabel;
  Item: typeof SelectItem;
  Separator: typeof SelectSeparator;
  ScrollUpButton: typeof SelectScrollUpButton;
  ScrollDownButton: typeof SelectScrollDownButton;
};

const Select = SelectRoot as SelectType;
Select.Group = SelectGroup;
Select.Value = SelectValue;
Select.Trigger = SelectTrigger;
Select.Content = SelectContent;
Select.Label = SelectLabel;
Select.Item = SelectItem;
Select.Separator = SelectSeparator;
Select.ScrollUpButton = SelectScrollUpButton;
Select.ScrollDownButton = SelectScrollDownButton;

export { Select };
