import { formatCurrency } from "@/utils";

type ColoredAmountItemProps = {
  name: string;
  color: string;
  amount: number;
};

export const ColoredAmountItem = ({
  name,
  color,
  amount,
}: ColoredAmountItemProps) => {
  return (
    <div className="flex items-center space-x-4">
      <div
        className="h-12 w-1 rounded-full"
        style={{ backgroundColor: color }}
      />
      <div className="flex-1">
        <p className="txt-preset-5 text-grey-500">{name}</p>
        <p className="txt-preset-4-bold text-grey-900 break-all">
          {formatCurrency(amount)}
        </p>
      </div>
    </div>
  );
};
