"use client";

import { TRANSACTION_DEFAULT_PER_PAGE } from "@/core/constants";
import { trpc } from "@/lib/trpc/client";
import { FrontViewLayout } from "@/presentation/components/Layouts";
import {
  Card,
  EmptyState,
  ErrorState,
} from "@/presentation/components/Primitives";
import { Pagination } from "@/presentation/components/UI";
import { usePagination } from "@/presentation/hooks";
import { CurrencyDollarIcon } from "@phosphor-icons/react";
import { CreateTransactionDialog } from "./CreateTransaction";
import { TransactionsSkeleton } from "./TransactionsSkeleton";
import { TransactionsTable } from "./TransactionsTable";

export const Transactions = () => {
  const pageSize = TRANSACTION_DEFAULT_PER_PAGE;
  const { page, setPage, validatedParams, search } = usePagination({
    defaultPage: 1,
    defaultPerPage: pageSize,
    includeParams: ["pagination", "search"],
  });

  const { data, isLoading, error } = trpc.getPaginatedTransactions.useQuery({
    ...validatedParams,
    sort: validatedParams.sort || { field: "createdAt", order: "desc" },
  });

  const body = (() => {
    if (isLoading) {
      return <TransactionsSkeleton />;
    }

    if (error) {
      return <ErrorState />;
    }

    if (!data || !data.data.length) {
      return (
        <EmptyState
          title="No transactions found"
          message="Create your first transaction to start tracking your finances."
          icon={CurrencyDollarIcon}
          action={
            search && search.length > 0 ? undefined : (
              <CreateTransactionDialog />
            )
          }
        />
      );
    }

    return (
      <>
        <TransactionsTable transactions={data.data} />
        {(() => {
          const totalItems = data.meta?.pagination?.totalItems ?? 0;
          const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
          return totalPages > 1 ? (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
              className="pb-0"
            />
          ) : null;
        })()}
      </>
    );
  })();

  return (
    <FrontViewLayout title="Transactions" actions={<CreateTransactionDialog />}>
      <Card className="space-y-6">{body}</Card>
    </FrontViewLayout>
  );
};
