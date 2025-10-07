"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as React from "react";

import { cn } from "@/utils";

type RootProps = React.ComponentProps<typeof PopoverPrimitive.Root>;
type TriggerProps = React.ComponentProps<typeof PopoverPrimitive.Trigger>;
type PortalProps = React.ComponentProps<typeof PopoverPrimitive.Portal>;
type ContentProps = React.ComponentProps<typeof PopoverPrimitive.Content>;
type AnchorProps = React.ComponentProps<typeof PopoverPrimitive.Anchor>;

const PopoverRoot = (props: RootProps) => (
  <PopoverPrimitive.Root data-slot="popover" {...props} />
);

const PopoverTrigger = (props: TriggerProps) => (
  <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
);

const PopoverPortal = (props: PortalProps) => (
  <PopoverPrimitive.Portal data-slot="popover-portal" {...props} />
);

const PopoverContent = ({
  className,
  align = "center",
  sideOffset = 4,
  ...props
}: ContentProps) => (
  <PopoverPortal data-slot="popover-portal">
    <PopoverPrimitive.Content
      data-slot="popover-content"
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "text-grey-900 relative z-99",
        "origin-[var(--radix-popover-content-transform-origin)] overflow-x-hidden overflow-y-auto",
        "rounded-lg bg-white shadow-lg",
        "w-72 p-4 outline-hidden",
        className
      )}
      {...props}
    />
  </PopoverPortal>
);

const PopoverAnchor = (props: AnchorProps) => (
  <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
);

type PopoverType = typeof PopoverRoot & {
  Trigger: typeof PopoverTrigger;
  Portal: typeof PopoverPortal;
  Content: typeof PopoverContent;
  Anchor: typeof PopoverAnchor;
};

const Popover = PopoverRoot as PopoverType;
Popover.Trigger = PopoverTrigger;
Popover.Portal = PopoverPortal;
Popover.Content = PopoverContent;
Popover.Anchor = PopoverAnchor;

export { Popover };
