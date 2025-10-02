import { Card, Skeleton } from "@/presentation/components/Primitives";
import { cn } from "@/utils";

type SectionCardSkeletonProps = {
  className?: string;
  titleWidth?: string;
  children?: React.ReactNode;
};

const SectionCardSkeleton = ({
  className,
  titleWidth = "w-28",
  children,
}: SectionCardSkeletonProps) => {
  return (
    <Card className={cn("flex flex-col gap-5", className)}>
      <div className="flex flex-row flex-wrap items-center justify-between gap-x-5 gap-y-2 pb-2">
        <Skeleton className={cn("h-6", titleWidth)} />
        <Skeleton className="h-9 w-28 rounded-lg" />
      </div>
      {children}
    </Card>
  );
};

export const OverviewSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-5 @3xl:grid-cols-3">
        <Card>
          <div className="space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-40" />
          </div>
        </Card>
        <Card>
          <div className="space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-36" />
          </div>
        </Card>
        <Card>
          <div className="space-y-3">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-36" />
          </div>
        </Card>
      </div>

      {/* Main grid */}
      <div className="grid h-full grid-cols-1 gap-6 @3xl:grid-cols-[55%_1fr]">
        {/* Left column: Pots + Transactions */}
        <div className="grid h-full grid-rows-[auto_1fr] gap-6">
          {/* Pots */}
          <SectionCardSkeleton titleWidth="w-24">
            <div className="grid grid-cols-1 gap-5 @2xl/pots:grid-cols-[18.75rem_1fr]">
              <div className="flex items-center gap-4 rounded-xl p-4">
                <Skeleton className="size-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-7 w-24" />
                  <Skeleton className="h-7 w-28" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 self-center @3xs/pots:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-10 rounded-lg"
                  >
                    <div className="flex flex-1 items-center gap-3">
                      <Skeleton className="size-7 rounded-full" />
                      <Skeleton className="h-7 w-full flex-1" />
                    </div>
                    <Skeleton className="h-7 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </SectionCardSkeleton>

          {/* Transactions */}
          <SectionCardSkeleton titleWidth="w-32">
            <div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="border-grey-100 flex items-center gap-x-5 gap-y-2 border-b py-5 first:pt-0 last:border-b-0 last:pb-0 @max-3xs/transactions:flex-col"
                >
                  <div className="flex flex-1 items-center gap-x-5">
                    <Skeleton className="size-10 rounded-full" />
                    <Skeleton className="h-4 w-1/2 max-w-[45ch]" />
                  </div>
                  <div className="flex flex-col items-end gap-2 @max-3xs/transactions:self-end">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </SectionCardSkeleton>
        </div>

        {/* Right column: Budgets + Recurring Bills */}
        <div className="grid h-full grid-rows-[1fr_auto] gap-6">
          {/* Budgets */}
          <SectionCardSkeleton titleWidth="w-24" className="h-full">
            <div className="grid grid-cols-1 content-center items-center gap-5 @md/budgets:grid-cols-[1fr_35%]">
              <div className="flex items-center justify-center">
                <Skeleton className="h-52 w-52 rounded-full" />
              </div>
              <div className="@container/grid">
                <div className="grid grid-cols-1 gap-4 @3xs/grid:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-3 rounded-lg p-4"
                    >
                      <div className="flex flex-1 items-center gap-3">
                        <Skeleton className="size-10 rounded-full" />
                        <Skeleton className="h-7 w-full flex-1" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCardSkeleton>

          {/* Recurring Bills */}
          <SectionCardSkeleton titleWidth="w-36">
            <div className="space-y-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="grid grid-cols-2 items-center gap-8 rounded-lg"
                >
                  <Skeleton className="h-7 w-full flex-1" />
                  <div className="@3xs/recurring-bills:text-end">
                    <Skeleton className="ml-auto h-4 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </SectionCardSkeleton>
        </div>
      </div>
    </div>
  );
};
