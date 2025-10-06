import { Card, Skeleton } from "@/presentation/components/Primitives";
import { cn } from "@/utils";

type SpendingSummaryCardSkeletonProps = {
  className?: string;
};

export const SpendingSummaryCardSkeleton = ({
  className,
}: SpendingSummaryCardSkeletonProps) => {
  return (
    <Card className={cn("grid gap-8", className)}>
      <div className="flex justify-center py-5">
        <Skeleton className="h-48 w-48 rounded-full" />
      </div>
      <div className="space-y-6">
        <div>
          <Skeleton className="h-7 w-40" />
        </div>
        <div>
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="text-grey-500 border-b-grey-100 flex items-center justify-between border-b py-4 first:pt-0 last:border-b-0 last:pb-0"
            >
              <div className="flex shrink-0 items-center gap-4">
                <Skeleton className="h-6 w-1 rounded-full" />
                <Skeleton className="h-5 w-24" />
              </div>
              <div className="text-right">
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
