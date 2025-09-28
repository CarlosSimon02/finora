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
import { cn } from "@/utils";
import { DotsThreeIcon, SignOutIcon } from "@phosphor-icons/react";

type UserDropdownProps = {
  user: User;
  className?: string;
};

export function UserDropdown({ user, className }: UserDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "bg-grey-800 hover:bg-grey-700 flex items-center gap-3 rounded-full px-200 py-150",
            className
          )}
          aria-label="User menu"
        >
          <Avatar className="bg-grey-900 size-8 rounded-full">
            <AvatarImage
              src={user.photoURL ?? ""}
              alt={user.displayName ?? user.email ?? "User avatar"}
            />
            <AvatarFallback className="rounded-full">
              {(user.displayName || user.email || "U")
                .slice(0, 1)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <DotsThreeIcon className="hidden size-5 sm:inline" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-48 rounded-lg"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuItem onClick={logoutAction} variant="destructive">
          <SignOutIcon weight="fill" className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
