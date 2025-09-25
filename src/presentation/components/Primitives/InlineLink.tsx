"use client";

import Link from "next/link";

export const InlineLink = ({
  children,
  ...props
}: React.ComponentProps<typeof Link>) => {
  return (
    <Link
      className="txt-preset-4-bold text-grey-900 hover:text-grey-500 underline transition-colors"
      {...props}
    >
      {children}
    </Link>
  );
};
