"use client";

import { POT_DEFAULT_PER_PAGE } from "@/core/constants";
import { trpc } from "@/lib/trpc/client";
import { FrontViewLayout } from "@/presentation/components/Layouts";
import {
  Card,
  EmptyState,
  ErrorState,
} from "@/presentation/components/Primitives";
import { Pagination } from "@/presentation/components/UI";
import { usePagination } from "@/presentation/hooks";
import { TipJarIcon } from "@phosphor-icons/react";
import { CreatePotDialog } from "./CreatePotDialog";
import { PotCard } from "./PotCard";
import { PotsSkeleton } from "./PotsSkeleton";

export const Pots = () => {
  const pageSize = POT_DEFAULT_PER_PAGE;
  const { page, setPage, validatedParams } = usePagination({
    defaultPage: 1,
    defaultPerPage: pageSize,
    includeParams: ["pagination"],
  });

  const { data, isLoading, error } = trpc.getPaginatedPots.useQuery({
    search: validatedParams.search,
    filters: validatedParams.filters,
    sort: validatedParams.sort || { field: "createdAt", order: "desc" },
    pagination: {
      page,
      perPage: pageSize,
    },
  });

  const body = (() => {
    if (isLoading) {
      return <PotsSkeleton />;
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
            title="No pots yet"
            message="Create your first pot to start saving."
            icon={TipJarIcon}
            action={<CreatePotDialog />}
          />
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 @3xl:grid-cols-2 @4xl:grid-cols-3">
          {data.data.map((pot) => (
            <PotCard key={pot.id} pot={pot} />
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

  return (
    <FrontViewLayout title="Pots" actions={<CreatePotDialog />}>
      {body}
    </FrontViewLayout>
  );
};
