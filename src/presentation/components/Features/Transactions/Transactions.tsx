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
import { SearchInput } from "@/presentation/components/UI/SearchInput";
import { usePagination } from "@/presentation/hooks";
import { CurrencyDollarIcon } from "@phosphor-icons/react";
import { CategoryFilterSelect } from "./CategoryFilterSelect";
import { CreateTransactionDialog } from "./CreateTransaction";
import { TransactionsSkeleton } from "./TransactionsSkeleton";
import { TransactionsTable } from "./TransactionsTable";

export const Transactions = () => {
  const pageSize = TRANSACTION_DEFAULT_PER_PAGE;
  const {
    page,
    setPage,
    validatedParams,
    search,
    sort,
    setPaginationParams,
    filters,
  } = usePagination({
    defaultPage: 1,
    defaultPerPage: pageSize,
    includeParams: ["pagination", "search", "sort", "filters"],
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
        <div className="flex items-center justify-between gap-3 @4xl:gap-6">
          <SearchInput
            defaultValue={search || ""}
            onSearch={(value) => {
              setPaginationParams({
                search: value || undefined,
                pagination: { ...validatedParams.pagination, page: 1 },
              });
            }}
            placeholder="Search transactions"
            className="max-w-[25rem] flex-1"
          />
          <div className="flex items-center gap-3 @4xl:gap-6">
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
            <CategoryFilterSelect
              value={
                filters[0]?.value
                  ? {
                      label: filters[0].value as string,
                      value: filters[0].value as string,
                    }
                  : { value: "all transactions", label: "All Transactions" }
              }
              onChange={(value) => {
                if (value?.value === "all transactions") {
                  setPaginationParams({
                    filters: [],
                  });
                } else {
                  setPaginationParams({
                    filters: [
                      {
                        field: "category.name",
                        operator: "==",
                        value: value?.value,
                      },
                    ],
                  });
                }
              }}
            />
          </div>
        </div>
        {body}
      </Card>
    </FrontViewLayout>
  );
};
