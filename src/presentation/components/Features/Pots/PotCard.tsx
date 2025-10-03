"use client";

import { PotDto } from "@/core/schemas/potSchema";
import { Button, Card } from "@/presentation/components/Primitives";
import { formatCurrency } from "@/utils";
import { PlusIcon } from "@phosphor-icons/react";
import { MoneyOperationDialog } from "./MoneyOperationDialog";
import { PotCardActions } from "./PotCardActions";

interface PotCardProps {
  pot: PotDto;
}

export function PotCard({ pot }: PotCardProps) {
  const targetAmount = pot.target;
  const percentSaved = (pot.totalSaved / targetAmount) * 100;
  const formattedPercentage = percentSaved.toFixed(1);

  return (
    <Card className="@container/pots-card space-y-8">
      <div className="flex flex-row items-center justify-between gap-10 pb-2">
        <div className="flex items-center gap-4">
          <div
            className="size-4 shrink-0 rounded-full"
            style={{ backgroundColor: pot.colorTag }}
          />
          <h3 className="txt-preset-2">{pot.name}</h3>
        </div>
        <PotCardActions pot={pot} className="shrink-0" />
      </div>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="txt-preset-4 text-grey-500">Total Saved</p>
          <p className="txt-preset-1 text-grey-900">
            {formatCurrency(pot.totalSaved)}
          </p>
        </div>

        <div className="bg-beige-100 mb-3 h-2 w-full rounded-full">
          <div
            className="h-2 rounded-full"
            style={{
              width: `${Math.min(100, percentSaved)}%`,
              backgroundColor: pot.colorTag,
            }}
          />
        </div>
        <div className="txt-preset-5 text-grey-500 flex justify-between">
          <span className="txt-preset-5-bold">{formattedPercentage}%</span>
          <span>Target of {formatCurrency(targetAmount)}</span>
        </div>
      </div>
      <div className="grid gap-4 @2xs/pots-card:grid-cols-2">
        <MoneyOperationDialog pot={pot} operation="add">
          <Button
            variant="secondary"
            icon={{ component: PlusIcon }}
            label="Add Money"
            className="w-full"
          />
        </MoneyOperationDialog>
        <MoneyOperationDialog pot={pot} operation="withdraw">
          <Button variant="secondary" label="Withdraw" className="w-full" />
        </MoneyOperationDialog>
      </div>
    </Card>
  );
}
