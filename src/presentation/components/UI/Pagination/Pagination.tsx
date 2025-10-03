// File: components/ui/Pagination/Pagination.tsx
"use client";

import { useIsMobile } from "@/presentation/hooks";
import Link from "next/link";
import React from "react";
import { getPageNumbersResponsive } from "./utils";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  getPageHref?: (page: number) => string;
  className?: string;
};

const isPlainLeftClick = (e: React.MouseEvent) => {
  return e.button === 0 && !e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey;
};

const NavNode = ({
  page,
  isActive,
  href,
  onNavigate,
  children,
  ariaLabel,
}: {
  page: number | string;
  isActive?: boolean;
  href?: string;
  onNavigate?: (p: number) => void;
  children?: React.ReactNode;
  ariaLabel?: string;
}) => {
  const commonClass =
    "inline-flex h-8 w-8 items-center justify-center rounded-md px-2 text-sm";
  const activeClass = isActive ? "bg-slate-900 text-white" : "border";

  // ellipsis or other non-numeric nodes
  if (typeof page === "string" || page === -1) {
    return (
      <span className="px-2" aria-hidden="true">
        …
      </span>
    );
  }

  const numericPage = page as number;

  if (href) {
    return (
      <Link
        key={numericPage}
        href={href}
        onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
          // allow middle click / modifiers to behave normally
          if (!onNavigate) return;
          if (!isPlainLeftClick(e)) return;
          e.preventDefault();
          onNavigate(numericPage);
        }}
        className={`${commonClass} ${isActive ? activeClass : "border"}`}
        aria-current={isActive ? "page" : undefined}
        aria-label={ariaLabel}
      >
        {children ?? numericPage}
      </Link>
    );
  }

  return (
    <button
      key={numericPage}
      type="button"
      onClick={() => onNavigate?.(numericPage)}
      className={`${commonClass} ${isActive ? activeClass : "border"}`}
      aria-current={isActive ? "page" : undefined}
      aria-label={ariaLabel}
    >
      {children ?? numericPage}
    </button>
  );
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  getPageHref,
  className,
}: PaginationProps) => {
  if (!onPageChange && !getPageHref) {
    console.warn(
      "Pagination: provide onPageChange or getPageHref so the component can navigate."
    );
  }

  const isMobile = useIsMobile();
  const isDesktop = !isMobile;

  // Clamp incoming props to ensure stable UI even if caller passes out-of-bounds
  const safeTotalPages = Math.max(totalPages, 1);
  const safeCurrentPage = Math.min(Math.max(currentPage, 1), safeTotalPages);

  const pagesToShow = isDesktop ? 5 : 3;
  const pageNumbers = getPageNumbersResponsive(
    safeCurrentPage,
    safeTotalPages,
    pagesToShow
  );

  const go = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange?.(page);
  };

  const renderPrev = () => {
    if (safeCurrentPage === 1) {
      return (
        <button
          type="button"
          disabled
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border px-2 text-sm disabled:opacity-50"
          aria-label="Previous page"
        >
          ‹
        </button>
      );
    }

    const href = getPageHref?.(safeCurrentPage - 1);
    return (
      <NavNode
        page={safeCurrentPage - 1}
        href={href}
        onNavigate={go}
        ariaLabel="Previous page"
      >
        ‹
      </NavNode>
    );
  };

  const renderNext = () => {
    if (safeCurrentPage === safeTotalPages) {
      return (
        <button
          type="button"
          disabled
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border px-2 text-sm disabled:opacity-50"
          aria-label="Next page"
        >
          ›
        </button>
      );
    }

    const href = getPageHref?.(safeCurrentPage + 1);
    return (
      <NavNode
        page={safeCurrentPage + 1}
        href={href}
        onNavigate={go}
        ariaLabel="Next page"
      >
        ›
      </NavNode>
    );
  };

  return (
    <nav
      className={`flex items-center justify-center space-x-2 py-4 ${className ?? ""}`}
      aria-label="Pagination"
    >
      {renderPrev()}

      <div className="flex items-center space-x-2">
        {pageNumbers.map((p, i) =>
          p === -1 ? (
            <span key={`ellipsis-${i}`} className="px-2" aria-hidden="true">
              …
            </span>
          ) : (
            <NavNode
              key={p}
              page={p}
              isActive={p === safeCurrentPage}
              href={getPageHref?.(p)}
              onNavigate={go}
            />
          )
        )}
      </div>

      {renderNext()}
    </nav>
  );
};
