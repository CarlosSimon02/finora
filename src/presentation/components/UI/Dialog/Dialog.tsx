"use client";

import { XCircleIcon } from "@phosphor-icons/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as React from "react";

import { cn } from "@/utils";

type RootProps = React.ComponentProps<typeof DialogPrimitive.Root>;
type TriggerProps = React.ComponentProps<typeof DialogPrimitive.Trigger>;
type PortalProps = React.ComponentProps<typeof DialogPrimitive.Portal>;
type CloseProps = React.ComponentProps<typeof DialogPrimitive.Close>;
type OverlayProps = React.ComponentProps<typeof DialogPrimitive.Overlay>;
type ContentProps = React.ComponentProps<typeof DialogPrimitive.Content>;
type TitleProps = React.ComponentProps<typeof DialogPrimitive.Title>;
type DescriptionProps = React.ComponentProps<
  typeof DialogPrimitive.Description
>;

const DialogRoot = (props: RootProps) => (
  <DialogPrimitive.Root data-slot="dialog" {...props} />
);

const DialogTrigger = (props: TriggerProps) => (
  <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
);

const DialogPortal = (props: PortalProps) => (
  <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
);

const DialogClose = (props: CloseProps) => (
  <DialogPrimitive.Close data-slot="dialog-close" {...props} />
);

const DialogOverlay = ({ className, ...props }: OverlayProps) => (
  <DialogPrimitive.Overlay
    data-slot="dialog-overlay"
    className={cn(
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
      className
    )}
    {...props}
  />
);

const DialogContent = ({ className, children, ...props }: ContentProps) => (
  <DialogPortal data-slot="dialog-portal">
    <DialogOverlay />
    <div className="absolute inset-0 flex content-start items-center justify-center p-5">
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 relative z-50 grid max-h-full min-h-0 w-full max-w-[35rem] gap-5 overflow-y-auto rounded-2xl bg-white p-5 shadow-lg duration-200 sm:p-8",
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </div>
  </DialogPortal>
);

const DialogHeader = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="dialog-header"
    className={cn("flex flex-col gap-5", className)}
    {...props}
  />
);

const DialogFooter = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    data-slot="dialog-footer"
    className={cn("flex flex-col-reverse gap-2", className)}
    {...props}
  />
);

const DialogTitle = ({ className, ...props }: TitleProps) => (
  <div className="flex items-center justify-between">
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("sm:txt-preset-1 txt-preset-2 flex-1", className)}
      {...props}
    />
    <DialogPrimitive.Close
      data-slot="dialog-close"
      className="text-grey-500 shrink-0 opacity-100 transition-opacity hover:opacity-50 disabled:pointer-events-none"
    >
      <XCircleIcon size={32} className="pointer-events-none shrink-0" />
      <span className="sr-only">Close</span>
    </DialogPrimitive.Close>
  </div>
);

const DialogDescription = ({ className, ...props }: DescriptionProps) => (
  <DialogPrimitive.Description
    data-slot="dialog-description"
    className={cn("txt-preset-4 text-grey-500", className)}
    {...props}
  />
);

type DialogType = typeof DialogRoot & {
  Trigger: typeof DialogTrigger;
  Portal: typeof DialogPortal;
  Close: typeof DialogClose;
  Overlay: typeof DialogOverlay;
  Content: typeof DialogContent;
  Header: typeof DialogHeader;
  Footer: typeof DialogFooter;
  Title: typeof DialogTitle;
  Description: typeof DialogDescription;
};

const Dialog = DialogRoot as DialogType;
Dialog.Trigger = DialogTrigger;
Dialog.Portal = DialogPortal;
Dialog.Close = DialogClose;
Dialog.Overlay = DialogOverlay;
Dialog.Content = DialogContent;
Dialog.Header = DialogHeader;
Dialog.Footer = DialogFooter;
Dialog.Title = DialogTitle;
Dialog.Description = DialogDescription;

export { Dialog };
