import { Card, Skeleton } from "@/presentation/components/Primitives";
import { cn } from "@/utils";

type BudgetCardSkeletonProps = {
  className?: string;
};

export const BudgetCardSkeleton = ({ className }: BudgetCardSkeletonProps) => {
  return (
    <Card className={cn("grid gap-5", className)}>
      {/* Header section */}
      <div className="flex flex-row items-center justify-between gap-10 pb-2">
        <div className="flex items-center gap-4">
          <Skeleton className="size-4 shrink-0 rounded-full" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
      </div>

      {/* Budget details section */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-48" />

        {/* Progress bar */}
        <div className="h-8 w-full rounded-lg border border-transparent">
          <Skeleton className="h-full rounded-lg" />
        </div>

        {/* Spent and Remaining amounts */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-24" />
          </div>
        </div>
      </div>

      {/* Latest Spending section */}
      <div className="space-y-5 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-8 w-20 rounded-lg" />
        </div>

        {/* Transaction items */}
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-b-grey-500/20 border-b py-3 first:pt-0 last:border-b-0 last:pb-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="size-10 rounded-full" />
                  <Skeleton className="h-5 w-28" />
                </div>
                <div className="space-y-1 text-right">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
