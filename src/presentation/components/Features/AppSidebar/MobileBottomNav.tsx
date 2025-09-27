"use client";

import { NAV_MAIN } from "@/constants/nav";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/presentation/components/UI";
import { cn } from "@/utils";

type MobileBottomNavProps = {
  className?: string;
};

export function MobileBottomNav({ className }: MobileBottomNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "bg-grey-900 text-grey-300 sticky inset-x-0 bottom-0 z-20 block rounded-t-2xl px-200 pt-100 shadow-lg md:hidden",
        className
      )}
      aria-label="Primary"
    >
      <div className="container mx-auto flex w-full items-stretch justify-between">
        {NAV_MAIN.map((item) => {
          const isActive = pathname.startsWith(item.url);
          return (
            <Tooltip key={item.title}>
              <TooltipTrigger asChild>
                <Link
                  href={item.url}
                  className={cn(
                    // Base button-like layout similar to SidebarMenuButton
                    "txt-preset-5-bold relative flex max-w-[6.375rem] flex-1 flex-col items-center gap-50 rounded-t-lg px-2 pt-100 pb-150 text-center outline-hidden transition-colors",
                    // Icon size and spacing
                    "[&>svg]:size-6 [&>svg]:shrink-0",
                    // Hover / focus
                    "focus-visible:ring-2",
                    // Active colors similar to sidebar
                    isActive
                      ? "bg-beige-100 text-grey-900"
                      : "hover:text-grey-100"
                  )}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={item.title}
                >
                  <item.icon
                    weight="fill"
                    className={cn(
                      isActive ? "text-secondary-green" : undefined
                    )}
                  />
                  {/* Show label on sm+; hide on xs */}
                  <span className="txt-preset-5 hidden truncate leading-none sm:inline">
                    {item.title}
                  </span>

                  {/* Bottom horizontal accent line when active (instead of left vertical) */}
                  <span
                    aria-hidden
                    className={cn(
                      "pointer-events-none absolute inset-x-0 bottom-0 h-1 bg-transparent transition-colors",
                      isActive ? "bg-secondary-green" : "bg-transparent"
                    )}
                  />
                </Link>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                align="center"
                sideOffset={6}
                className="sm:hidden"
              >
                {item.title}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </nav>
  );
}
