"use client";

import { trpc } from "@/lib/trpc/client";
import {
  Card,
  EmptyState,
  ErrorState,
} from "@/presentation/components/Primitives";
import { Pagination } from "@/presentation/components/UI";
import { usePagination } from "@/presentation/hooks";
import { cn } from "@/utils";
import { ChartBarIcon } from "@phosphor-icons/react";
import { FrontViewLayout } from "../../Layouts";
import { BudgetCard } from "./BudgetCard";
import { BudgetCardSkeleton } from "./BudgetCardSkeleton";
import { CreateBudgetDialog } from "./CreateBudgetDialog";
import { SpendingSummaryCard as SpendingSummaryCardComponent } from "./SpendingSummaryCard";
import { SpendingSummaryCardSkeleton } from "./SpendingSummaryCardSkeleton";

type SpendingSummaryCardProps = {
  className?: string;
};

const SpendingSummaryCard = ({ className }: SpendingSummaryCardProps) => {
  const { data, isLoading, error } = trpc.getBudgetsSummary.useQuery();

  if (isLoading) {
    return <SpendingSummaryCardSkeleton className={cn(className)} />;
  }

  if (error) {
    return <></>;
  }

  if (!data) {
    return <></>;
  }

  return (
    <SpendingSummaryCardComponent
      budgetsSummary={data}
      className={cn(className)}
    />
  );
};

type BudgetCardsGridProps = {
  className?: string;
};

const BudgetCardsGrid = ({ className }: BudgetCardsGridProps) => {
  const pageSize = 4;

  const { page, setPage, validatedParams } = usePagination({
    defaultPage: 1,
    defaultPerPage: pageSize,
    includeParams: ["pagination"],
  });

  const { data, isLoading, error } =
    trpc.getPaginatedBudgetsWithTransactions.useQuery({
      ...validatedParams,
      sort: validatedParams.sort || { field: "createdAt", order: "desc" },
    });

  const body = (() => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <BudgetCardSkeleton key={idx} />
          ))}
        </div>
      );
    }

    if (error) {
      return (
        <Card className="grid place-items-center gap-6 p-4 py-10">
          <ErrorState />
        </Card>
      );
    }

    if (!data || !data.data.length) {
      return (
        <Card className="grid place-items-center gap-6 p-4 py-10">
          <EmptyState
            title="No budgets found"
            message="Create your first budget to start tracking your spending."
            icon={ChartBarIcon}
            action={<CreateBudgetDialog />}
          />
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {data.data.map((budget) => (
            <BudgetCard key={budget.id} budget={budget} />
          ))}
        </div>

        {(() => {
          const totalItems = data.meta?.pagination?.totalItems ?? 0;
          const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
          return totalPages > 1 ? (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          ) : null;
        })()}
      </div>
    );
  })();

  return <div className={cn(className)}>{body}</div>;
};

export const Budgets = () => {
  return (
    <FrontViewLayout title="Budgets" actions={<CreateBudgetDialog />}>
      <div className="flex flex-col items-start gap-6 @4xl:flex-row">
        <SpendingSummaryCard className="w-full min-w-[21.25rem] basis-5/11" />
        <BudgetCardsGrid className="w-full" />
      </div>
    </FrontViewLayout>
  );
};
