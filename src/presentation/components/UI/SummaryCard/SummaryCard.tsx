"use client";

import { Card } from "@/presentation/components/Primitives";
import { cn, formatCurrency, safeNumber } from "@/utils";
import React from "react";

type SummaryItem = {
  id: string;
  name: string;
  colorTag?: string;
  mainValue: number;
  subText?: string | React.ReactNode;
};

type SummaryCardProps = {
  title: string;
  items: SummaryItem[];
  chart?: React.ReactNode;
  className?: string;
};

const SummaryListItem: React.FC<{ item: SummaryItem }> = ({ item }) => {
  const mainValue = safeNumber(item.mainValue);

  return (
    <div
      key={item.id}
      className="text-grey-500 border-b-grey-100 @container/summary-list-item flex items-center justify-between border-b py-4 first:pt-0 last:border-b-0 last:pb-0"
    >
      <div className="flex items-center gap-4">
        <div
          className="h-6 w-1 rounded-full"
          style={{ backgroundColor: item.colorTag }}
        />
        <span className="txt-preset-4">{item.name}</span>
      </div>
      <div className="txt-preset-5 flex items-baseline-last gap-1 text-right @max-xs/summary-list-item:flex-col">
        <span className="txt-preset-3-bold text-grey-900">
          {formatCurrency(mainValue, { showDecimal: false })}
        </span>
        {item.subText ? (
          <span className="text-muted-foreground">{item.subText}</span>
        ) : null}
      </div>
    </div>
  );
};

export const SummaryCard = ({
  title,
  items,
  chart,
  className,
}: SummaryCardProps) => {
  return (
    <Card className={cn("grid gap-8", className)}>
      {chart ? <div className="flex justify-center py-5">{chart}</div> : null}

      <div className="space-y-6">
        <div>
          <h2 className="txt-preset-2">{title}</h2>
        </div>

        <div>
          {items.map((it) => (
            <SummaryListItem key={it.id} item={it} />
          ))}
        </div>
      </div>
    </Card>
  );
};
