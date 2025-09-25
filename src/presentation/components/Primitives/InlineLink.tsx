"use client";

import { cn } from "@/utils";
import Link from "next/link";

export const InlineLink = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Link>) => {
  return (
    <Link
      className={cn(
        "txt-preset-4-bold text-grey-900 hover:text-grey-500 underline transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
};
