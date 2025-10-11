import { TransactionDto } from "@/core/schemas";
import { formatDate } from "@/utils/strings";
import { TransactionEmoji } from "../TransactionEmoji";
import AmountDisplay from "./AmountDisplay";
import { TransactionActions } from "./TransactionActions";

interface TransactionRowProps {
  transaction: TransactionDto;
}

const TransactionRow = ({ transaction }: TransactionRowProps) => {
  return (
    <tr
      key={transaction.id}
      className="border-grey-100 border-b last:border-b-0 [&>*]:py-3 [&>*]:first:pl-4 [&>*]:last:pr-4 last:[&>*]:pb-0"
    >
      <td>
        <div className="flex items-center gap-4">
          <TransactionEmoji emoji={transaction.emoji} />
          <span className="txt-preset-4-bold">{transaction.name}</span>
        </div>
      </td>
      <td className="txt-preset-5 text-grey-500">
        {transaction.category.name}
      </td>
      <td className="txt-preset-5 text-grey-500">
        {formatDate(transaction.transactionDate)}
      </td>
      <td>
        <AmountDisplay type={transaction.type} amount={transaction.amount} />
      </td>
      <td className="text-right">
        <TransactionActions transaction={transaction} />
      </td>
    </tr>
  );
};

export default TransactionRow;
