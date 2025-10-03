"use client";

import Link from "next/link";
import React from "react";

export type PaginationButtonProps = {
  children: React.ReactNode;
  isActive?: boolean;
  disabled?: boolean;
  href?: string;
  onActivate?: () => void;
  ariaLabel?: string;
  className?: string;
};

const isPlainLeftClick = (e: React.MouseEvent) =>
  e.button === 0 && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey;

export const PaginationButton = ({
  children,
  isActive,
  disabled,
  href,
  onActivate,
  ariaLabel,
  className,
}: PaginationButtonProps) => {
  const baseClass =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-3 txt-preset-4 border-beige-500 transition-colors";

  const activeClass = isActive ? "bg-grey-900 text-white border" : "border";

  // only add hover styles if not active and not disabled
  const hoverClass =
    !isActive && !disabled ? "hover:text-white hover:bg-beige-500 group" : "";

  const composedClassName = `${baseClass} ${activeClass} ${hoverClass} ${className ?? ""}`;

  if (disabled) {
    return (
      <button
        type="button"
        disabled
        className={`${baseClass} cursor-not-allowed border opacity-50 ${className ?? ""}`}
        aria-label={ariaLabel}
      >
        {children}
      </button>
    );
  }

  if (href) {
    return (
      <Link
        href={href}
        className={composedClassName}
        aria-label={ariaLabel}
        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
          if (!onActivate) return; // allow default navigation
          if (!isPlainLeftClick(e)) return; // allow middle/modifier clicks
          e.preventDefault();
          onActivate();
        }}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onActivate?.()}
      className={composedClassName}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};
