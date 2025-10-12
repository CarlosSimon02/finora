"use client";

import { COLOR_OPTIONS, ColorValue } from "@/constants/colors";
import { TransactionDto } from "@/core/schemas";
import {
  Button,
  Card,
  InlineEmptyState,
  TransactionItem,
} from "@/presentation/components/Primitives";
import { cn } from "@/utils";
import { CaretRightIcon } from "@phosphor-icons/react";
import React from "react";

type ItemCardRootProps = {
  children: React.ReactNode;
  className?: string;
};

const ItemCardRoot = ({ children, className }: ItemCardRootProps) => (
  <Card className={cn("grid gap-5", className)}>{children}</Card>
);

type ItemCardHeaderProps = {
  name: string;
  colorTag?: string;
  actions: React.ReactNode;
  testId?: string;
};

const ItemCardHeader = ({
  name,
  colorTag,
  actions,
  testId,
}: ItemCardHeaderProps) => (
  <div
    className="flex flex-row items-center justify-between gap-10 pb-2"
    data-testid={testId}
  >
    <div className="flex items-center gap-4">
      <div
        className="size-4 shrink-0 rounded-full"
        style={{ backgroundColor: colorTag ?? "transparent" }}
      />
      <h3 className="txt-preset-2">{name}</h3>
    </div>
    {actions}
  </div>
);

type ItemCardProgressBarProps = {
  percent: number;
  color?: string;
  className?: string;
  ariaLabel?: string;
};

const ItemCardProgressBar = ({
  percent,
  color,
  className,
  ariaLabel,
}: ItemCardProgressBarProps) => {
  const safePercent = Number.isFinite(percent)
    ? Math.max(0, Math.min(100, percent))
    : 0;
  return (
    <div
      className={cn(
        "bg-beige-100 mb-3 h-2 w-full overflow-hidden rounded-full",
        className
      )}
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuenow={Math.round(safePercent)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-lg"
        style={{
          width: `${safePercent}%`,
          backgroundColor: color,
        }}
      />
    </div>
  );
};

type ItemCardTransactionsListProps = {
  transactions: TransactionDto[];
  emptyColorTag: ColorValue;
  seeAllHref: string;
  isSpending?: boolean;
  title: string;
};

const ItemCardTransactionsList = ({
  transactions,
  emptyColorTag,
  seeAllHref,
  isSpending = false,
  title,
}: ItemCardTransactionsListProps) => {
  return (
    <div className="bg-beige-100 space-y-5 rounded-xl p-5">
      <div className="flex items-center justify-between">
        <h4 className="txt-preset-3-bold">{title}</h4>
        <Button
          variant="tertiary"
          label="See all"
          icon={{
            component: CaretRightIcon,
            weight: "fill",
            size: "sm",
            loc: "right",
          }}
          href={seeAllHref}
        />
      </div>
      {transactions.length > 0 ? (
        <div>
          {transactions.map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              showCategory={false}
              className="border-b-grey-500/20"
              emojiClassName="bg-white"
            />
          ))}
        </div>
      ) : (
        <InlineEmptyState
          message="No transactions yet"
          color={COLOR_OPTIONS.find((c) => c.value === emptyColorTag)?.label}
          className="h-fit"
        />
      )}
    </div>
  );
};

type ItemCardType = typeof ItemCardRoot & {
  Header: typeof ItemCardHeader;
  ProgressBar: typeof ItemCardProgressBar;
  TransactionsList: typeof ItemCardTransactionsList;
};

const ItemCard = ItemCardRoot as ItemCardType;
ItemCard.Header = ItemCardHeader;
ItemCard.ProgressBar = ItemCardProgressBar;
ItemCard.TransactionsList = ItemCardTransactionsList;

export { ItemCard };
