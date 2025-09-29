"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import * as React from "react";

import { cn } from "@/utils";

type RootProps = React.ComponentProps<typeof DropdownMenuPrimitive.Root>;
type TriggerProps = React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>;
type ContentProps = React.ComponentProps<typeof DropdownMenuPrimitive.Content>;
type ItemProps = React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  inset?: boolean;
  variant?: "default" | "destructive";
};

const DropdownMenuRoot = (props: RootProps) => (
  <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
);

const DropdownMenuTrigger = (props: TriggerProps) => {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  );
};

const DropdownMenuContent = ({
  className,
  sideOffset = 4,
  ...props
}: ContentProps) => {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          // Base layout & appearance
          "text-grey-900 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-white p-1 shadow-md",

          // Animation (open/close transitions)
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",

          // Slide-in by side
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",
          "data-[side=top]:slide-in-from-bottom-2",

          className
        )}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
};

const DropdownMenuItem = ({
  className,
  inset,
  variant = "default",
  ...props
}: ItemProps) => {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        // Base layout
        "txt-preset-4-bold relative flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none",

        // Focus & hover states
        "focus:bg-accent focus:text-accent-foreground",

        // Disabled state
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",

        // Inset modifier
        "data-[inset]:pl-8",

        // Variant: destructive
        "data-[variant=destructive]:text-secondary-red",
        "data-[variant=destructive]:focus:text-secondary-red",
        "data-[variant=destructive]:focus:bg-secondary-red/10",
        "dark:data-[variant=destructive]:focus:bg-secondary-red/10",
        "data-[variant=destructive]:*:[svg]:!text-secondary-red",

        // SVG child selectors
        "[&_svg]:pointer-events-none",
        "[&_svg]:shrink-0",
        "[&_svg:not([class*='size-'])]:size-4",
        "[&_svg:not([class*='text-'])]:text-muted-foreground",

        className
      )}
      {...props}
    />
  );
};

type DropdownMenuType = typeof DropdownMenuRoot & {
  Trigger: typeof DropdownMenuTrigger;
  Content: typeof DropdownMenuContent;
  Item: typeof DropdownMenuItem;
};

const DropdownMenu = DropdownMenuRoot as DropdownMenuType;
DropdownMenu.Trigger = DropdownMenuTrigger;
DropdownMenu.Content = DropdownMenuContent;
DropdownMenu.Item = DropdownMenuItem;

export { DropdownMenu };
