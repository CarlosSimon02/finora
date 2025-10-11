import { TransactionType } from "@/core/schemas";
import { cn, formatCurrency } from "@/utils/strings";

type AmountDisplayProps = {
  type: TransactionType;
  amount: number;
  className?: string;
};

const AmountDisplay = ({
  type,
  amount,
  className = "",
}: AmountDisplayProps) => {
  return (
    <span
      className={cn(
        type === "income" ? "text-secondary-green" : "text-grey-900",
        "!txt-preset-4-bold !font-bold",
        className
      )}
    >
      {type === "income" ? "+" : "-"}
      {formatCurrency(amount)}
    </span>
  );
};

export default AmountDisplay;
