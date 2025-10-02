import { FrontViewLayout } from "@/presentation/components/Layouts";
import { Suspense } from "react";
import { BudgetsSection } from "./BudgetsSection";
import { OverviewSkeleton } from "./OverviewSkeleton";
import { PotsSection } from "./PotsSection";
import { RecurringBillsSection } from "./RecurringBillsSection";
import { SummarySection } from "./SummarySection";
import { TransactionsSection } from "./TransactionsSection";

export const Overview = () => {
  // const { balance, income, expenses } = getSummaryData();
  // const { totalSaved, topPots } = getPotsData();
  // const { recentTransactions } = getTransactionsData();

  // const mappedRecentTransactions = recentTransactions.map((transaction) => ({
  //   name: "Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World Hello World",
  //   amount: transaction.amount,
  //   transactionDate: new Date(),
  //   type: transaction.type,
  //   emoji: transaction.emoji,
  //   id: transaction.id,
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  //   category: {
  //     id: transaction.category.id,
  //     name: transaction.category.name,
  //     colorTag: "green",
  //   },
  //   recipientOrPayer: "Hello World",
  //   description: "Hello World",
  // }));

  // const mappedTopPots = topPots.map((pot) => ({
  //   name: pot.name,
  //   colorTag: pot.color,
  //   target: pot.target,
  //   id: pot.id,
  //   totalSaved: pot.saved,
  //   createdAt: new Date(),
  //   updatedAt: new Date(),
  // }));

  // const customPots = [
  //   {
  //     name: "Custom Pot",
  //     colorTag: "green",
  //     target: 1000000000,
  //     id: "custom-pot",
  //     totalSaved: 1000000000,
  //     createdAt: new Date(),
  //     updatedAt: new Date(),
  //   },
  //   ...mappedTopPots,
  // ];

  // const recurringBills = {
  //   paidBills: 1000000000,
  //   upcomingBills: 1000000000,
  //   dueSoonBills: 1000000000,
  // };

  return (
    <FrontViewLayout title="Overview">
      <Suspense fallback={<OverviewSkeleton />}>
        <div className="space-y-6">
          <SummarySection />

          <div className="grid h-full grid-cols-1 gap-6 @3xl:grid-cols-[55%_1fr]">
            <div className="grid h-full grid-rows-[auto_1fr] gap-6">
              <PotsSection />
              <TransactionsSection className="h-full" />
            </div>

            <div className="grid h-full grid-rows-[1fr_auto] gap-6">
              <BudgetsSection className="h-full" />
              <RecurringBillsSection />
            </div>
          </div>
        </div>
      </Suspense>
    </FrontViewLayout>
  );
};
