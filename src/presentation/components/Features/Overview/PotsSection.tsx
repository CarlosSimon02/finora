"use client";

import { PotDto, PotsSummaryDto } from "@/core/schemas";
import {
  ColoredAmountItem,
  InlineEmptyState,
} from "@/presentation/components/Primitives";
import { cn, formatCurrency } from "@/utils";
import { TipJarIcon } from "@phosphor-icons/react";
import { TitledCard } from "./TitledCard";

type PotsSectionProps = {
  className?: string;
  potsSummary?: PotsSummaryDto;
};

export const PotsSection = ({ className, potsSummary }: PotsSectionProps) => {
  return (
    <TitledCard
      title="Pots"
      href="/pots"
      className={cn("@container/pots", className)}
    >
      {potsSummary?.pots.length && potsSummary?.pots.length > 0 ? (
        <div className="flex-1 pb-0">
          <div className="grid grid-cols-1 gap-5 @2xl/pots:grid-cols-[18.75rem_1fr]">
            <div className="bg-beige-100 flex items-center gap-4 rounded-xl p-4">
              <TipJarIcon
                weight="light"
                className="text-secondary-green size-10"
              />
              <div className="space-y-2">
                <p className="txt-preset-4 text-grey-500">Total Saved</p>
                <p className="txt-preset-1 text-grey-900 break-all">
                  {formatCurrency(potsSummary?.totalSaved)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 self-center @3xs/pots:grid-cols-2">
              {potsSummary?.pots.slice(0, 4).map((pot: PotDto) => (
                <ColoredAmountItem
                  key={pot.id}
                  name={pot.name}
                  color={pot.colorTag}
                  amount={pot.totalSaved}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <InlineEmptyState message="No pots found" />
      )}
    </TitledCard>
  );
};
