"use client";

import { PotDto } from "@/core/schemas";
import { Button } from "@/presentation/components/Primitives";
import { ItemCard } from "@/presentation/components/UI";
import { formatCurrency } from "@/utils";
import { PlusIcon } from "@phosphor-icons/react";
import { MoneyOperationDialog } from "./MoneyOperationDialog";
import { PotCardActions } from "./PotCardActions";

type PotCardProps = {
  pot: PotDto;
};

export const PotCard = ({ pot }: PotCardProps) => {
  const targetAmount = pot.target;
  const percentSaved = (pot.totalSaved / targetAmount) * 100;
  const formattedPercentage = percentSaved.toFixed(1);

  return (
    <ItemCard className="@container/pots-card gap-8">
      <ItemCard.Header
        name={pot.name}
        colorTag={pot.colorTag}
        actions={<PotCardActions pot={pot} />}
      />
      <div>
        <div className="mb-4 flex items-baseline-last justify-between">
          <p className="txt-preset-4 text-grey-500">Total Saved</p>
          <p className="txt-preset-1 text-grey-900">
            {formatCurrency(pot.totalSaved)}
          </p>
        </div>

        <ItemCard.ProgressBar percent={percentSaved} color={pot.colorTag} />
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
    </ItemCard>
  );
};
