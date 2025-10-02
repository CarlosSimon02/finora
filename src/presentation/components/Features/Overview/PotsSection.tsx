"use client";

import { ColoredAmountItem } from "@/presentation/components/Primitives";
import { cn } from "@/utils";
import { TipJarIcon } from "@phosphor-icons/react";
import { getPotsData } from "./_temp-data";
import { TitledCard } from "./TitledCard";

type PotsSectionProps = {
  className?: string;
};

export function PotsSection({ className }: PotsSectionProps) {
  const { totalSaved, topPots } = getPotsData();

  return (
    <TitledCard
      title="Pots"
      href="/pots"
      className={cn("@container/pots", className)}
    >
      <div className="flex-1 pb-0">
        <div className="grid grid-cols-1 gap-5 @2xl/pots:grid-cols-[18.75rem_1fr]">
          <div className="bg-beige-100 flex items-center gap-4 rounded-xl p-4">
            <TipJarIcon
              weight="light"
              className="text-secondary-green size-10"
            />
            <div className="space-y-2">
              <p className="txt-preset-4 text-grey-500">Total Saved</p>
              <p className="txt-preset-1 text-grey-900">
                ₱{totalSaved.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 @3xs/pots:grid-cols-2">
            {topPots.map((pot) => (
              <ColoredAmountItem
                key={pot.id}
                name={pot.name}
                color={pot.color}
                amount={pot.saved}
              />
            ))}
          </div>
        </div>
      </div>
    </TitledCard>
  );
}
