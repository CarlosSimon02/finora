"use client";

import { trpc } from "@/lib/trpc/client";
import { FrontViewLayout } from "@/presentation/components/Layouts";
import {
  Card,
  ErrorState,
  InlineEmptyState,
} from "@/presentation/components/Primitives";
import { Pagination } from "@/presentation/components/UI";
import { usePagination } from "@/presentation/hooks";
import { BudgetCard } from "./BudgetCard";
import { BudgetCardSkeleton } from "./BudgetCardSkeleton";
import { CreateBudgetDialog } from "./CreateBudgetDialog";
import { SpendingSummaryCard } from "./SpendingSummaryCard";
import { SpendingSummaryCardSkeleton } from "./SpendingSummaryCardSkeleton";

export const Budgets = () => {
  const pageSize = 4;
  const { page, setPage, validatedParams } = usePagination({
    defaultPage: 1,
    defaultPerPage: pageSize,
    includeParams: ["pagination"],
  });

  const {
    data: budgetsSummary,
    isLoading: isLoadingBudgetsSummary,
    error: errorBudgetsSummary,
  } = trpc.getBudgetsSummary.useQuery();

  const {
    data: budgets,
    isLoading: isLoadingBudgets,
    error: errorBudgets,
  } = trpc.getPaginatedBudgetsWithTransactions.useQuery({
    search: validatedParams.search,
    filters: validatedParams.filters,
    sort: validatedParams.sort || { field: "createdAt", order: "desc" },
    pagination: { page, perPage: pageSize },
  });

  const body = (() => {
    if (errorBudgetsSummary || errorBudgets) {
      return (
        <Card className="grid place-items-center gap-6 p-4 py-10">
          <ErrorState />
        </Card>
      );
    }

    if (!budgetsSummary || !budgets) {
      return (
        <Card className="grid place-items-center gap-6 p-4 py-10">
          <InlineEmptyState message="No budgets found" color="Gold" />
        </Card>
      );
    }

    return (
      <div className="flex flex-col items-start gap-6 @4xl:flex-row">
        <div className="flex flex-col items-start gap-6 @4xl:flex-row">
          {isLoadingBudgetsSummary ? (
            <SpendingSummaryCardSkeleton />
          ) : (
            <SpendingSummaryCard
              budgetsSummary={budgetsSummary}
              className="w-full min-w-[21.25rem] basis-5/11"
            />
          )}
          <div className="w-full">
            {isLoadingBudgets ? (
              <BudgetCardSkeleton />
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  {budgets.data.map((budget) => (
                    <BudgetCard key={budget.id} budget={budget} />
                  ))}
                </div>

                {(() => {
                  const totalItems = budgets.meta?.pagination?.totalItems ?? 0;
                  const totalPages = Math.max(
                    1,
                    Math.ceil(totalItems / pageSize)
                  );
                  return totalPages > 1 ? (
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  ) : null;
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  })();

  return (
    <FrontViewLayout
      title="Budgets"
      actions={<CreateBudgetDialog />}
    ></FrontViewLayout>
  );
};
