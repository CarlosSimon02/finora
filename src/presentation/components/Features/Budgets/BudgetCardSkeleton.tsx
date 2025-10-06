import { Card, Skeleton } from "@/presentation/components/Primitives";

export const BudgetCardSkeleton = () => {
  return (
    <Card className="grid gap-5">
      <div className="flex flex-row items-center justify-between gap-10 pb-2">
        <div className="flex items-center gap-4">
          <Skeleton className="size-4 shrink-0 rounded-full" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-5 w-40" />
        <div className="bg-beige-100 border-beige-100 h-8 w-full rounded-lg border-4">
          <Skeleton className="h-full w-3/4 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-6 w-20" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </div>
      <div className="bg-beige-100 space-y-5 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-20" />
        </div>

        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="border-b-grey-500/20 border-b py-3 first:pt-0 last:border-b-0 last:pb-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="size-8 rounded-full" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="space-y-1 text-right">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
