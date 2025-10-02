import { FrontViewLayout } from "@/presentation/components/Layouts";
import { Suspense } from "react";
import { BudgetsSection } from "./BudgetsSection";
import { OverviewSkeleton } from "./OverviewSkeleton";
import { PotsSection } from "./PotsSection";
import { RecurringBillsSection } from "./RecurringBillsSection";
import { SummarySection } from "./SummarySection";
import { TransactionsSection } from "./TransactionsSection";

export const Overview = () => {
  return (
    <FrontViewLayout title="Overview">
      <Suspense fallback={<OverviewSkeleton />}>
        <div className="space-y-6">
          <SummarySection />

          <div className="grid grid-cols-1 gap-6 @3xl:grid-cols-[55%_1fr]">
            <div className="space-y-6">
              <PotsSection />
              <TransactionsSection />
            </div>

            <div className="grid h-full grid-rows-[1fr_auto] gap-6">
              <BudgetsSection />
              <RecurringBillsSection />
            </div>
          </div>
        </div>
      </Suspense>
    </FrontViewLayout>
  );
};
