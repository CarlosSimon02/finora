"use client";

import { cn } from "@/utils";
import Link from "next/link";

export const InlineLink = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Link>) => {
  return (
    <Link className={cn("inline-link", className)} {...props}>
      {children}
    </Link>
  );
};
