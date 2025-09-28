"use client";

import { User } from "@/core/schemas/userSchema";
import { UserDropdown } from "@/presentation/components/Features/PageHeader";
import { cn } from "@/utils";
import * as React from "react";

type PageHeaderProps = {
  title: string;
  actions?: React.ReactNode;
  user?: User | null;
  className?: string;
};

export function PageHeader({
  title,
  actions,
  user,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        // Layout
        "flex w-full items-center justify-between gap-300 py-300",
        className
      )}
    >
      <h1 className="txt-preset-1 text-grey-50 truncate">{title}</h1>

      <div className="flex items-center gap-200">
        {actions}
        {user ? <UserDropdown user={user} className="hidden sm:flex" /> : null}
      </div>
    </header>
  );
}
