import { formatCurrency } from "@/utils";
import { TitledCard } from "./TitledCard";

type CardBillProps = {
  name: string;
  amount?: number;
  color: string;
};

const CardBill = ({ name, amount = 0, color }: CardBillProps) => {
  return (
    <div
      className="bg-beige-100 grid grid-cols-1 items-center gap-x-4 gap-y-2 rounded-lg border-l-[0.25rem] p-4 @3xs/recurring-bills:grid-cols-[1fr_1fr]"
      style={{ borderLeftColor: color }}
    >
      <div className="txt-preset-4 text-grey-500">{name}</div>
      <p className="txt-preset-4-bold text-grey-900 break-all @3xs/recurring-bills:text-end">
        {formatCurrency(amount)}
      </p>
    </div>
  );
};

type RecurringBillsSectionProps = {
  className?: string;
  paidBills?: number;
  upcomingBills?: number;
  dueSoonBills?: number;
};

export const RecurringBillsSection = ({
  className,
  paidBills = 0,
  upcomingBills = 0,
  dueSoonBills = 0,
}: RecurringBillsSectionProps) => {
  return (
    <TitledCard title="Recurring Bills" href="/bills" className={className}>
      <div className="@container/recurring-bills flex-1 pb-0">
        <div className="space-y-3">
          <CardBill
            name="Paid Bills"
            amount={paidBills}
            color="var(--color-secondary-green)"
          />
          <CardBill
            name="Total Upcoming"
            amount={upcomingBills}
            color="var(--color-secondary-yellow)"
          />
          <CardBill
            name="Due Soon"
            amount={dueSoonBills}
            color="var(--color-secondary-cyan)"
          />
        </div>
      </div>
    </TitledCard>
  );
};
