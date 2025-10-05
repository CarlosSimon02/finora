"use client";

import { FrontViewLayout } from "@/presentation/components/Layouts";
import { Card, ErrorState } from "@/presentation/components/Primitives";
import { BudgetsSection } from "./BudgetsSection";
import { OverviewSkeleton } from "./OverviewSkeleton";
import { PotsSection } from "./PotsSection";
import { RecurringBillsSection } from "./RecurringBillsSection";
import { SummarySection } from "./SummarySection";
import { TransactionsSection } from "./TransactionsSection";

export const Overview = () => {
  const error = false;
  const isLoading = false;

  const body = (() => {
    if (isLoading) {
      return <OverviewSkeleton />;
    }

    if (error) {
      return (
        <Card className="grid place-items-center gap-6 p-4 py-10">
          <ErrorState />
        </Card>
      );
    }

    return (
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
    );
  })();

  return <FrontViewLayout title="Overview">{body}</FrontViewLayout>;
};
