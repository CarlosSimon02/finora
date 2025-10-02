import { getRecurringBillsData } from "./_temp-data";
import { TitledCard } from "./TitledCard";

type CardBillProps = {
  name: string;
  amount: number;
  color: string;
};

const CardBill = ({ name, amount, color }: CardBillProps) => {
  return (
    <div
      className="bg-beige-100 flex items-center space-x-4 rounded-lg border-l-[0.25rem] p-4"
      style={{ borderLeftColor: color }}
    >
      <div className="flex-1">
        <p className="txt-preset-4 text-grey-500">{name}</p>
      </div>
      <p className="txt-preset-4-bold text-grey-900">
        ₱{amount.toLocaleString()}
      </p>
    </div>
  );
};

type RecurringBillsSectionProps = {
  className?: string;
};

export const RecurringBillsSection = ({
  className,
}: RecurringBillsSectionProps) => {
  const { topBills } = getRecurringBillsData();

  return (
    <TitledCard title="Recurring Bills" href="/bills" className={className}>
      <div className="flex-1 pb-0">
        <div className="space-y-3">
          <CardBill
            name="Paid Bills"
            amount={topBills[0].amount}
            color="var(--color-secondary-green)"
          />
          <CardBill
            name="Total Upcoming"
            amount={topBills[1].amount}
            color="var(--color-secondary-yellow)"
          />
          <CardBill
            name="Due Soon"
            amount={topBills[2].amount}
            color="var(--color-secondary-cyan)"
          />
        </div>
      </div>
    </TitledCard>
  );
};
