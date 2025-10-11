import { TransactionDto } from "@/core/schemas";
import { TransactionEmoji } from "../TransactionEmoji";
import AmountDisplay from "./AmountDisplay";
import { TransactionActions } from "./TransactionActions";

type MobileTransactionCardProps = {
  transaction: TransactionDto;
};

const MobileTransactionCard = ({ transaction }: MobileTransactionCardProps) => {
  return (
    <div className="border-grey-100 flex items-center gap-2 border-b py-4 first:pt-0 last:border-b-0 last:pb-0 @lg/transactions:gap-5">
      <div className="flex shrink-0 items-center gap-3">
        <TransactionEmoji emoji={transaction.emoji} />
        <div>
          <p className="txt-preset-4-bold">{transaction.name}</p>
          <span className="txt-preset-5 text-grey-500 mt-1 inline-flex items-center rounded-full text-xs">
            {transaction.category.name}
          </span>
        </div>
      </div>
      <div className="flex w-full flex-col items-end">
        <AmountDisplay type={transaction.type} amount={transaction.amount} />
        <span className="txt-preset-5 text-grey-500 mt-1">
          {transaction.transactionDate.toLocaleDateString()}
        </span>
      </div>
      <TransactionActions transaction={transaction} />
    </div>
  );
};

export default MobileTransactionCard;
