"use client";

import { trpc } from "@/lib/trpc/client";
import { FrontViewLayout } from "@/presentation/components/Layouts";
import {
  Card,
  EmptyState,
  ErrorState,
} from "@/presentation/components/Primitives";
import { Pagination } from "@/presentation/components/UI";
import { usePagination } from "@/presentation/hooks";
import { CreatePotDialog } from "./CreatePotDialog";
import { PotCard } from "./PotCard";
import { PotsSkeleton } from "./PotsSkeleton";

export const Pots = () => {
  const pageSize = 6;
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
        <Card className="mx-auto flex max-w-xl flex-col items-center justify-center gap-6">
          <ErrorState
            title="Error loading pots"
            errorMessage={error?.message ?? "Something went wrong"}
          />
        </Card>
      );
    }

    if (!data || !data.data.length) {
      return (
        <Card className="mx-auto flex max-w-xl flex-col items-center justify-center gap-6">
          <EmptyState message="No pots found" />
          <CreatePotDialog />
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
