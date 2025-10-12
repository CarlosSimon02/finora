// File: components/ui/Pagination/Pagination.tsx
"use client";

import { useIsMobile } from "@/presentation/hooks";
import { cn } from "@/utils";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import { PaginationButton } from "./PaginationButton";
import { getPageNumbersResponsive } from "./utils";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  getPageHref?: (page: number) => string;
  className?: string;
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
    const disabled = safeCurrentPage === 1;
    const targetPage = Math.max(1, safeCurrentPage - 1);
    const href = disabled ? undefined : getPageHref?.(targetPage);
    const onClick = () => go(targetPage);

    return (
      <PaginationButton
        disabled={disabled}
        href={href}
        onActivate={onClick}
        ariaLabel="Previous page"
        className="gap-3"
      >
        <CaretLeftIcon
          className="text-grey-500 size-4 transition-colors group-hover:text-white"
          weight="fill"
        />
        <span className="@max-md/pagination:hidden">Prev</span>
      </PaginationButton>
    );
  };

  const renderNext = () => {
    const disabled = safeCurrentPage === safeTotalPages;
    const targetPage = Math.min(safeTotalPages, safeCurrentPage + 1);
    const href = disabled ? undefined : getPageHref?.(targetPage);
    const onClick = () => go(targetPage);

    return (
      <PaginationButton
        disabled={disabled}
        href={href}
        onActivate={onClick}
        ariaLabel="Next page"
        className="gap-3"
      >
        <span className="@max-md/pagination:hidden">Next</span>
        <CaretRightIcon
          className="text-grey-500 size-4 transition-colors group-hover:text-white"
          weight="fill"
        />
      </PaginationButton>
    );
  };

  return (
    <nav
      className={cn(
        `@container/pagination flex flex-wrap items-center justify-center gap-2 py-4`,
        className
      )}
      aria-label="Pagination"
    >
      {renderPrev()}

      {pageNumbers.map((p, i) =>
        p === -1 ? (
          <span key={`ellipsis-${i}`} className="px-2" aria-hidden="true">
            …
          </span>
        ) : (
          <PaginationButton
            key={p}
            isActive={p === safeCurrentPage}
            href={getPageHref?.(p)}
            onActivate={() => go(p)}
          >
            {p}
          </PaginationButton>
        )
      )}

      {renderNext()}
    </nav>
  );
};
