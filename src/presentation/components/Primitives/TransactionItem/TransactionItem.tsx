"use client";

import { TransactionDto } from "@/core/schemas";
import { Emoji } from "@/presentation/components/Primitives";
import { cn } from "@/utils/strings";
import { AmountDisplay } from "./AmountDisplay";

type TransactionItemProps = {
  transaction: TransactionDto;
  actions?: React.ReactNode;
  emojiClassName?: string;
  showCategory?: boolean;
  className?: string;
};

export const TransactionItem = ({
  transaction,
  actions,
  emojiClassName,
  showCategory = true,
  className,
}: TransactionItemProps) => {
  return (
    <div
      className={cn(
        "border-grey-100 @container/transaction-item w-full border-b py-4 first:pt-0 last:border-b-0 last:pb-0",
        className
      )}
    >
      <div className="flex w-full items-center gap-2 @md/transaction-item:gap-5">
        <div className="mr-5 flex flex-1 items-center gap-3">
          <Emoji
            emoji={transaction.emoji}
            className={cn(emojiClassName, "@max-2xs/transaction-item:hidden")}
          />
          <div className={"flex flex-col gap-1"}>
            <p className="txt-preset-4-bold">{transaction.name}</p>
            {showCategory && (
              <span className="txt-preset-5 text-grey-500 inline-flex items-center">
                {transaction.category.name}
              </span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <AmountDisplay type={transaction.type} amount={transaction.amount} />
          <span className="txt-preset-5 text-grey-500">
            {transaction.transactionDate.toLocaleDateString()}
          </span>
        </div>
        {actions}
      </div>
    </div>
  );
};
