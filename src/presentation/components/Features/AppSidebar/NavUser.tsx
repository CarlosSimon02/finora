"use client";

import { User } from "@/core/schemas/userSchema";
import { logoutAction } from "@/presentation/actions";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/presentation/components/UI";
import { DotsThreeIcon, SignOutIcon } from "@phosphor-icons/react";
import { useSidebar } from "./Sidebar";

type NavUserProps = {
  user: User;
};

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground bg-grey-800 hover:bg-grey-700 flex items-center gap-3 rounded-r-2xl px-300 py-200">
          <Avatar className="bg-grey-900 size-9 rounded-full">
            <AvatarImage
              src={user.photoURL ?? ""}
              alt={user.displayName ?? ""}
            />
            <AvatarFallback className="rounded-lg">
              {user.displayName?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="txt-preset-3 text-grey-100 truncate">
              {user.displayName}
            </span>
            <span className="txt-preset-5 truncate">{user.email}</span>
          </div>
          <DotsThreeIcon className="ml-auto size-6" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align="end"
        sideOffset={4}
      >
        <DropdownMenuItem onClick={logoutAction}>
          <SignOutIcon weight="fill" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
