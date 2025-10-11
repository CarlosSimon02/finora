"use client";

import { User } from "@/core/schemas";
import { logoutAction } from "@/presentation/actions";
import { Avatar, DropdownMenu, Tooltip } from "@/presentation/components/UI";
import { SignOutIcon } from "@phosphor-icons/react";
import { useSidebar } from "./Sidebar";

type NavUserProps = {
  user: User;
};

export function NavUser({ user }: NavUserProps) {
  const { isMobile, state } = useSidebar();

  return (
    <DropdownMenu>
      <Tooltip>
        <Tooltip.Trigger asChild>
          <DropdownMenu.Trigger asChild>
            <button
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground bg-grey-900 hover:bg-grey-700 flex items-center gap-3 rounded-r-2xl px-300 py-200"
              suppressHydrationWarning
              aria-label="User menu"
            >
              <Avatar className="bg-grey-900 size-9 rounded-full">
                <Avatar.Image
                  src={user.photoURL ?? ""}
                  alt={user.displayName ?? user.email ?? "User avatar"}
                />
                <Avatar.Fallback className="rounded-lg">
                  {(user.displayName || user.email || "U")
                    .slice(0, 1)
                    .toUpperCase()}
                </Avatar.Fallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="txt-preset-4-bold text-grey-100 truncate">
                  {user.displayName}
                </span>
                <span className="txt-preset-5 truncate">{user.email}</span>
              </div>
            </button>
          </DropdownMenu.Trigger>
        </Tooltip.Trigger>
        <Tooltip.Content
          side="right"
          align="center"
          sideOffset={5}
          hidden={state !== "collapsed" || isMobile}
        >
          {user.displayName || user.email || "User"}
        </Tooltip.Content>
      </Tooltip>
      <DropdownMenu.Content
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenu.Item onClick={logoutAction} variant="destructive">
          <SignOutIcon weight="fill" className="size-4" />
          Log out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}
