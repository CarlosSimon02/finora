"use client";

import { INCOME_DEFAULT_PER_PAGE } from "@/core/constants";
import { trpc } from "@/lib/trpc/client";
import { FrontViewLayout } from "@/presentation/components/Layouts";
import {
  Card,
  EmptyState,
  ErrorState,
} from "@/presentation/components/Primitives";
import { Pagination } from "@/presentation/components/UI";
import { usePagination } from "@/presentation/hooks";
import { cn } from "@/utils";
import { CurrencyCircleDollarIcon } from "@phosphor-icons/react";
import { CreateIncomeDialog } from "./CreateIncomeDialog";
import { EarningsSummaryCard as EarningsSummaryCardComponent } from "./EarningsSummaryCard";
import { EarningsSummaryCardSkeleton } from "./EarningsSummaryCardSkeleton";
import { IncomeCard } from "./IncomeCard";
import { IncomeCardSkeleton } from "./IncomeCardSkeleton";

type EarningsSummaryCardProps = {
  className?: string;
};

const EarningsSummaryCard = ({ className }: EarningsSummaryCardProps) => {
  const { data, isLoading, error } = trpc.getIncomesSummary.useQuery();

  if (isLoading) {
    return <EarningsSummaryCardSkeleton className={cn(className)} />;
  }

  if (error) {
    return <></>;
  }

  if (!data || !data.count) {
    return <></>;
  }

  return (
    <EarningsSummaryCardComponent
      incomesSummary={data}
      className={cn(className)}
    />
  );
};

type IncomeCardsGridProps = {
  className?: string;
};

const IncomeCardsGrid = ({ className }: IncomeCardsGridProps) => {
  const pageSize = INCOME_DEFAULT_PER_PAGE;

  const { page, setPage, validatedParams } = usePagination({
    defaultPage: 1,
    defaultPerPage: pageSize,
    includeParams: ["pagination"],
  });

  const { data, isLoading, error } =
    trpc.getPaginatedIncomesWithTransactions.useQuery({
      params: {
        ...validatedParams,
        sort: validatedParams.sort || { field: "createdAt", order: "desc" },
      },
    });

  const body = (() => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <IncomeCardSkeleton key={idx} />
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
            title="No incomes found"
            message="Create your first income to start tracking your earnings."
            icon={CurrencyCircleDollarIcon}
            action={<CreateIncomeDialog />}
          />
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          {data.data.map((income) => (
            <IncomeCard key={income.id} income={income} />
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

export const Incomes = () => {
  return (
    <FrontViewLayout title="Incomes" actions={<CreateIncomeDialog />}>
      <div className="flex flex-col items-start gap-6 @4xl:flex-row">
        <EarningsSummaryCard className="w-full min-w-[21.25rem] basis-5/11" />
        <IncomeCardsGrid className="w-full" />
      </div>
    </FrontViewLayout>
  );
};
