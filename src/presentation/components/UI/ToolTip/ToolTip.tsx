"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as React from "react";

import { cn } from "@/utils";

type ProviderProps = React.ComponentProps<typeof TooltipPrimitive.Provider>;
type RootProps = React.ComponentProps<typeof TooltipPrimitive.Root>;
type TriggerProps = React.ComponentProps<typeof TooltipPrimitive.Trigger>;
type ContentProps = React.ComponentProps<typeof TooltipPrimitive.Content>;

const TooltipProvider = ({ delayDuration = 1000, ...props }: ProviderProps) => {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  );
};

const TooltipRoot = ({ ...props }: RootProps) => {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  );
};

const TooltipTrigger = ({ ...props }: TriggerProps) => {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
};

const TooltipContent = ({
  className,
  sideOffset = 0,
  children,
  ...props
}: ContentProps) => {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-grey-900 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 txt-preset-5 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-balance text-white",
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="bg-grey-900 fill-grey-900 z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  );
};

type TooltipType = typeof TooltipRoot & {
  Provider: typeof TooltipProvider;
  Trigger: typeof TooltipTrigger;
  Content: typeof TooltipContent;
};

const Tooltip = TooltipRoot as TooltipType;
Tooltip.Provider = TooltipProvider;
Tooltip.Trigger = TooltipTrigger;
Tooltip.Content = TooltipContent;

export { Tooltip };
