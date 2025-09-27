"use client";

import { ArrowFatLinesLeftIcon } from "@phosphor-icons/react";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { Button, Logo } from "@/presentation/components/Primitives";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/presentation/components/UI";
import { useIsMobile } from "@/presentation/hooks";
import { cn } from "@/utils";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "18.75rem";
const SIDEBAR_WIDTH_MOBILE = "18.75rem";
const SIDEBAR_WIDTH_ICON = "5.5rem";
const SIDEBAR_PADDING = "1.5rem";

// Shared section styles used by multiple components
const SECTION_BASE_CLASSES =
  "relative flex w-full min-w-0 flex-col p-(--sidebar-padding) pr-(--sidebar-padding) pl-0 transition-[padding-right] group-data-[collapsible=icon]:pr-100";

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

const useSidebar = () => {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
};

const SidebarProvider = ({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const isMobile = useIsMobile();
  const [openMobile, setOpenMobile] = React.useState(false);

  // internal open state (can be controlled by props)
  const [_open, _setOpen] = React.useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // persist preference in cookie
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open]
  );

  // hydrate "open" state from cookie once on mount (only when uncontrolled)
  React.useEffect(() => {
    if (openProp !== undefined) return;
    const match = document.cookie.match(
      new RegExp(`(?:^|; )${SIDEBAR_COOKIE_NAME}=(true|false)`)
    );
    if (match) {
      _setOpen(match[1] === "true");
    }
  }, [openProp]);

  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, setOpen, setOpenMobile]);

  const state = open ? "expanded" : "collapsed";

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              "--sidebar-padding": SIDEBAR_PADDING,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            // base layout
            "group/sidebar-wrapper has-data-[variant=inset]:bg-grey-900 flex min-h-svh w-full",
            // external overrides
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
};

const Sidebar = ({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}) => {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

  // Non-collapsible (simple) sidebar
  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          // structure & colors
          "bg-grey-900 text-grey-300 flex h-full w-(--sidebar-width) flex-col overflow-x-hidden overflow-y-auto rounded-r-2xl",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  // Mobile (Sheet) variant
  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className={cn(
            // mobile sheet layout
            "bg-grey-900 text-grey-300 w-(--sidebar-width) rounded-r-2xl p-0 [&>button]:hidden"
          )}
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col overflow-x-hidden overflow-y-auto">
            {children}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop sidebar (collapsible / icon / offcanvas)
  return (
    <div
      className="group peer text-grey-300 hidden md:block"
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* sidebar gap: controls width used for content flow */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          // base sizing & transition
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
          // when collapsible = offcanvas, hide gap
          "group-data-[collapsible=offcanvas]:w-0",
          // right-side flip for rotated elements
          "group-data-[side=right]:rotate-180",
          // when collapsible is icon, use icon width (floating/inset slightly different calc)
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
        )}
      />

      <div
        data-slot="sidebar-container"
        className={cn(
          // container positioning
          "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",
          // side-specific placement and offcanvas behavior
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // variant-specific padding/width and borders
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]"
            : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
          // external overrides
          className
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className={cn(
            // inner panel styling
            "bg-grey-900 flex h-full w-full flex-col overflow-x-hidden overflow-y-auto rounded-r-2xl group-data-[variant=floating]:border-transparent",
            // floating variant modifications
            "group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const SidebarTrigger = ({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) => {
  const { toggleSidebar } = useSidebar();

  return (
    <SidebarMenuButton
      tooltip="Toggle Menu"
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <ArrowFatLinesLeftIcon
        weight="fill"
        className="size-6 shrink-0 rotate-0 group-data-[collapsible=icon]:rotate-180"
      />
      <span className="shrink-0">Toggle Menu</span>
    </SidebarMenuButton>
  );
};

const SidebarGroup = ({ className, ...props }: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn(SECTION_BASE_CLASSES, className)}
      {...props}
    />
  );
};

const SidebarRail = ({
  className,
  ...props
}: React.ComponentProps<"button">) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        // rail base & pseudo-element
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear sm:flex",
        // side-specific placement helpers
        "group-data-[side=left]:-right-4 group-data-[side=right]:left-0",
        // cursor hints (interactive)
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        // collapsed / expanded cursor overrides (complex selectors)
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        // hover + collapsible offcanvas interactions
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
        // offcanvas specific nudges
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  );
};

const SidebarHeader = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn(
        // header spacing
        "flex flex-col gap-2 overflow-clip px-(--sidebar-padding) py-500",
        className
      )}
      {...props}
    >
      <div className="ml-0 max-w-[7rem] overflow-clip transition-[max-width,margin-left] group-data-[collapsible=icon]:ml-[0.75rem] group-data-[collapsible=icon]:max-w-[1rem]">
        <Logo className="h-[1.6rem] w-fit" />
      </div>
    </div>
  );
};

const SidebarFooter = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn(SECTION_BASE_CLASSES, "gap-2", className)}
      {...props}
    />
  );
};

const SidebarContent = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        // main content area and overflow behavior
        "flex min-h-0 flex-1 flex-col gap-2 overflow-x-hidden overflow-y-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props}
    />
  );
};

const SidebarMenu = ({ className, ...props }: React.ComponentProps<"ul">) => {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn(
        // menu layout
        "flex w-full min-w-0 flex-col gap-1",
        className
      )}
      {...props}
    />
  );
};

const SidebarMenuItem = ({
  className,
  ...props
}: React.ComponentProps<"li">) => {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn(
        // item group wrapper
        "group/menu-item relative",
        className
      )}
      {...props}
    />
  );
};

const SidebarMenuButton = ({
  asChild = false,
  isActive = false,
  tooltip,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
}) => {
  const Comp = asChild ? Slot : "button";
  const { isMobile, state } = useSidebar();

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-active={isActive}
      className={cn(
        // base layout & spacing
        "txt-preset-3 relative flex w-full items-center gap-4 overflow-hidden rounded-r-2xl p-200 pl-(--sidebar-padding) text-left outline-hidden transition-[width,height,padding,color,background-color,gap] [&>svg]:ml-0 [&>svg]:transition-[margin-left,rotate]",

        // vertical left line
        "before:absolute before:top-0 before:bottom-0 before:left-0 before:w-1 before:bg-transparent before:transition-[background-color]",

        // interaction & ring
        "peer/menu-button hover:text-grey-100",

        // active state styles (data attribute-driven)
        "data-[active=true]:bg-beige-100 data-[active=true]:text-grey-900 data-[active=true]:before:bg-secondary-green data-[active=true]:[&>svg]:text-secondary-green",

        // group-based modifiers used by parent siblings
        "group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:gap-6! group-data-[collapsible=icon]:p-200! group-data-[collapsible=icon]:pl-(--sidebar-padding)! group-data-[collapsible=icon]:[&>svg]:ml-[0.46875rem]!",

        // accessibility and disabled states
        "focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",

        // child element selectors for truncation and svg size
        "[&>span:last-child]:truncate [&>svg]:size-6 [&>svg]:shrink-0",

        // allow override from callers
        className
      )}
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === "string") {
    tooltip = { children: tooltip };
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        sideOffset={5}
        hidden={state !== "collapsed" || isMobile}
        {...tooltip}
      />
    </Tooltip>
  );
};

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
};
