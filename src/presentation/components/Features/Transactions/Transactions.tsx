"use client";

import { TRANSACTION_DEFAULT_PER_PAGE } from "@/core/constants";
import { trpc } from "@/lib/trpc/client";
import { FrontViewLayout } from "@/presentation/components/Layouts";
import {
  Card,
  EmptyState,
  ErrorState,
} from "@/presentation/components/Primitives";
import {
  DEFAULT_SORT_OPTION,
  Pagination,
  SortSelect,
  SORTYPE_OPTIONS,
} from "@/presentation/components/UI";
import { usePagination } from "@/presentation/hooks";
import { CurrencyDollarIcon } from "@phosphor-icons/react";
import { SearchInput } from "../../UI/SearchInput";
import { CreateTransactionDialog } from "./CreateTransaction";
import { TransactionsSkeleton } from "./TransactionsSkeleton";
import { TransactionsTable } from "./TransactionsTable";

export const Transactions = () => {
  const pageSize = TRANSACTION_DEFAULT_PER_PAGE;
  const { page, setPage, validatedParams, search, sort, setPaginationParams } =
    usePagination({
      defaultPage: 1,
      defaultPerPage: pageSize,
      includeParams: ["pagination", "search", "sort"],
    });

  const { data, isLoading, error } = trpc.getPaginatedTransactions.useQuery({
    ...validatedParams,
    sort: validatedParams.sort || DEFAULT_SORT_OPTION.value,
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
      <Card className="space-y-6">
        <div className="flex items-center gap-4">
          <SearchInput
            value={search || ""}
            onChange={(value) => {
              setPaginationParams({
                search: value || undefined,
                pagination: { ...validatedParams.pagination, page: 1 },
              });
            }}
            placeholder="Search transactions..."
            className="flex-1"
          />
          <SortSelect
            value={
              SORTYPE_OPTIONS.find(
                (option) =>
                  option.value.field === sort?.field &&
                  option.value.order === sort?.order
              ) ?? DEFAULT_SORT_OPTION
            }
            onValueChange={(sort) => {
              if (sort && sort.value) {
                setPaginationParams({
                  sort: { field: sort.value.field, order: sort.value.order },
                  pagination: { ...validatedParams.pagination, page: 1 },
                });
              } else {
                setPaginationParams({ sort: undefined });
              }
            }}
          />
        </div>
        {body}
      </Card>
    </FrontViewLayout>
  );
};
