"use client";

import { trpc } from "@/lib/trpc/client";
import { FrontViewLayout } from "@/presentation/components/Layouts";
import { Card, ErrorState } from "@/presentation/components/Primitives";
import { BudgetsSection } from "./BudgetsSection";
import { IncomesSection } from "./IncomesSection";
import { OverviewSkeleton } from "./OverviewSkeleton";
import { PotsSection } from "./PotsSection";
import { SummarySection } from "./SummarySection";
import { TransactionsSection } from "./TransactionsSection";

export const Overview = () => {
  const {
    data: budgetsSummary,
    isLoading: isLoadingBudgetsSummary,
    error: errorBudgetsSummary,
  } = trpc.getBudgetsSummary.useQuery({
    maxBudgetsToShow: 15,
  });

  const {
    data: incomesSummary,
    isLoading: isLoadingIncomesSummary,
    error: errorIncomesSummary,
  } = trpc.getIncomesSummary.useQuery({
    maxIncomesToShow: 15,
  });
  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    error: errorTransactions,
  } = trpc.getPaginatedTransactions.useQuery({
    pagination: { page: 1, perPage: 5 },
    sort: { field: "transactionDate", order: "desc" },
  });
  const {
    data: potsSummary,
    isLoading: isLoadingPotsSummary,
    error: errorPotsSummary,
  } = trpc.getPotsSummary.useQuery({
    maxPotsToShow: 4,
  });

  const isLoading =
    isLoadingBudgetsSummary ||
    isLoadingTransactions ||
    isLoadingIncomesSummary ||
    isLoadingPotsSummary;
  const isError =
    errorBudgetsSummary ||
    errorTransactions ||
    errorIncomesSummary ||
    errorPotsSummary;

  const body = (() => {
    if (isLoading) {
      return <OverviewSkeleton />;
    }

    if (isError) {
      return (
        <Card className="grid place-items-center gap-6 p-4 py-10">
          <ErrorState />
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <SummarySection
          income={incomesSummary?.totalEarned}
          expenses={budgetsSummary?.totalSpending}
          balance={
            Math.abs(incomesSummary?.totalEarned ?? 0) -
            Math.abs(budgetsSummary?.totalSpending ?? 0)
          }
        />

        <div className="grid h-full grid-cols-1 gap-6 @3xl:grid-cols-[55%_1fr]">
          <div className="grid h-full grid-rows-[auto_1fr] gap-6">
            <PotsSection potsSummary={potsSummary} />
            <TransactionsSection
              className="h-full"
              transactions={transactions?.data ?? []}
            />
          </div>

          <div className="grid h-full grid-rows-[1fr_auto] gap-6">
            <BudgetsSection
              className="h-full"
              budgetsSummary={budgetsSummary}
            />
            <IncomesSection
              className="h-full"
              incomesSummary={incomesSummary}
            />
          </div>
        </div>
      </div>
    );
  })();

  return <FrontViewLayout title="Overview">{body}</FrontViewLayout>;
};
